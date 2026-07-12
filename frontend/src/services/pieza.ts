import { createCrudService } from './crud'

export interface Pieza {
  id: string
  createdAt: string
  updatedAt: string
  nombre: string
}

export interface CreatePiezaDto {
  nombre: string
}

export type UpdatePiezaDto = Partial<CreatePiezaDto>

export const piezaService = createCrudService<Pieza, CreatePiezaDto, UpdatePiezaDto>('piezas')
