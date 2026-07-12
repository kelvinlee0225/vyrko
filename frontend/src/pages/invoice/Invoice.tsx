import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DocumentHeader } from '../../components/document/DocumentHeader'
import { PartyCard } from '../../components/document/PartyCard'
import { LineItemsTable } from '../../components/document/LineItemsTable'
import { TotalsCard } from '../../components/document/TotalsCard'
import { Button } from '../../components/ui/Button'
import { RegistrarPagoModal } from '../../components/forms/RegistrarPagoModal'
import { IconCustomers, IconCar, IconShield, IconDownload } from '../../components/ui/icons'
import { useApiResource } from '../../hooks/useApiResource'
import { facturaService } from '../../services/factura'
import { formatCurrency, formatDate } from '../../utils/format'

export function Invoice() {
  const { id } = useParams()
  const { data: f, loading, error, reload } = useApiResource(() => facturaService.get(id!), id)
  const [showPago, setShowPago] = useState(false)
  const [accionError, setAccionError] = useState<string | null>(null)
  const [anulando, setAnulando] = useState(false)

  async function handleAnular() {
    if (!f) return
    if (!window.confirm(`¿Anular la factura ${f.numero}? Esta acción no se puede deshacer.`)) return
    setAccionError(null)
    setAnulando(true)
    try {
      await facturaService.anular(f.id)
      reload()
    } catch {
      setAccionError('No se pudo anular la factura. Intenta de nuevo.')
    } finally {
      setAnulando(false)
    }
  }

  if (loading) {
    return <p className="text-[13.5px] text-muted">Cargando factura…</p>
  }

  if (error || !f) {
    return (
      <div className="flex flex-col gap-4">
        <Link to="/facturacion" className="self-start text-[12.5px] font-medium text-muted no-underline hover:text-ink">
          ← Volver a facturas
        </Link>
        <p className="text-[13.5px] text-muted">{error ?? `No se encontró la factura ${id}.`}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Link to="/facturacion" className="self-start text-[12.5px] font-medium text-muted no-underline hover:text-ink">
        ← Volver a facturas
      </Link>

      <DocumentHeader
        eyebrow="Factura"
        numero={f.numero}
        estado={f.estado}
        meta={[
          { label: 'Emitida', value: formatDate(f.fechaEmision) },
          { label: 'Vencimiento', value: f.fechaVencimiento ? formatDate(f.fechaVencimiento) : '—' },
        ]}
        actions={
          <>
            <Button variant="secondary" icon={<IconDownload />}>
              Descargar PDF
            </Button>
            {f.cotizacion && (
              <Link
                to={`/cotizaciones/${f.cotizacion.id}`}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-md border border-line bg-surface px-4 py-2.5 text-[13.5px] font-semibold text-ink no-underline transition-colors hover:border-brand hover:text-brand"
              >
                Ver cotización {f.cotizacion.numero}
              </Link>
            )}
            {parseFloat(f.montoPagado) === 0 && f.estado !== 'anulada' && (
              <Button variant="danger" disabled={anulando} onClick={handleAnular}>
                {anulando ? 'Anulando…' : 'Anular'}
              </Button>
            )}
            {(f.estado === 'pendiente' || f.estado === 'pago_parcial') && (
              <Button variant="primary" onClick={() => setShowPago(true)}>
                Registrar pago
              </Button>
            )}
          </>
        }
      />

      {accionError && <p className="text-[12.5px] text-error">{accionError}</p>}

      <div className="grid grid-cols-3 gap-4 max-[1100px]:grid-cols-1">
        <PartyCard
          title="Cliente"
          icon={<IconCustomers size={15} />}
          fields={[
            { label: 'Nombre', value: f.cliente.nombreRazonSocial },
            {
              label: 'Tipo',
              value: f.cliente.esAseguradora ? `${f.cliente.tipoCliente} · Aseguradora` : f.cliente.tipoCliente,
            },
            { label: 'RNC', value: f.cliente.cedulaRnc ?? '—', mono: true },
            { label: 'Correo', value: f.cliente.correo ?? '—' },
          ]}
        />
        <PartyCard
          title="Vehículo"
          icon={<IconCar size={16} />}
          fields={
            f.vehiculo
              ? [
                  { label: 'Marca / Modelo', value: `${f.vehiculo.marca} ${f.vehiculo.modelo} (${f.vehiculo.año})` },
                  { label: 'Placa', value: f.vehiculo.placa, mono: true },
                  { label: 'Color', value: f.vehiculo.color },
                  { label: 'VIN / Chasis', value: f.vehiculo.vinChasis ?? '—', mono: true },
                ]
              : [{ label: 'Vehículo', value: 'No especificado' }]
          }
        />
        <PartyCard
          title="Aseguradora"
          icon={<IconShield size={15} />}
          fields={[
            { label: 'Compañía', value: f.vehiculo?.aseguradora?.nombre ?? 'Particular' },
            { label: 'RNC', value: f.vehiculo?.aseguradora?.rncCedula ?? '—', mono: true },
          ]}
        />
      </div>

      <div className="grid grid-cols-[2.2fr_1fr] items-start gap-6 max-[1100px]:grid-cols-1">
        <LineItemsTable lineas={f.lineas} />
        <TotalsCard
          subtotal={parseFloat(f.subtotal)}
          itbis={parseFloat(f.itbisTotal)}
          descuentoGlobal={f.descuentoGlobal ? parseFloat(f.descuentoGlobal) : 0}
          total={parseFloat(f.total)}
          extraRows={[
            { label: 'Monto pagado', value: formatCurrency(parseFloat(f.montoPagado)), muted: true },
            ...(f.metodoPago
              ? [
                  { label: 'Método de pago', value: f.metodoPago, muted: true },
                  { label: 'Último pago', value: f.fechaPago ? formatDate(f.fechaPago) : '—', muted: true },
                ]
              : []),
            { label: 'Balance pendiente', value: formatCurrency(parseFloat(f.saldoPendiente)) },
          ]}
        >
          {f.notas && <p className="mt-4 border-t border-line pt-4 text-[12px] leading-[1.5] text-muted">{f.notas}</p>}
        </TotalsCard>
      </div>

      {showPago && <RegistrarPagoModal factura={f} onClose={() => setShowPago(false)} onPagoRegistrado={reload} />}
    </div>
  )
}
