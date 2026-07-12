import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { TecnicoService } from './tecnico.service';
import { CreateTecnicoDto } from './dto/create-tecnico.dto';
import { UpdateTecnicoDto } from './dto/update-tecnico.dto';

@ApiBearerAuth()
@Controller('tecnicos')
export class TecnicoController {
  constructor(private readonly tecnicoService: TecnicoService) {}

  @Roles('admin')
  @Post()
  create(@Body() createTecnicoDto: CreateTecnicoDto) {
    return this.tecnicoService.create(createTecnicoDto);
  }

  @Get()
  findAll() {
    return this.tecnicoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tecnicoService.findOne(id);
  }

  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTecnicoDto: UpdateTecnicoDto) {
    return this.tecnicoService.update(id, updateTecnicoDto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tecnicoService.remove(id);
  }
}
