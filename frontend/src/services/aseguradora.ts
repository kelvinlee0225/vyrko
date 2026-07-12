import { createCrudService } from './crud'

export interface Aseguradora {
  id: string
  createdAt: string
  updatedAt: string
  nombre: string
  rncCedula: string | null
  telefono: string | null
  correo: string | null
  direccion: string | null
}

export interface CreateAseguradoraDto {
  nombre: string
  rncCedula?: string
  telefono?: string
  correo?: string
  direccion?: string
}

export type UpdateAseguradoraDto = Partial<CreateAseguradoraDto>

export const aseguradoraService = createCrudService<Aseguradora, CreateAseguradoraDto, UpdateAseguradoraDto>(
  'aseguradoras',
)
