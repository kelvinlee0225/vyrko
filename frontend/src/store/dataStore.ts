import { create } from 'zustand'
import {
  cotizaciones as seedCotizaciones,
  facturas as seedFacturas,
  ordenesTrabajo as seedOrdenesTrabajo,
  clientes as seedClientes,
  calcularTotales,
  type Cotizacion,
  type Factura,
  type OrdenTrabajo,
  type ClienteDirectorio,
} from '../data/mockData'
import { formatCurrency } from '../utils/format'

interface DataState {
  cotizaciones: Cotizacion[]
  facturas: Factura[]
  ordenesTrabajo: OrdenTrabajo[]
  clientes: ClienteDirectorio[]
  addCotizacion: (c: Cotizacion) => void
  addFactura: (f: Factura) => void
  addOrdenTrabajo: (o: OrdenTrabajo) => void
  addCliente: (c: ClienteDirectorio) => void
}

/** In-memory only (mock-data stage) — no persistence, no backend calls. Seeded from data/mockData.ts. */
export const useDataStore = create<DataState>((set) => ({
  cotizaciones: seedCotizaciones,
  facturas: seedFacturas,
  ordenesTrabajo: seedOrdenesTrabajo,
  clientes: seedClientes,
  addCotizacion: (c) => set((s) => ({ cotizaciones: [c, ...s.cotizaciones] })),
  addFactura: (f) => set((s) => ({ facturas: [f, ...s.facturas] })),
  addOrdenTrabajo: (o) => set((s) => ({ ordenesTrabajo: [o, ...s.ordenesTrabajo] })),
  addCliente: (c) => set((s) => ({ clientes: [c, ...s.clientes] })),
}))

function nextSeq(codes: string[]): number {
  return (
    codes.reduce((max, code) => {
      const match = /(\d+)$/.exec(code)
      return Math.max(max, match ? parseInt(match[1], 10) : 0)
    }, 0) + 1
  )
}

export function generateCotizacionNumero(): string {
  const year = new Date().getFullYear()
  const seq = nextSeq(useDataStore.getState().cotizaciones.map((c) => c.numero))
  return `COT-${year}-${String(seq).padStart(4, '0')}`
}

export function generateFacturaNumero(): string {
  const seq = nextSeq(useDataStore.getState().facturas.map((f) => f.numero))
  return `B${String(seq).padStart(10, '0')}`
}

export function generateOrdenTrabajoNumero(): string {
  const year = new Date().getFullYear()
  const seq = nextSeq(useDataStore.getState().ordenesTrabajo.map((o) => o.numero))
  return `OT-${year}-${String(seq).padStart(4, '0')}`
}

export function useEstadisticasPanel() {
  const cotizaciones = useDataStore((s) => s.cotizaciones)
  const facturas = useDataStore((s) => s.facturas)
  const ordenesTrabajo = useDataStore((s) => s.ordenesTrabajo)

  const ordenesAbiertas = ordenesTrabajo.filter((o) => o.estado !== 'entregado' && o.estado !== 'cancelado').length
  const cotizacionesPendientes = cotizaciones.filter((c) => c.estado === 'enviada').length
  const porCobrarTotal = facturas.reduce((sum, f) => {
    const { total } = calcularTotales(f.lineas, f.descuentoGlobal)
    return sum + Math.max(total - f.montoPagado, 0)
  }, 0)
  const facturasConSaldo = facturas.filter((f) => {
    const { total } = calcularTotales(f.lineas, f.descuentoGlobal)
    return total - f.montoPagado > 0
  }).length

  return [
    {
      etiqueta: 'Órdenes abiertas',
      valor: String(ordenesAbiertas),
      variacion: `${ordenesTrabajo.length} en total`,
      icono: 'ordenes' as const,
      to: '/ordenes',
    },
    {
      etiqueta: 'Cotizaciones pendientes',
      valor: String(cotizacionesPendientes),
      variacion: 'Esperando respuesta del cliente',
      icono: 'cotizaciones' as const,
      to: '/cotizaciones',
    },
    {
      etiqueta: 'Por cobrar',
      valor: formatCurrency(porCobrarTotal),
      variacion: `${facturasConSaldo} facturas`,
      icono: 'porCobrar' as const,
      to: '/facturacion',
    },
  ]
}
