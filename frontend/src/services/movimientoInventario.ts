import { api } from '../lib/api'
import type { Material } from './material'
import type { Proveedor } from './proveedor'
import type { Usuario } from './usuario'

export interface MovimientoInventario {
  id: string
  createdAt: string
  updatedAt: string
  material: Material
  proveedor: Proveedor | null
  usuario: Usuario
  tipoMovimiento: 'entrada' | 'salida'
  cantidad: string
  motivo: string | null
}

export interface CreateMovimientoInventarioDto {
  materialId: string
  proveedorId?: string
  tipoMovimiento: 'entrada' | 'salida'
  cantidad: string
  motivo?: string
}

const RESOURCE = 'movimientos-inventario'

export const movimientoInventarioService = {
  list: () => api.get<MovimientoInventario[]>(`/${RESOURCE}`).then((r) => r.data),
  get: (id: string) => api.get<MovimientoInventario>(`/${RESOURCE}/${id}`).then((r) => r.data),
  create: (dto: CreateMovimientoInventarioDto) =>
    api.post<MovimientoInventario>(`/${RESOURCE}`, dto).then((r) => r.data),
}
