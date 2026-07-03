import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { OrdenTrabajo } from './entities/orden-trabajo.entity';
import { OrdenTrabajoConsumo } from './entities/orden-trabajo-consumo.entity';
import { CreateOrdenTrabajoDto } from './dto/create-orden-trabajo.dto';
import { UpdateOrdenTrabajoDto } from './dto/update-orden-trabajo.dto';
import { CreateOrdenTrabajoConsumoDto } from './dto/create-orden-trabajo-consumo.dto';
import { UpdateOrdenTrabajoConsumoDto } from './dto/update-orden-trabajo-consumo.dto';
import { CotizacionService } from '../cotizacion/cotizacion.service';
import { VehiculoService } from '../vehiculo/vehiculo.service';
import { TecnicoService } from '../tecnico/tecnico.service';
import { MaterialService } from '../material/material.service';
import { MovimientoInventarioService } from '../movimiento-inventario/movimiento-inventario.service';

const ORDEN_TRABAJO_RELATIONS = {
  cotizacion: true,
  vehiculo: true,
  tecnico: true,
  consumos: { material: true },
} as const;

@Injectable()
export class OrdenTrabajoService {
  constructor(
    @InjectRepository(OrdenTrabajo)
    private readonly ordenTrabajoRepository: Repository<OrdenTrabajo>,
    @InjectRepository(OrdenTrabajoConsumo)
    private readonly ordenTrabajoConsumoRepository: Repository<OrdenTrabajoConsumo>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly cotizacionService: CotizacionService,
    private readonly vehiculoService: VehiculoService,
    private readonly tecnicoService: TecnicoService,
    private readonly materialService: MaterialService,
    private readonly movimientoInventarioService: MovimientoInventarioService,
  ) {}

  async create(
    createOrdenTrabajoDto: CreateOrdenTrabajoDto,
    usuarioId: string,
  ) {
    const { cotizacionId, vehiculoId, tecnicoId, consumos, ...rest } =
      createOrdenTrabajoDto;
    const cotizacion = cotizacionId
      ? await this.cotizacionService.findOne(cotizacionId)
      : null;
    const vehiculo = await this.vehiculoService.findOne(vehiculoId);
    const tecnico = await this.tecnicoService.findOne(tecnicoId);
    const consumosConRelaciones = await this.resolveConsumos(consumos ?? []);

    const ordenTrabajoId = await this.dataSource.transaction(
      async (manager) => {
        const ordenTrabajo = await manager.save(
          manager.create(OrdenTrabajo, {
            ...rest,
            estado: rest.estado ?? 'recibido',
            cotizacion,
            vehiculo,
            tecnico,
          }),
        );

        if (consumosConRelaciones.length > 0) {
          await manager.save(
            OrdenTrabajoConsumo,
            consumosConRelaciones.map((consumo) =>
              manager.create(OrdenTrabajoConsumo, {
                ...consumo,
                ordenTrabajo,
              }),
            ),
          );
        }

        return ordenTrabajo.id;
      },
    );

    for (const consumo of consumosConRelaciones) {
      await this.registrarSalida(
        consumo.material.id,
        consumo.cantidadReal,
        ordenTrabajoId,
        usuarioId,
      );
    }

    return this.findOne(ordenTrabajoId);
  }

  findAll(): Promise<OrdenTrabajo[]> {
    return this.ordenTrabajoRepository.find({
      relations: ORDEN_TRABAJO_RELATIONS,
    });
  }

  async findOne(id: string): Promise<OrdenTrabajo> {
    const ordenTrabajo = await this.ordenTrabajoRepository.findOne({
      where: { id },
      relations: ORDEN_TRABAJO_RELATIONS,
    });
    if (!ordenTrabajo) {
      throw new NotFoundException(`Orden de trabajo ${id} no encontrada`);
    }
    return ordenTrabajo;
  }

  async update(
    id: string,
    updateOrdenTrabajoDto: UpdateOrdenTrabajoDto,
  ): Promise<OrdenTrabajo> {
    const ordenTrabajo = await this.findOne(id);
    const { cotizacionId, vehiculoId, tecnicoId, ...rest } =
      updateOrdenTrabajoDto;
    if (cotizacionId) {
      ordenTrabajo.cotizacion =
        await this.cotizacionService.findOne(cotizacionId);
    }
    if (vehiculoId) {
      ordenTrabajo.vehiculo = await this.vehiculoService.findOne(vehiculoId);
    }
    if (tecnicoId) {
      ordenTrabajo.tecnico = await this.tecnicoService.findOne(tecnicoId);
    }
    Object.assign(ordenTrabajo, rest);
    return this.ordenTrabajoRepository.save(ordenTrabajo);
  }

