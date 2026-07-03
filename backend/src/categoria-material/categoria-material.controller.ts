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
import { CategoriaMaterialService } from './categoria-material.service';
import { CreateCategoriaMaterialDto } from './dto/create-categoria-material.dto';
import { UpdateCategoriaMaterialDto } from './dto/update-categoria-material.dto';

@ApiBearerAuth()
@Controller('categorias-material')
export class CategoriaMaterialController {
  constructor(
    private readonly categoriaMaterialService: CategoriaMaterialService,
  ) {}

  @Post()
  create(@Body() createCategoriaMaterialDto: CreateCategoriaMaterialDto) {
    return this.categoriaMaterialService.create(createCategoriaMaterialDto);
  }

  @Get()
  findAll() {
    return this.categoriaMaterialService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriaMaterialService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoriaMaterialDto: UpdateCategoriaMaterialDto,
  ) {
    return this.categoriaMaterialService.update(id, updateCategoriaMaterialDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriaMaterialService.remove(id);
  }
}
