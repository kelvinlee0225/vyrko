import { createCrudService } from './crud'

export interface Rol {
  id: string
  createdAt: string
  updatedAt: string
  nombre: string
}

export interface CreateRolDto {
  nombre: string
}

export type UpdateRolDto = Partial<CreateRolDto>

export const rolService = createCrudService<Rol, CreateRolDto, UpdateRolDto>('roles')
