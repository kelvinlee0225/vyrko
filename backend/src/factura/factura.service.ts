import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Factura } from './entities/factura.entity';
import { FacturaLinea } from './entities/factura-linea.entity';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { CreateFacturaLineaDto } from './dto/create-factura-linea.dto';
import { UpdateFacturaLineaDto } from './dto/update-factura-linea.dto';
import { CreateFacturaFromCotizacionDto } from './dto/create-factura-from-cotizacion.dto';
import { RegistrarPagoDto } from './dto/registrar-pago.dto';
import { ClienteService } from '../cliente/cliente.service';
import { VehiculoService } from '../vehiculo/vehiculo.service';
import { CotizacionService } from '../cotizacion/cotizacion.service';
import { OrdenTrabajoService } from '../orden-trabajo/orden-trabajo.service';
import { ServicioService } from '../servicio/servicio.service';
import { PiezaService } from '../pieza/pieza.service';

const FACTURA_RELATIONS = {
  cliente: true,
  vehiculo: true,
  cotizacion: true,
  ordenTrabajo: true,
  lineas: { servicio: true, pieza: true },
} as const;

const ESTADOS_BLOQUEADOS = ['pagada', 'anulada'];

@Injectable()
export class FacturaService {
  constructor(
    @InjectRepository(Factura)
    private readonly facturaRepository: Repository<Factura>,
    @InjectRepository(FacturaLinea)
    private readonly facturaLineaRepository: Repository<FacturaLinea>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly clienteService: ClienteService,
    private readonly vehiculoService: VehiculoService,
    private readonly cotizacionService: CotizacionService,
    private readonly ordenTrabajoService: OrdenTrabajoService,
    private readonly servicioService: ServicioService,
    private readonly piezaService: PiezaService,
  ) {}

  async create(createFacturaDto: CreateFacturaDto) {
    const {
      clienteId,
      vehiculoId,
      cotizacionId,
      ordenTrabajoId,
      lineas,
      ...rest
    } = createFacturaDto;
    const cliente = await this.clienteService.findOne(clienteId);
    const vehiculo = vehiculoId
      ? await this.vehiculoService.findOne(vehiculoId)
      : null;
    const cotizacion = cotizacionId
      ? await this.cotizacionService.findOne(cotizacionId)
      : null;
    const ordenTrabajo = ordenTrabajoId
      ? await this.ordenTrabajoService.findOne(ordenTrabajoId)
      : null;
    const lineasConRelaciones = await this.resolveLineas(lineas);
    const numero = await this.generateNumero();

    const facturaId = await this.dataSource.transaction(async (manager) => {
      const factura = await manager.save(
        manager.create(Factura, {
          ...rest,
          estado: rest.estado ?? 'pendiente',
          numero,
          cliente,
          vehiculo,
          cotizacion,
          ordenTrabajo,
        }),
      );

      await manager.save(
        FacturaLinea,
        lineasConRelaciones.map((linea) =>
          manager.create(FacturaLinea, { ...linea, factura }),
        ),
      );

      return factura.id;
    });

    return this.findOneDetail(facturaId);
  }

  async createFromCotizacion(
    cotizacionId: string,
    dto: CreateFacturaFromCotizacionDto,
  ) {
    const cotizacion = await this.cotizacionService.findOne(cotizacionId);
    const ordenTrabajo = dto.ordenTrabajoId
      ? await this.ordenTrabajoService.findOne(dto.ordenTrabajoId)
      : null;
    const numero = await this.generateNumero();
    const fechaEmision =
      dto.fechaEmision ?? new Date().toISOString().slice(0, 10);

    const facturaId = await this.dataSource.transaction(async (manager) => {
      const factura = await manager.save(
        manager.create(Factura, {
          numero,
          estado: 'pendiente',
          fechaEmision,
          fechaVencimiento: dto.fechaVencimiento ?? null,
          notas: dto.notas ?? null,
          descuentoGlobal: cotizacion.descuentoGlobal,
          cliente: cotizacion.cliente,
          vehiculo: cotizacion.vehiculo,
          cotizacion,
          ordenTrabajo,
        }),
      );

      await manager.save(
        FacturaLinea,
        cotizacion.lineas.map((linea) =>
          manager.create(FacturaLinea, {
            descripcion: linea.descripcion,
            cantidad: linea.cantidad,
            precioUnitario: linea.precioUnitario,
            itbis: linea.itbis,
            descuento: linea.descuento,
            servicio: linea.servicio,
            pieza: linea.pieza,
            factura,
          }),
        ),
      );

      return factura.id;
    });

    return this.findOneDetail(facturaId);
  }

  async findAllDetail() {
    const facturas = await this.facturaRepository.find({
      relations: FACTURA_RELATIONS,
    });
    return facturas.map((factura) => ({
      ...factura,
      ...this.computeTotales(factura),
    }));
  }

  async findOneDetail(id: string) {
    const factura = await this.findOne(id);
    return { ...factura, ...this.computeTotales(factura) };
  }

  async findOne(id: string): Promise<Factura> {
    const factura = await this.facturaRepository.findOne({
      where: { id },
      relations: FACTURA_RELATIONS,
    });
    if (!factura) {
      throw new NotFoundException(`Factura ${id} no encontrada`);
    }
    return factura;
  }

