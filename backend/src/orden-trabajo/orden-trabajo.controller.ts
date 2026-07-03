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
import { OrdenTrabajoService } from './orden-trabajo.service';
import { CreateOrdenTrabajoDto } from './dto/create-orden-trabajo.dto';
import { UpdateOrdenTrabajoDto } from './dto/update-orden-trabajo.dto';
import { CreateOrdenTrabajoConsumoDto } from './dto/create-orden-trabajo-consumo.dto';
import { UpdateOrdenTrabajoConsumoDto } from './dto/update-orden-trabajo-consumo.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';

@ApiBearerAuth()
@Controller('ordenes-trabajo')
export class OrdenTrabajoController {
  constructor(private readonly ordenTrabajoService: OrdenTrabajoService) {}

  @Post()
  create(
    @Body() createOrdenTrabajoDto: CreateOrdenTrabajoDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.ordenTrabajoService.create(createOrdenTrabajoDto, user.sub);
  }

  @Get()
  findAll() {
    return this.ordenTrabajoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordenTrabajoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrdenTrabajoDto: UpdateOrdenTrabajoDto,
  ) {
    return this.ordenTrabajoService.update(id, updateOrdenTrabajoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.ordenTrabajoService.remove(id, user.sub);
  }

  @Post(':id/consumos')
  addConsumo(
    @Param('id') id: string,
    @Body() createOrdenTrabajoConsumoDto: CreateOrdenTrabajoConsumoDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.ordenTrabajoService.addConsumo(
      id,
      createOrdenTrabajoConsumoDto,
      user.sub,
    );
  }

  @Patch(':id/consumos/:consumoId')
  updateConsumo(
    @Param('id') id: string,
    @Param('consumoId') consumoId: string,
    @Body() updateOrdenTrabajoConsumoDto: UpdateOrdenTrabajoConsumoDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.ordenTrabajoService.updateConsumo(
      id,
      consumoId,
      updateOrdenTrabajoConsumoDto,
      user.sub,
    );
  }

  @Delete(':id/consumos/:consumoId')
  removeConsumo(
    @Param('id') id: string,
    @Param('consumoId') consumoId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.ordenTrabajoService.removeConsumo(id, consumoId, user.sub);
  }
}
