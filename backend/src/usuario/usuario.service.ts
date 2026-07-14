import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RolService } from '../rol/rol.service';

const SALT_ROUNDS = 10;

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly rolService: RolService,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const { rolId, password, ...rest } = createUsuarioDto;
    const rol = await this.rolService.findOne(rolId);
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    return this.usuarioRepository.save(
      this.usuarioRepository.create({ ...rest, rol, passwordHash }),
    );
  }

  findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find({ relations: { rol: true } });
  }

  async findOne(id: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      relations: { rol: true },
    });
    if (!usuario) {
      throw new NotFoundException(`Usuario ${id} no encontrado`);
    }
    return usuario;
  }

  findByUsernameWithPassword(username: string): Promise<Usuario | null> {
    return this.usuarioRepository
      .createQueryBuilder('usuario')
      .addSelect('usuario.passwordHash')
      .leftJoinAndSelect('usuario.rol', 'rol')
      .where('usuario.username = :username', { username })
      .getOne();
  }

  async update(
    id: string,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    const usuario = await this.findOne(id);
    const { rolId, password, ...rest } = updateUsuarioDto;
    if (rolId) {
      usuario.rol = await this.rolService.findOne(rolId);
    }
    if (password) {
      usuario.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    }
    Object.assign(usuario, rest);
    return this.usuarioRepository.save(usuario);
  }

  async remove(id: string): Promise<void> {
    const usuario = await this.findOne(id);
    await this.usuarioRepository.remove(usuario);
  }

  async updateProfile(
    id: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Usuario> {
    const usuario = await this.usuarioRepository
      .createQueryBuilder('usuario')
      .addSelect('usuario.passwordHash')
      .leftJoinAndSelect('usuario.rol', 'rol')
      .where('usuario.id = :id', { id })
      .getOne();
    if (!usuario) {
      throw new NotFoundException(`Usuario ${id} no encontrado`);
    }

    const { nombre, username, password, currentPassword } = updateProfileDto;

    if (password) {
      const passwordMatches = await bcrypt.compare(
        currentPassword ?? '',
        usuario.passwordHash,
      );
      if (!passwordMatches) {
        throw new BadRequestException('La contraseña actual no es correcta.');
      }
      usuario.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    }
    if (nombre !== undefined) {
      usuario.nombre = nombre;
    }
    if (username !== undefined) {
      usuario.username = username;
    }

    try {
      return await this.usuarioRepository.save(usuario);
    } catch (error) {
      if ((error as { code?: string }).code === '23505') {
        throw new ConflictException('El nombre de usuario ya está en uso.');
      }
      throw error;
    }
  }
}
