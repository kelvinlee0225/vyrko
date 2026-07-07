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
import { FacturaService } from './factura.service';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { CreateFacturaLineaDto } from './dto/create-factura-linea.dto';
import { UpdateFacturaLineaDto } from './dto/update-factura-linea.dto';
import { CreateFacturaFromCotizacionDto } from './dto/create-factura-from-cotizacion.dto';
import { RegistrarPagoDto } from './dto/registrar-pago.dto';

@ApiBearerAuth()
@Controller('facturas')
export class FacturaController {
  constructor(private readonly facturaService: FacturaService) {}

  @Post()
  create(@Body() createFacturaDto: CreateFacturaDto) {
    return this.facturaService.create(createFacturaDto);
  }

  @Post('from-cotizacion/:cotizacionId')
  createFromCotizacion(
    @Param('cotizacionId') cotizacionId: string,
    @Body() createFacturaFromCotizacionDto: CreateFacturaFromCotizacionDto,
  ) {
    return this.facturaService.createFromCotizacion(
      cotizacionId,
      createFacturaFromCotizacionDto,
    );
  }

  @Get()
  findAll() {
    return this.facturaService.findAllDetail();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.facturaService.findOneDetail(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFacturaDto: UpdateFacturaDto) {
    return this.facturaService.update(id, updateFacturaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.facturaService.remove(id);
  }

  @Post(':id/lineas')
  addLinea(
    @Param('id') id: string,
    @Body() createFacturaLineaDto: CreateFacturaLineaDto,
  ) {
    return this.facturaService.addLinea(id, createFacturaLineaDto);
  }

  @Patch(':id/lineas/:lineaId')
  updateLinea(
    @Param('id') id: string,
    @Param('lineaId') lineaId: string,
    @Body() updateFacturaLineaDto: UpdateFacturaLineaDto,
  ) {
    return this.facturaService.updateLinea(id, lineaId, updateFacturaLineaDto);
  }

  @Delete(':id/lineas/:lineaId')
  removeLinea(@Param('id') id: string, @Param('lineaId') lineaId: string) {
    return this.facturaService.removeLinea(id, lineaId);
  }

  @Post(':id/pagos')
  registrarPago(
    @Param('id') id: string,
    @Body() registrarPagoDto: RegistrarPagoDto,
  ) {
    return this.facturaService.registrarPago(id, registrarPagoDto);
  }

  @Post(':id/anular')
  anular(@Param('id') id: string) {
    return this.facturaService.anular(id);
  }
}
