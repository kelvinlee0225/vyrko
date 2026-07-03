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
import { AseguradoraService } from './aseguradora.service';
import { CreateAseguradoraDto } from './dto/create-aseguradora.dto';
import { UpdateAseguradoraDto } from './dto/update-aseguradora.dto';

@ApiBearerAuth()
@Controller('aseguradoras')
export class AseguradoraController {
  constructor(private readonly aseguradoraService: AseguradoraService) {}

  @Post()
  create(@Body() createAseguradoraDto: CreateAseguradoraDto) {
    return this.aseguradoraService.create(createAseguradoraDto);
  }

  @Get()
  findAll() {
    return this.aseguradoraService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aseguradoraService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAseguradoraDto: UpdateAseguradoraDto,
  ) {
    return this.aseguradoraService.update(id, updateAseguradoraDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aseguradoraService.remove(id);
  }
}
