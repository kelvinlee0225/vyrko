import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehiculo } from './entities/vehiculo.entity';
import { VehiculoService } from './vehiculo.service';
import { VehiculoController } from './vehiculo.controller';
import { ClienteModule } from '../cliente/cliente.module';
import { AseguradoraModule } from '../aseguradora/aseguradora.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vehiculo]),
    ClienteModule,
    AseguradoraModule,
  ],
  controllers: [VehiculoController],
  providers: [VehiculoService],
  exports: [VehiculoService],
})
export class VehiculoModule {}
