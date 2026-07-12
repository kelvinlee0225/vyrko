import { createCrudService } from './crud'

export interface CategoriaMaterial {
  id: string
  createdAt: string
  updatedAt: string
  nombre: string
}

export interface CreateCategoriaMaterialDto {
  nombre: string
}

export type UpdateCategoriaMaterialDto = Partial<CreateCategoriaMaterialDto>

export const categoriaMaterialService = createCrudService<
  CategoriaMaterial,
  CreateCategoriaMaterialDto,
  UpdateCategoriaMaterialDto
>('categorias-material')
