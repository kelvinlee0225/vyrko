import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Cotizacion } from './entities/cotizacion.entity';
import { CotizacionLinea } from './entities/cotizacion-linea.entity';
import { CreateCotizacionDto } from './dto/create-cotizacion.dto';
import { UpdateCotizacionDto } from './dto/update-cotizacion.dto';
import { CreateCotizacionLineaDto } from './dto/create-cotizacion-linea.dto';
import { UpdateCotizacionLineaDto } from './dto/update-cotizacion-linea.dto';
import { ClienteService } from '../cliente/cliente.service';
import { VehiculoService } from '../vehiculo/vehiculo.service';
import { ServicioService } from '../servicio/servicio.service';
import { PiezaService } from '../pieza/pieza.service';

const COTIZACION_RELATIONS = {
  cliente: true,
  vehiculo: true,
  lineas: { servicio: true, pieza: true },
} as const;

@Injectable()
export class CotizacionService {
  constructor(
    @InjectRepository(Cotizacion)
    private readonly cotizacionRepository: Repository<Cotizacion>,
    @InjectRepository(CotizacionLinea)
    private readonly cotizacionLineaRepository: Repository<CotizacionLinea>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly clienteService: ClienteService,
    private readonly vehiculoService: VehiculoService,
    private readonly servicioService: ServicioService,
    private readonly piezaService: PiezaService,
  ) {}

  async create(createCotizacionDto: CreateCotizacionDto) {
    const { clienteId, vehiculoId, lineas, ...rest } = createCotizacionDto;
    const cliente = await this.clienteService.findOne(clienteId);
    const vehiculo = await this.vehiculoService.findOne(vehiculoId);
    const lineasConRelaciones = await this.resolveLineas(lineas);
    const numero = await this.generateNumero();

    const cotizacionId = await this.dataSource.transaction(async (manager) => {
      const cotizacion = await manager.save(
        manager.create(Cotizacion, {
          ...rest,
          estado: rest.estado ?? 'pendiente',
          numero,
          cliente,
          vehiculo,
        }),
      );

      await manager.save(
        CotizacionLinea,
        lineasConRelaciones.map((linea) =>
          manager.create(CotizacionLinea, { ...linea, cotizacion }),
        ),
      );

      return cotizacion.id;
    });

    return this.findOneDetail(cotizacionId);
  }

  async findAllDetail() {
    const cotizaciones = await this.cotizacionRepository.find({
      relations: COTIZACION_RELATIONS,
    });
    return cotizaciones.map((cotizacion) => ({
      ...cotizacion,
      ...this.computeTotales(cotizacion),
    }));
  }

  async findOneDetail(id: string) {
    const cotizacion = await this.findOne(id);
    return { ...cotizacion, ...this.computeTotales(cotizacion) };
  }

  async findOne(id: string): Promise<Cotizacion> {
    const cotizacion = await this.cotizacionRepository.findOne({
      where: { id },
      relations: COTIZACION_RELATIONS,
    });
    if (!cotizacion) {
      throw new NotFoundException(`Cotizacion ${id} no encontrada`);
    }
    return cotizacion;
  }

  async update(id: string, updateCotizacionDto: UpdateCotizacionDto) {
    const cotizacion = await this.findOne(id);
    const { clienteId, vehiculoId, ...rest } = updateCotizacionDto;
    if (clienteId) {
      cotizacion.cliente = await this.clienteService.findOne(clienteId);
    }
    if (vehiculoId) {
      cotizacion.vehiculo = await this.vehiculoService.findOne(vehiculoId);
    }
    Object.assign(cotizacion, rest);
    await this.cotizacionRepository.save(cotizacion);
    return this.findOneDetail(id);
  }

  async remove(id: string): Promise<void> {
    const cotizacion = await this.findOne(id);
    await this.cotizacionRepository.remove(cotizacion);
  }

  async addLinea(
    cotizacionId: string,
    createCotizacionLineaDto: CreateCotizacionLineaDto,
  ) {
    const cotizacion = await this.findOne(cotizacionId);
    const [linea] = await this.resolveLineas([createCotizacionLineaDto]);
    await this.cotizacionLineaRepository.save(
      this.cotizacionLineaRepository.create({ ...linea, cotizacion }),
    );
    return this.findOneDetail(cotizacionId);
  }

  async updateLinea(
    cotizacionId: string,
    lineaId: string,
    updateCotizacionLineaDto: UpdateCotizacionLineaDto,
  ) {
    const linea = await this.findLinea(cotizacionId, lineaId);
    const { servicioId, piezaId, ...rest } = updateCotizacionLineaDto;
    if (servicioId) {
      linea.servicio = await this.servicioService.findOne(servicioId);
    }
    if (piezaId) {
      linea.pieza = await this.piezaService.findOne(piezaId);
    }
    Object.assign(linea, rest);
    await this.cotizacionLineaRepository.save(linea);
    return this.findOneDetail(cotizacionId);
  }

  async removeLinea(cotizacionId: string, lineaId: string) {
    const linea = await this.findLinea(cotizacionId, lineaId);
    await this.cotizacionLineaRepository.remove(linea);
    return this.findOneDetail(cotizacionId);
  }

  private async findLinea(
    cotizacionId: string,
    lineaId: string,
  ): Promise<CotizacionLinea> {
    const linea = await this.cotizacionLineaRepository.findOne({
      where: { id: lineaId, cotizacion: { id: cotizacionId } },
      relations: { servicio: true, pieza: true },
    });
    if (!linea) {
      throw new NotFoundException(
        `Linea ${lineaId} no encontrada en la cotizacion ${cotizacionId}`,
      );
    }
    return linea;
  }

  private async resolveLineas(lineas: CreateCotizacionLineaDto[]) {
    return Promise.all(
      lineas.map(async ({ servicioId, piezaId, ...rest }) => ({
        ...rest,
        servicio: await this.servicioService.findOne(servicioId),
        pieza: piezaId ? await this.piezaService.findOne(piezaId) : null,
      })),
    );
  }

  private async generateNumero(): Promise<string> {
    const count = await this.cotizacionRepository.count();
    return `COT-${String(count + 1).padStart(6, '0')}`;
  }

  private computeTotales(cotizacion: Cotizacion) {
    const subtotal = cotizacion.lineas.reduce(
      (sum, linea) =>
        sum +
        parseFloat(linea.cantidad) * parseFloat(linea.precioUnitario) -
        (linea.descuento ? parseFloat(linea.descuento) : 0),
      0,
    );
    const itbisTotal = cotizacion.lineas.reduce(
      (sum, linea) => sum + parseFloat(linea.itbis),
      0,
    );
    const descuentoGlobal = cotizacion.descuentoGlobal
      ? parseFloat(cotizacion.descuentoGlobal)
      : 0;
    const total = subtotal + itbisTotal - descuentoGlobal;

    return {
      subtotal: subtotal.toFixed(2),
      itbisTotal: itbisTotal.toFixed(2),
      total: total.toFixed(2),
    };
  }
}
