import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsuarioService } from '../usuario/usuario.service';
import { Usuario } from '../usuario/entities/usuario.entity';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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

  login(usuario: Usuario): TokenPair {
    return {
      accessToken: this.signAccessToken(usuario),
      refreshToken: this.signRefreshToken(usuario),
    };
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    let payload: { sub: string };
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Refresh token invalido o expirado');
    }

    let usuario: Usuario;
    try {
      usuario = await this.usuarioService.findOne(payload.sub);
    } catch {
      throw new UnauthorizedException('Refresh token invalido o expirado');
    }
    if (!usuario.activo) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    return this.login(usuario);
  }

  private signAccessToken(usuario: Usuario): string {
    return this.jwtService.sign({
      sub: usuario.id,
      username: usuario.username,
      rol: usuario.rol.nombre,
    });
  }

  private signRefreshToken(usuario: Usuario): string {
    return this.jwtService.sign(
      { sub: usuario.id },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_EXPIRES_IN',
        ) as `${number}${'s' | 'm' | 'h' | 'd'}`,
      },
    );
  }
}