  async remove(id: string, usuarioId: string): Promise<void> {
    const ordenTrabajo = await this.findOne(id);
    for (const consumo of ordenTrabajo.consumos) {
      await this.registrarEntrada(
        consumo.material.id,
        consumo.cantidadReal,
        id,
        usuarioId,
        'Reversion por eliminacion de orden de trabajo',
      );
    }
    await this.ordenTrabajoRepository.remove(ordenTrabajo);
  }

  async addConsumo(
    ordenTrabajoId: string,
    createOrdenTrabajoConsumoDto: CreateOrdenTrabajoConsumoDto,
    usuarioId: string,
  ) {
    const ordenTrabajo = await this.findOne(ordenTrabajoId);
    const [consumo] = await this.resolveConsumos([
      createOrdenTrabajoConsumoDto,
    ]);
    await this.ordenTrabajoConsumoRepository.save(
      this.ordenTrabajoConsumoRepository.create({ ...consumo, ordenTrabajo }),
    );
    await this.registrarSalida(
      consumo.material.id,
      consumo.cantidadReal,
      ordenTrabajoId,
      usuarioId,
    );
    return this.findOne(ordenTrabajoId);
  }

  async updateConsumo(
    ordenTrabajoId: string,
    consumoId: string,
    updateOrdenTrabajoConsumoDto: UpdateOrdenTrabajoConsumoDto,
    usuarioId: string,
  ) {
    const consumo = await this.findConsumo(ordenTrabajoId, consumoId);
    const { materialId, cantidadReal } = updateOrdenTrabajoConsumoDto;
    const cambiaStock = materialId !== undefined || cantidadReal !== undefined;

    if (cambiaStock) {
      await this.registrarEntrada(
        consumo.material.id,
        consumo.cantidadReal,
        ordenTrabajoId,
        usuarioId,
        'Ajuste de consumo',
      );
    }

    if (materialId) {
      consumo.material = await this.materialService.findOne(materialId);
    }
    if (cantidadReal) {
      consumo.cantidadReal = cantidadReal;
    }
    await this.ordenTrabajoConsumoRepository.save(consumo);

    if (cambiaStock) {
      await this.registrarSalida(
        consumo.material.id,
        consumo.cantidadReal,
        ordenTrabajoId,
        usuarioId,
        'Ajuste de consumo',
      );
    }

    return this.findOne(ordenTrabajoId);
  }

  async removeConsumo(
    ordenTrabajoId: string,
    consumoId: string,
    usuarioId: string,
  ) {
    const consumo = await this.findConsumo(ordenTrabajoId, consumoId);
    await this.registrarEntrada(
      consumo.material.id,
      consumo.cantidadReal,
      ordenTrabajoId,
      usuarioId,
      'Reversion de consumo eliminado',
    );
    await this.ordenTrabajoConsumoRepository.remove(consumo);
    return this.findOne(ordenTrabajoId);
  }

  private async findConsumo(
    ordenTrabajoId: string,
    consumoId: string,
  ): Promise<OrdenTrabajoConsumo> {
    const consumo = await this.ordenTrabajoConsumoRepository.findOne({
      where: { id: consumoId, ordenTrabajo: { id: ordenTrabajoId } },
      relations: { material: true },
    });
    if (!consumo) {
      throw new NotFoundException(
        `Consumo ${consumoId} no encontrado en la orden de trabajo ${ordenTrabajoId}`,
      );
    }
    return consumo;
  }

  private async resolveConsumos(consumos: CreateOrdenTrabajoConsumoDto[]) {
    return Promise.all(
      consumos.map(async ({ materialId, ...rest }) => ({
        ...rest,
        material: await this.materialService.findOne(materialId),
      })),
    );
  }

  private registrarSalida(
    materialId: string,
    cantidad: string,
    ordenTrabajoId: string,
    usuarioId: string,
    detalle = 'Consumo en orden de trabajo',
  ) {
    return this.movimientoInventarioService.create(
      {
        materialId,
        tipoMovimiento: 'salida',
        cantidad,
        motivo: `${detalle} ${ordenTrabajoId}`,
      },
      usuarioId,
    );
  }

  private registrarEntrada(
    materialId: string,
    cantidad: string,
    ordenTrabajoId: string,
    usuarioId: string,
    detalle = 'Reversion de consumo en orden de trabajo',
  ) {
    return this.movimientoInventarioService.create(
      {
        materialId,
        tipoMovimiento: 'entrada',
        cantidad,
        motivo: `${detalle} ${ordenTrabajoId}`,
      },
      usuarioId,
    );
  }
}
