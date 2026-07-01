import { Body, Controller, Get, Put } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { EmpresaService } from './empresa.service';
import { UpsertEmpresaDto } from './dto/upsert-empresa.dto';

@ApiBearerAuth()
@Controller('empresa')
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  @Get()
  find() {
    return this.empresaService.find();
  }

  @Put()
  upsert(@Body() upsertEmpresaDto: UpsertEmpresaDto) {
    return this.empresaService.upsert(upsertEmpresaDto);
  }
}
