import { createCrudService } from './crud'

export interface Servicio {
  id: string
  createdAt: string
  updatedAt: string
  nombre: string
  tipoTrabajo: string
  precioBase: string
  llevaItbis: boolean
}

export interface CreateServicioDto {
  nombre: string
  tipoTrabajo: string
  precioBase: string
  llevaItbis?: boolean
}

export type UpdateServicioDto = Partial<CreateServicioDto>

export const servicioService = createCrudService<Servicio, CreateServicioDto, UpdateServicioDto>('servicios')