  async update(id: string, updateFacturaDto: UpdateFacturaDto) {
    const factura = await this.findOne(id);
    const { clienteId, vehiculoId, cotizacionId, ordenTrabajoId, ...rest } =
      updateFacturaDto;
    if (clienteId) {
      factura.cliente = await this.clienteService.findOne(clienteId);
    }
    if (vehiculoId) {
      factura.vehiculo = await this.vehiculoService.findOne(vehiculoId);
    }
    if (cotizacionId) {
      factura.cotizacion = await this.cotizacionService.findOne(cotizacionId);
    }
    if (ordenTrabajoId) {
      factura.ordenTrabajo =
        await this.ordenTrabajoService.findOne(ordenTrabajoId);
    }
    Object.assign(factura, rest);
    await this.facturaRepository.save(factura);
    return this.findOneDetail(id);
  }

  async remove(id: string): Promise<void> {
    const factura = await this.findOne(id);
    this.ensureEditable(factura);
    await this.facturaRepository.remove(factura);
  }

  async addLinea(
    facturaId: string,
    createFacturaLineaDto: CreateFacturaLineaDto,
  ) {
    const factura = await this.findOne(facturaId);
    this.ensureEditable(factura);
    const [linea] = await this.resolveLineas([createFacturaLineaDto]);
    await this.facturaLineaRepository.save(
      this.facturaLineaRepository.create({ ...linea, factura }),
    );
    return this.findOneDetail(facturaId);
  }

  async updateLinea(
    facturaId: string,
    lineaId: string,
    updateFacturaLineaDto: UpdateFacturaLineaDto,
  ) {
    const factura = await this.findOne(facturaId);
    this.ensureEditable(factura);
    const linea = await this.findLinea(facturaId, lineaId);
    const { servicioId, piezaId, ...rest } = updateFacturaLineaDto;
    if (servicioId) {
      linea.servicio = await this.servicioService.findOne(servicioId);
    }
    if (piezaId) {
      linea.pieza = await this.piezaService.findOne(piezaId);
    }
    Object.assign(linea, rest);
    await this.facturaLineaRepository.save(linea);
    return this.findOneDetail(facturaId);
  }

  async removeLinea(facturaId: string, lineaId: string) {
    const factura = await this.findOne(facturaId);
    this.ensureEditable(factura);
    const linea = await this.findLinea(facturaId, lineaId);
    await this.facturaLineaRepository.remove(linea);
    return this.findOneDetail(facturaId);
  }

  async registrarPago(id: string, registrarPagoDto: RegistrarPagoDto) {
    const factura = await this.findOne(id);
    if (factura.estado === 'anulada') {
      throw new BadRequestException(
        `No se puede registrar un pago sobre la factura ${id} porque esta anulada`,
      );
    }

    const { total } = this.computeTotales(factura);
    const montoPagado =
      parseFloat(factura.montoPagado) + parseFloat(registrarPagoDto.monto);

    factura.montoPagado = montoPagado.toFixed(2);
    factura.metodoPago = registrarPagoDto.metodoPago ?? factura.metodoPago;
    factura.fechaPago =
      registrarPagoDto.fechaPago ?? new Date().toISOString().slice(0, 10);
    factura.estado =
      montoPagado >= parseFloat(total) ? 'pagada' : 'pago_parcial';

    await this.facturaRepository.save(factura);
    return this.findOneDetail(id);
  }

  async anular(id: string) {
    const factura = await this.findOne(id);
    if (parseFloat(factura.montoPagado) > 0) {
      throw new BadRequestException(
        `No se puede anular la factura ${id} porque ya tiene pagos registrados`,
      );
    }
    factura.estado = 'anulada';
    await this.facturaRepository.save(factura);
    return this.findOneDetail(id);
  }

  private ensureEditable(factura: Factura) {
    if (ESTADOS_BLOQUEADOS.includes(factura.estado)) {
      throw new BadRequestException(
        `La factura ${factura.id} no se puede modificar en estado "${factura.estado}"`,
      );
    }
  }

  private async findLinea(
    facturaId: string,
    lineaId: string,
  ): Promise<FacturaLinea> {
    const linea = await this.facturaLineaRepository.findOne({
      where: { id: lineaId, factura: { id: facturaId } },
      relations: { servicio: true, pieza: true },
    });
    if (!linea) {
      throw new NotFoundException(
        `Linea ${lineaId} no encontrada en la factura ${facturaId}`,
      );
    }
    return linea;
  }

  private async resolveLineas(lineas: CreateFacturaLineaDto[]) {
    return Promise.all(
      lineas.map(async ({ servicioId, piezaId, ...rest }) => ({
        ...rest,
        servicio: await this.servicioService.findOne(servicioId),
        pieza: piezaId ? await this.piezaService.findOne(piezaId) : null,
      })),
    );
  }

  private async generateNumero(): Promise<string> {
    const count = await this.facturaRepository.count();
    return `FAC-${String(count + 1).padStart(6, '0')}`;
  }

  private computeTotales(factura: Factura) {
    const subtotal = factura.lineas.reduce(
      (sum, linea) =>
        sum +
        parseFloat(linea.cantidad) * parseFloat(linea.precioUnitario) -
        (linea.descuento ? parseFloat(linea.descuento) : 0),
      0,
    );
    const itbisTotal = factura.lineas.reduce(
      (sum, linea) => sum + parseFloat(linea.itbis),
      0,
    );
    const descuentoGlobal = factura.descuentoGlobal
      ? parseFloat(factura.descuentoGlobal)
      : 0;
    const total = subtotal + itbisTotal - descuentoGlobal;
    const saldoPendiente = total - parseFloat(factura.montoPagado);

    return {
      subtotal: subtotal.toFixed(2),
      itbisTotal: itbisTotal.toFixed(2),
      total: total.toFixed(2),
      saldoPendiente: saldoPendiente.toFixed(2),
    };
  }
}
