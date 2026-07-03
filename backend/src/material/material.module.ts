import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Material } from './entities/material.entity';
import { MaterialService } from './material.service';
import { MaterialController } from './material.controller';
import { CategoriaMaterialModule } from '../categoria-material/categoria-material.module';

@Module({
  imports: [TypeOrmModule.forFeature([Material]), CategoriaMaterialModule],
  controllers: [MaterialController],
  providers: [MaterialService],
  exports: [MaterialService],
})
export class MaterialModule {}
