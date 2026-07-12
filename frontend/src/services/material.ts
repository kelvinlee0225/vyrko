import { createCrudService } from './crud'
import type { CategoriaMaterial } from './categoriaMaterial'

export interface Material {
  id: string
  createdAt: string
  updatedAt: string
  categoria: CategoriaMaterial
  codigo: string
  nombre: string
  precioCosto: string
  stockActual: string
  stockMinimo: number
}

export interface CreateMaterialDto {
  categoriaId: string
  codigo: string
  nombre: string
  precioCosto: string
  stockActual?: string
  stockMinimo?: number
}

export type UpdateMaterialDto = Partial<CreateMaterialDto>

export const materialService = createCrudService<Material, CreateMaterialDto, UpdateMaterialDto>('materiales')
