import { api } from '../lib/api'
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

export interface UpdateProfileDto {
  nombre?: string
  username?: string
  password?: string
  currentPassword?: string
}

const crud = createCrudService<Usuario, CreateUsuarioDto, UpdateUsuarioDto>('usuarios')

export const usuarioService = {
  ...crud,
  getMe: () => api.get<Usuario>('/usuarios/me').then((r) => r.data),
  updateMe: (dto: UpdateProfileDto) => api.patch<Usuario>('/usuarios/me', dto).then((r) => r.data),
}
