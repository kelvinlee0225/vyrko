import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Factura } from './entities/factura.entity';
import { FacturaLinea } from './entities/factura-linea.entity';
import { FacturaService } from './factura.service';
import { FacturaController } from './factura.controller';
import { ClienteModule } from '../cliente/cliente.module';
import { VehiculoModule } from '../vehiculo/vehiculo.module';
import { CotizacionModule } from '../cotizacion/cotizacion.module';
import { OrdenTrabajoModule } from '../orden-trabajo/orden-trabajo.module';
import { ServicioModule } from '../servicio/servicio.module';
import { PiezaModule } from '../pieza/pieza.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Factura, FacturaLinea]),
    ClienteModule,
    VehiculoModule,
    CotizacionModule,
    OrdenTrabajoModule,
    ServicioModule,
    PiezaModule,
  ],
  controllers: [FacturaController],
  providers: [FacturaService],
  exports: [FacturaService],
})
export class FacturaModule {}
