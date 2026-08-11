import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { SecuenciaNcfService } from './secuencia-ncf.service';
import { CreateSecuenciaNcfDto } from './dto/create-secuencia-ncf.dto';

@ApiBearerAuth()
@Controller('secuencias-ncf')
export class SecuenciaNcfController {
  constructor(private readonly secuenciaNcfService: SecuenciaNcfService) {}

  @Roles('admin')
  @Post()
  create(@Body() createSecuenciaNcfDto: CreateSecuenciaNcfDto) {
    return this.secuenciaNcfService.create(createSecuenciaNcfDto);
  }

  @Get()
  findAll() {
    return this.secuenciaNcfService.findAll();
  }
}
