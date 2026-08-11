import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecuenciaNcf } from './entities/secuencia-ncf.entity';
import { SecuenciaNcfService } from './secuencia-ncf.service';
import { SecuenciaNcfController } from './secuencia-ncf.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SecuenciaNcf])],
  controllers: [SecuenciaNcfController],
  providers: [SecuenciaNcfService],
  exports: [SecuenciaNcfService],
})
export class SecuenciaNcfModule {}
