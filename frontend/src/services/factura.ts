import { api } from '../lib/api'
import type { Cliente } from './cliente'
import type { Vehiculo } from './vehiculo'
import type { Cotizacion } from './cotizacion'
import type { OrdenTrabajo } from './ordenTrabajo'
import type { Servicio } from './servicio'
import type { Pieza } from './pieza'

export const ESTADOS_FACTURA = ['pendiente', 'pago_parcial', 'pagada', 'anulada'] as const
export type EstadoFactura = (typeof ESTADOS_FACTURA)[number]

export interface FacturaLinea {
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

export interface Factura {
  id: string
  createdAt: string
  updatedAt: string
  cliente: Cliente
  vehiculo: Vehiculo | null
  cotizacion: Cotizacion | null
  ordenTrabajo: OrdenTrabajo | null
  numero: string
  estado: EstadoFactura
  fechaEmision: string
  fechaVencimiento: string | null
  metodoPago: string | null
  fechaPago: string | null
  montoPagado: string
  descuentoGlobal: string | null
  notas: string | null
  lineas: FacturaLinea[]
  /** Attached server-side by findOneDetail/findAllDetail — not a real column. */
  subtotal: string
  itbisTotal: string
  total: string
  saldoPendiente: string
}

export interface CreateFacturaLineaDto {
  servicioId: string
  piezaId?: string
  descripcion: string
  cantidad: string
  precioUnitario: string
  itbis: string
  descuento?: string
}

export type UpdateFacturaLineaDto = Partial<CreateFacturaLineaDto>

export interface CreateFacturaDto {
  clienteId: string
  vehiculoId?: string
  cotizacionId?: string
  ordenTrabajoId?: string
  estado?: EstadoFactura
  fechaEmision: string
  fechaVencimiento?: string
  descuentoGlobal?: string
  notas?: string
  lineas: CreateFacturaLineaDto[]
}

export interface UpdateFacturaDto {
  clienteId?: string
  vehiculoId?: string
  cotizacionId?: string
  ordenTrabajoId?: string
  estado?: EstadoFactura
  fechaEmision?: string
  fechaVencimiento?: string
  descuentoGlobal?: string
  notas?: string
}

export interface CreateFacturaFromCotizacionDto {
  ordenTrabajoId?: string
  fechaEmision?: string
  fechaVencimiento?: string
  notas?: string
}

export interface RegistrarPagoDto {
  monto: string
  metodoPago?: string
  fechaPago?: string
}

const RESOURCE = 'facturas'

export const facturaService = {
  list: () => api.get<Factura[]>(`/${RESOURCE}`).then((r) => r.data),
  get: (id: string) => api.get<Factura>(`/${RESOURCE}/${id}`).then((r) => r.data),
  create: (dto: CreateFacturaDto) => api.post<Factura>(`/${RESOURCE}`, dto).then((r) => r.data),
  createFromCotizacion: (cotizacionId: string, dto: CreateFacturaFromCotizacionDto) =>
    api.post<Factura>(`/${RESOURCE}/from-cotizacion/${cotizacionId}`, dto).then((r) => r.data),
  update: (id: string, dto: UpdateFacturaDto) => api.patch<Factura>(`/${RESOURCE}/${id}`, dto).then((r) => r.data),
  remove: (id: string) => api.delete<void>(`/${RESOURCE}/${id}`).then((r) => r.data),

  addLinea: (id: string, dto: CreateFacturaLineaDto) =>
    api.post<Factura>(`/${RESOURCE}/${id}/lineas`, dto).then((r) => r.data),
  updateLinea: (id: string, lineaId: string, dto: UpdateFacturaLineaDto) =>
    api.patch<Factura>(`/${RESOURCE}/${id}/lineas/${lineaId}`, dto).then((r) => r.data),
  removeLinea: (id: string, lineaId: string) =>
    api.delete<Factura>(`/${RESOURCE}/${id}/lineas/${lineaId}`).then((r) => r.data),

  registrarPago: (id: string, dto: RegistrarPagoDto) =>
    api.post<Factura>(`/${RESOURCE}/${id}/pagos`, dto).then((r) => r.data),
  anular: (id: string) => api.post<Factura>(`/${RESOURCE}/${id}/anular`).then((r) => r.data),
}
