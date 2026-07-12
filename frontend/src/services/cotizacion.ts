import { api } from '../lib/api'
import type { Cliente } from './cliente'
import type { Vehiculo } from './vehiculo'
import type { Servicio } from './servicio'
import type { Pieza } from './pieza'

export const ESTADOS_COTIZACION = ['borrador', 'entregada', 'vencida'] as const
export type EstadoCotizacion = (typeof ESTADOS_COTIZACION)[number]

export interface CotizacionLinea {
  id: string
  createdAt: string
  updatedAt: string
  servicio: Servicio
  pieza: Pieza | null
  descripcion: string
  cantidad: string
  precioUnitario: string
  itbis: string
  descuento: string | null
}

export interface Cotizacion {
  id: string
  createdAt: string
  updatedAt: string
  cliente: Cliente
  vehiculo: Vehiculo
  numero: string
  estado: EstadoCotizacion
  fechaValidez: string
  descuentoGlobal: string | null
  notas: string | null
  lineas: CotizacionLinea[]
  /** Attached server-side by findOneDetail/findAllDetail — not a real column. */
  subtotal: string
  itbisTotal: string
  total: string
}

export interface CreateCotizacionLineaDto {
  servicioId: string
  piezaId?: string
  descripcion: string
  cantidad: string
  precioUnitario: string
  itbis: string
  descuento?: string
}

export type UpdateCotizacionLineaDto = Partial<CreateCotizacionLineaDto>

export interface CreateCotizacionDto {
  clienteId: string
  vehiculoId: string
  estado?: EstadoCotizacion
  fechaValidez: string
  descuentoGlobal?: string
  notas?: string
  lineas: CreateCotizacionLineaDto[]
}

export interface UpdateCotizacionDto {
  clienteId?: string
  vehiculoId?: string
  estado?: EstadoCotizacion
  fechaValidez?: string
  descuentoGlobal?: string
  notas?: string
  lineas?: CreateCotizacionLineaDto[]
}

const RESOURCE = 'cotizaciones'

export const cotizacionService = {
  list: () => api.get<Cotizacion[]>(`/${RESOURCE}`).then((r) => r.data),
  get: (id: string) => api.get<Cotizacion>(`/${RESOURCE}/${id}`).then((r) => r.data),
  create: (dto: CreateCotizacionDto) => api.post<Cotizacion>(`/${RESOURCE}`, dto).then((r) => r.data),
  update: (id: string, dto: UpdateCotizacionDto) =>
    api.patch<Cotizacion>(`/${RESOURCE}/${id}`, dto).then((r) => r.data),
  remove: (id: string) => api.delete<void>(`/${RESOURCE}/${id}`).then((r) => r.data),

  addLinea: (id: string, dto: CreateCotizacionLineaDto) =>
    api.post<Cotizacion>(`/${RESOURCE}/${id}/lineas`, dto).then((r) => r.data),
  updateLinea: (id: string, lineaId: string, dto: UpdateCotizacionLineaDto) =>
    api.patch<Cotizacion>(`/${RESOURCE}/${id}/lineas/${lineaId}`, dto).then((r) => r.data),
  removeLinea: (id: string, lineaId: string) =>
    api.delete<Cotizacion>(`/${RESOURCE}/${id}/lineas/${lineaId}`).then((r) => r.data),
}
