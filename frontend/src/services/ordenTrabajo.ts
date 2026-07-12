import { api } from '../lib/api'
import type { Cotizacion } from './cotizacion'
import type { Vehiculo } from './vehiculo'
import type { Tecnico } from './tecnico'
import type { Material } from './material'

export const ESTADOS_ORDEN_TRABAJO = [
  'pendiente',
  'recibida',
  'en_progreso',
  'entregada_temporalmente',
  'entregada',
  'cancelada',
] as const
export type EstadoOrdenTrabajo = (typeof ESTADOS_ORDEN_TRABAJO)[number]

export interface OrdenTrabajoConsumo {
  id: string
  createdAt: string
  updatedAt: string
  material: Material
  cantidadReal: string
}

export interface OrdenTrabajoAsignacion {
  id: string
  tecnico: Tecnico
  asignadoEn: string
  notas: string | null
}

export interface OrdenTrabajo {
  id: string
  createdAt: string
  updatedAt: string
  cotizacion: Cotizacion | null
  vehiculo: Vehiculo
  tecnico: Tecnico
  estado: EstadoOrdenTrabajo
  fechaEntrada: string
  fechaEntregaEstimada: string | null
  fechaEntregaReal: string | null
  descripcionTrabajo: string | null
  consumos: OrdenTrabajoConsumo[]
  asignaciones: OrdenTrabajoAsignacion[]
}

export interface CreateOrdenTrabajoConsumoDto {
  materialId: string
  cantidadReal: string
}

export type UpdateOrdenTrabajoConsumoDto = Partial<CreateOrdenTrabajoConsumoDto>

export interface CreateOrdenTrabajoDto {
  cotizacionId?: string
  vehiculoId: string
  tecnicoId: string
  estado?: EstadoOrdenTrabajo
  fechaEntrada: string
  fechaEntregaEstimada?: string
  fechaEntregaReal?: string
  descripcionTrabajo?: string
  consumos?: CreateOrdenTrabajoConsumoDto[]
}

export interface UpdateOrdenTrabajoDto {
  cotizacionId?: string
  vehiculoId?: string
  tecnicoId?: string
  estado?: EstadoOrdenTrabajo
  fechaEntrada?: string
  fechaEntregaEstimada?: string
  fechaEntregaReal?: string
  descripcionTrabajo?: string
}

export interface CreateOrdenTrabajoAsignacionDto {
  tecnicoId: string
  notas?: string
}

const RESOURCE = 'ordenes-trabajo'

export const ordenTrabajoService = {
  list: () => api.get<OrdenTrabajo[]>(`/${RESOURCE}`).then((r) => r.data),
  get: (id: string) => api.get<OrdenTrabajo>(`/${RESOURCE}/${id}`).then((r) => r.data),
  create: (dto: CreateOrdenTrabajoDto) => api.post<OrdenTrabajo>(`/${RESOURCE}`, dto).then((r) => r.data),
  update: (id: string, dto: UpdateOrdenTrabajoDto) =>
    api.patch<OrdenTrabajo>(`/${RESOURCE}/${id}`, dto).then((r) => r.data),
  remove: (id: string) => api.delete<void>(`/${RESOURCE}/${id}`).then((r) => r.data),

  reasignarTecnico: (id: string, dto: CreateOrdenTrabajoAsignacionDto) =>
    api.post<OrdenTrabajo>(`/${RESOURCE}/${id}/asignaciones`, dto).then((r) => r.data),

  addConsumo: (id: string, dto: CreateOrdenTrabajoConsumoDto) =>
    api.post<OrdenTrabajo>(`/${RESOURCE}/${id}/consumos`, dto).then((r) => r.data),
  updateConsumo: (id: string, consumoId: string, dto: UpdateOrdenTrabajoConsumoDto) =>
    api.patch<OrdenTrabajo>(`/${RESOURCE}/${id}/consumos/${consumoId}`, dto).then((r) => r.data),
  removeConsumo: (id: string, consumoId: string) =>
    api.delete<OrdenTrabajo>(`/${RESOURCE}/${id}/consumos/${consumoId}`).then((r) => r.data),
}
