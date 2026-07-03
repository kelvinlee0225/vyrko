import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pieza } from './entities/pieza.entity';
import { PiezaService } from './pieza.service';
import { PiezaController } from './pieza.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Pieza])],
  controllers: [PiezaController],
  providers: [PiezaService],
  exports: [PiezaService],
})
export class PiezaModule {}
