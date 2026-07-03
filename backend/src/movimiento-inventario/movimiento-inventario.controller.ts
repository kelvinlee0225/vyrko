import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { MovimientoInventarioService } from './movimiento-inventario.service';
import { CreateMovimientoInventarioDto } from './dto/create-movimiento-inventario.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';

@ApiBearerAuth()
@Controller('movimientos-inventario')
export class MovimientoInventarioController {
  constructor(
    private readonly movimientoInventarioService: MovimientoInventarioService,
  ) {}

  @Post()
  create(
    @Body() createMovimientoInventarioDto: CreateMovimientoInventarioDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.movimientoInventarioService.create(
      createMovimientoInventarioDto,
      user.sub,
    );
  }

  @Get()
  findAll() {
    return this.movimientoInventarioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movimientoInventarioService.findOne(id);
  }
}
