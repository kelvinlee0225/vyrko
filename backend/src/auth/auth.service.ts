import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsuarioService } from '../usuario/usuario.service';
import { Usuario } from '../usuario/entities/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<Usuario> {
    const usuario =
      await this.usuarioService.findByUsernameWithPassword(username);
    if (!usuario || !usuario.activo) {
      throw new UnauthorizedException('Credenciales invalidas');
    }
    const passwordMatches = await bcrypt.compare(
      password,
      usuario.passwordHash,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('Credenciales invalidas');
    }
    return usuario;
  }

  login(usuario: Usuario) {
    const payload = {
      sub: usuario.id,
      username: usuario.username,
      rol: usuario.rol.nombre,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
