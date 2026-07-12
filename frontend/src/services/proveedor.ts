import { createCrudService } from './crud'

export interface Proveedor {
  id: string
  createdAt: string
  updatedAt: string
  nombre: string
  rncCedula: string | null
  telefono: string | null
  correo: string | null
  direccion: string | null
  contacto: string | null
  emiteComprobante: boolean
}

export interface CreateProveedorDto {
  nombre: string
  rncCedula?: string
  telefono?: string
  correo?: string
  direccion?: string
  contacto?: string
  emiteComprobante?: boolean
}

export type UpdateProveedorDto = Partial<CreateProveedorDto>

export const proveedorService = createCrudService<Proveedor, CreateProveedorDto, UpdateProveedorDto>('proveedores')
