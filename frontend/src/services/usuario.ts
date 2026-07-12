import { createCrudService } from './crud'
import type { Rol } from './rol'

export interface Usuario {
  id: string
  createdAt: string
  updatedAt: string
  rol: Rol
  nombre: string
  username: string
  activo: boolean
}

export interface CreateUsuarioDto {
  rolId: string
  nombre: string
  username: string
  password: string
  activo?: boolean
}

export type UpdateUsuarioDto = Partial<CreateUsuarioDto>

export const usuarioService = createCrudService<Usuario, CreateUsuarioDto, UpdateUsuarioDto>('usuarios')
