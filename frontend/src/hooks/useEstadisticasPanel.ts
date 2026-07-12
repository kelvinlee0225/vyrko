import { useApiList } from './useApiList'
import { cotizacionService } from '../services/cotizacion'
import { facturaService } from '../services/factura'
import { ordenTrabajoService } from '../services/ordenTrabajo'
import { formatCurrency } from '../utils/format'

export function useEstadisticasPanel() {
  const { data: cotizaciones } = useApiList(cotizacionService.list)
  const { data: facturas } = useApiList(facturaService.list)
  const { data: ordenesTrabajo } = useApiList(ordenTrabajoService.list)

  const ordenesAbiertas = ordenesTrabajo.filter((o) => o.estado !== 'entregada' && o.estado !== 'cancelada').length
  const cotizacionesPendientes = cotizaciones.filter((c) => c.estado === 'entregada').length
  const saldos = facturas.map((f) => Math.max(parseFloat(f.total) - parseFloat(f.montoPagado), 0))
  const porCobrarTotal = saldos.reduce((sum, saldo) => sum + saldo, 0)
  const facturasConSaldo = saldos.filter((saldo) => saldo > 0).length

  const items = [
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

  return { items, cotizaciones, facturas, ordenesTrabajo }
}
