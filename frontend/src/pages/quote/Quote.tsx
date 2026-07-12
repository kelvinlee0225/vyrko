import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { DocumentHeader } from '../../components/document/DocumentHeader'
import { PartyCard } from '../../components/document/PartyCard'
import { LineItemsTable } from '../../components/document/LineItemsTable'
import { TotalsCard } from '../../components/document/TotalsCard'
import { QuotePrintLayout } from '../../components/document/QuotePrintLayout'
import { Button } from '../../components/ui/Button'
import { IconCustomers, IconCar, IconShield, IconDownload } from '../../components/ui/icons'
import { useApiResource } from '../../hooks/useApiResource'
import { cotizacionService, type EstadoCotizacion } from '../../services/cotizacion'
import { formatDate } from '../../utils/format'

export function Quote() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: c, loading, error, reload } = useApiResource(() => cotizacionService.get(id!), id)
  const [estadoError, setEstadoError] = useState<string | null>(null)
  const [updatingEstado, setUpdatingEstado] = useState(false)

  async function handleDescargarPdf() {
    if (c && c.estado === 'borrador') {
      try {
        await cotizacionService.update(c.id, { estado: 'entregada' })
        reload()
      } catch {
        // No bloquea la impresión si la transición de estado falla.
      }
    }
    window.print()
  }

  async function handleMarcarEstado(nuevoEstado: EstadoCotizacion) {
    if (!c) return
    setEstadoError(null)
    setUpdatingEstado(true)
    try {
      await cotizacionService.update(c.id, { estado: nuevoEstado })
      reload()
    } catch {
      setEstadoError('No se pudo actualizar el estado. Intenta de nuevo.')
    } finally {
      setUpdatingEstado(false)
    }
  }

  if (loading) {
    return <p className="text-[13.5px] text-muted">Cargando cotización…</p>
  }

  if (error || !c) {
    return (
      <div className="flex flex-col gap-4">
        <Link to="/cotizaciones" className="self-start text-[12.5px] font-medium text-muted no-underline hover:text-ink">
          ← Volver a cotizaciones
        </Link>
        <p className="text-[13.5px] text-muted">{error ?? `No se encontró la cotización ${id}.`}</p>
      </div>
    )
  }

  return (
    <>
      <div className="no-print flex flex-col gap-6">
        <Link
          to="/cotizaciones"
          className="self-start text-[12.5px] font-medium text-muted no-underline hover:text-ink"
        >
          ← Volver a cotizaciones
        </Link>

        <DocumentHeader
          eyebrow="Cotización"
          numero={c.numero}
          estado={c.estado}
          meta={[
            { label: 'Emitida', value: formatDate(c.createdAt.slice(0, 10)) },
            { label: 'Válida hasta', value: formatDate(c.fechaValidez) },
          ]}
          actions={
            <>
              {(c.estado === 'borrador' || c.estado === 'vencida') && (
                <Button variant="success" disabled={updatingEstado} onClick={() => handleMarcarEstado('entregada')}>
                  Marcar como entregada
                </Button>
              )}
              {(c.estado === 'entregada' || c.estado === 'vencida') && (
                <Button variant="secondary" disabled={updatingEstado} onClick={() => handleMarcarEstado('borrador')}>
                  Marcar como borrador
                </Button>
              )}
              <Button variant="ghost" onClick={() => navigate(`/cotizaciones/${c.id}/editar`)}>
                Editar
              </Button>
              <Button variant="secondary" onClick={() => navigate(`/facturacion/nueva?cotizacion=${c.id}`)}>
                Facturar
              </Button>
              <Button variant="primary" icon={<IconDownload />} onClick={handleDescargarPdf}>
                Descargar PDF
              </Button>
            </>
          }
        />

        {estadoError && <p className="text-[12.5px] text-error">{estadoError}</p>}

        <div className="grid grid-cols-3 gap-4 max-[1100px]:grid-cols-1">
          <PartyCard
            title="Cliente"
            icon={<IconCustomers size={15} />}
            fields={[
              { label: 'Nombre', value: c.cliente.nombreRazonSocial },
              {
                label: 'Tipo',
                value: c.cliente.esAseguradora ? `${c.cliente.tipoCliente} · Aseguradora` : c.cliente.tipoCliente,
              },
              { label: 'Cédula / RNC', value: c.cliente.cedulaRnc ?? '—', mono: true },
              { label: 'Teléfono', value: c.cliente.telefono, mono: true },
            ]}
          />
          <PartyCard
            title="Vehículo"
            icon={<IconCar size={16} />}
            fields={[
              { label: 'Marca / Modelo', value: `${c.vehiculo.marca} ${c.vehiculo.modelo} (${c.vehiculo.año})` },
              { label: 'Placa', value: c.vehiculo.placa, mono: true },
              { label: 'Color', value: c.vehiculo.color },
              { label: 'VIN / Chasis', value: c.vehiculo.vinChasis ?? '—', mono: true },
            ]}
          />
          <PartyCard
            title="Aseguradora"
            icon={<IconShield size={15} />}
            fields={[
              { label: 'Compañía', value: c.vehiculo.aseguradora?.nombre ?? 'Particular' },
              { label: 'RNC', value: c.vehiculo.aseguradora?.rncCedula ?? '—', mono: true },
            ]}
          />
        </div>

        <div className="grid grid-cols-[2.2fr_1fr] items-start gap-6 max-[1100px]:grid-cols-1">
          <LineItemsTable lineas={c.lineas} />
          <TotalsCard
            subtotal={parseFloat(c.subtotal)}
            itbis={parseFloat(c.itbisTotal)}
            descuentoGlobal={c.descuentoGlobal ? parseFloat(c.descuentoGlobal) : 0}
            total={parseFloat(c.total)}
          >
            {c.notas && <p className="mt-4 border-t border-line pt-4 text-[12px] leading-[1.5] text-muted">{c.notas}</p>}
          </TotalsCard>
        </div>
      </div>
      <QuotePrintLayout cotizacion={c} />
    </>
  )
}
