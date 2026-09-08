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
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AllowPasswordChange } from '../auth/decorators/allow-password-change.decorator';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';

@ApiBearerAuth()
@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @AllowPasswordChange()
  @Get('me')
  getMe(@CurrentUser() user: JwtPayload) {
    return this.usuarioService.findOne(user.sub);
  }

  @AllowPasswordChange()
  @Patch('me')
  updateMe(
    @CurrentUser() user: JwtPayload,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usuarioService.updateProfile(user.sub, updateProfileDto);
  }

  @Roles('admin')
  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }

  @Roles('admin')
  @Get()
  findAll() {
    return this.usuarioService.findAll();
  }

  @Roles('admin')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuarioService.findOne(id);
  }

  @Roles('admin')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.usuarioService.update(id, updateUsuarioDto, user.sub);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.usuarioService.remove(id, user.sub);
  }
}
