import { createCrudService } from './crud'

export interface Tecnico {
  id: string
  createdAt: string
  updatedAt: string
  nombre: string
  especialidad: string
  activo: boolean
}

export interface CreateTecnicoDto {
  nombre: string
  especialidad: string
  activo?: boolean
}

export type UpdateTecnicoDto = Partial<CreateTecnicoDto>

export const tecnicoService = createCrudService<Tecnico, CreateTecnicoDto, UpdateTecnicoDto>('tecnicos')
