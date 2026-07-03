import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenTrabajo } from './entities/orden-trabajo.entity';
import { OrdenTrabajoConsumo } from './entities/orden-trabajo-consumo.entity';
import { OrdenTrabajoService } from './orden-trabajo.service';
import { OrdenTrabajoController } from './orden-trabajo.controller';
import { CotizacionModule } from '../cotizacion/cotizacion.module';
import { VehiculoModule } from '../vehiculo/vehiculo.module';
import { TecnicoModule } from '../tecnico/tecnico.module';
import { MaterialModule } from '../material/material.module';
import { MovimientoInventarioModule } from '../movimiento-inventario/movimiento-inventario.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrdenTrabajo, OrdenTrabajoConsumo]),
    CotizacionModule,
    VehiculoModule,
    TecnicoModule,
    MaterialModule,
    MovimientoInventarioModule,
  ],
  controllers: [OrdenTrabajoController],
  providers: [OrdenTrabajoService],
  exports: [OrdenTrabajoService],
})
export class OrdenTrabajoModule {}
