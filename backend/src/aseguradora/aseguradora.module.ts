import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aseguradora } from './entities/aseguradora.entity';
import { AseguradoraService } from './aseguradora.service';
import { AseguradoraController } from './aseguradora.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Aseguradora])],
  controllers: [AseguradoraController],
  providers: [AseguradoraService],
  exports: [AseguradoraService],
})
export class AseguradoraModule {}
