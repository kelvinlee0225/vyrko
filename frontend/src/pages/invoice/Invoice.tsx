import { Link, useParams } from 'react-router-dom'
import { DocumentHeader } from '../components/document/DocumentHeader'
import { PartyCard } from '../components/document/PartyCard'
import { LineItemsTable } from '../components/document/LineItemsTable'
import { TotalsCard } from '../components/document/TotalsCard'
import { Button } from '../components/Button'
import { IconCustomers, IconCar, IconShield, IconDownload } from '../components/icons'
import { calcularTotales } from '../data/mockData'
import { useDataStore } from '../store/dataStore'
import { formatCurrency, formatDate } from '../utils/format'

export function Invoice() {
  const { numero } = useParams()
  const facturas = useDataStore((s) => s.facturas)
  const f = facturas.find((item) => item.numero === numero)

  if (!f) {
    return (
      <div className="flex flex-col gap-4">
        <Link to="/facturacion" className="self-start text-[12.5px] font-medium text-muted no-underline hover:text-ink">
          ← Volver a facturas
        </Link>
        <p className="text-[13.5px] text-muted">No se encontró la factura {numero}.</p>
      </div>
    )
  }

  const totales = calcularTotales(f.lineas, f.descuentoGlobal)
  const balance = totales.total - f.montoPagado

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
          { label: 'NCF (e-CF)', value: f.ncf },
          { label: 'Emitida', value: formatDate(f.fechaEmision) },
          { label: 'Vencimiento', value: formatDate(f.fechaVencimiento) },
        ]}
        actions={
          <>
            <Button variant="secondary" icon={<IconDownload />}>
              Descargar PDF
            </Button>
            <Link
              to={`/cotizaciones/${f.cotizacionRef}`}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-md border border-line bg-surface px-4 py-2.5 text-[13.5px] font-semibold text-ink no-underline transition-colors hover:border-brand hover:text-brand"
            >
              Ver cotización {f.cotizacionRef}
            </Link>
            <Button variant="primary">Registrar pago</Button>
          </>
        }
      />

      <div className="grid grid-cols-3 gap-4 max-[1100px]:grid-cols-1">
        <PartyCard
          title="Cliente / Aseguradora"
          icon={<IconCustomers size={15} />}
          fields={[
            { label: 'Nombre', value: f.cliente.nombre },
            { label: 'Tipo', value: f.cliente.esAseguradora ? `${f.cliente.tipo} · Aseguradora` : f.cliente.tipo },
            { label: 'RNC', value: f.cliente.cedulaRnc, mono: true },
            { label: 'Correo', value: f.cliente.correo },
          ]}
        />
        <PartyCard
          title="Vehículo"
          icon={<IconCar size={16} />}
          fields={[
            { label: 'Marca / Modelo', value: `${f.vehiculo.marca} ${f.vehiculo.modelo} (${f.vehiculo.anio})` },
            { label: 'Placa', value: f.vehiculo.placa, mono: true },
            { label: 'Color', value: f.vehiculo.color },
            { label: 'Orden de trabajo', value: f.ordenTrabajoRef, mono: true },
          ]}
        />
        <PartyCard
          title="Aseguradora"
          icon={<IconShield size={15} />}
          fields={[
            { label: 'Compañía', value: f.vehiculo.aseguradora === '—' ? 'Particular' : f.vehiculo.aseguradora },
            { label: 'Cobertura', value: f.vehiculo.aseguradora === '—' ? 'N/A' : 'Daños a terceros + colisión' },
          ]}
        />
      </div>

      <div className="grid grid-cols-[2.2fr_1fr] items-start gap-6 max-[1100px]:grid-cols-1">
        <LineItemsTable lineas={f.lineas} />
        <TotalsCard
          {...totales}
          extraRows={[
            { label: 'Monto pagado', value: formatCurrency(f.montoPagado), muted: true },
            { label: 'Balance pendiente', value: formatCurrency(balance) },
          ]}
        >
          <p className="mt-4 border-t border-line pt-4 text-[12px] leading-[1.5] text-muted">{f.notas}</p>
        </TotalsCard>
      </div>
    </div>
  )
}
