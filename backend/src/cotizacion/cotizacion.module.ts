import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cotizacion } from './entities/cotizacion.entity';
import { CotizacionLinea } from './entities/cotizacion-linea.entity';
import { CotizacionService } from './cotizacion.service';
import { CotizacionController } from './cotizacion.controller';
import { ClienteModule } from '../cliente/cliente.module';
import { VehiculoModule } from '../vehiculo/vehiculo.module';
import { ServicioModule } from '../servicio/servicio.module';
import { PiezaModule } from '../pieza/pieza.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cotizacion, CotizacionLinea]),
    ClienteModule,
    VehiculoModule,
    ServicioModule,
    PiezaModule,
  ],
  controllers: [CotizacionController],
  providers: [CotizacionService],
  exports: [CotizacionService],
})
export class CotizacionModule {}
