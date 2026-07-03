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
import { CotizacionService } from './cotizacion.service';
import { CreateCotizacionDto } from './dto/create-cotizacion.dto';
import { UpdateCotizacionDto } from './dto/update-cotizacion.dto';
import { CreateCotizacionLineaDto } from './dto/create-cotizacion-linea.dto';
import { UpdateCotizacionLineaDto } from './dto/update-cotizacion-linea.dto';

@ApiBearerAuth()
@Controller('cotizaciones')
export class CotizacionController {
  constructor(private readonly cotizacionService: CotizacionService) {}

  @Post()
  create(@Body() createCotizacionDto: CreateCotizacionDto) {
    return this.cotizacionService.create(createCotizacionDto);
  }

  @Get()
  findAll() {
    return this.cotizacionService.findAllDetail();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cotizacionService.findOneDetail(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCotizacionDto: UpdateCotizacionDto,
  ) {
    return this.cotizacionService.update(id, updateCotizacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cotizacionService.remove(id);
  }

  @Post(':id/lineas')
  addLinea(
    @Param('id') id: string,
    @Body() createCotizacionLineaDto: CreateCotizacionLineaDto,
  ) {
    return this.cotizacionService.addLinea(id, createCotizacionLineaDto);
  }

  @Patch(':id/lineas/:lineaId')
  updateLinea(
    @Param('id') id: string,
    @Param('lineaId') lineaId: string,
    @Body() updateCotizacionLineaDto: UpdateCotizacionLineaDto,
  ) {
    return this.cotizacionService.updateLinea(
      id,
      lineaId,
      updateCotizacionLineaDto,
    );
  }

  @Delete(':id/lineas/:lineaId')
  removeLinea(@Param('id') id: string, @Param('lineaId') lineaId: string) {
    return this.cotizacionService.removeLinea(id, lineaId);
  }
}
