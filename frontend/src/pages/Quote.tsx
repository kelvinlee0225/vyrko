import { Link, useParams } from 'react-router-dom'
import { DocumentHeader } from '../components/document/DocumentHeader'
import { PartyCard } from '../components/document/PartyCard'
import { LineItemsTable } from '../components/document/LineItemsTable'
import { TotalsCard } from '../components/document/TotalsCard'
import { Button } from '../components/Button'
import { IconCustomers, IconCar, IconShield, IconDownload } from '../components/icons'
import { calcularTotales } from '../data/mockData'
import { useDataStore } from '../store/dataStore'
import { formatDate } from '../utils/format'

export function Quote() {
  const { numero } = useParams()
  const cotizaciones = useDataStore((s) => s.cotizaciones)
  const c = cotizaciones.find((item) => item.numero === numero)

  if (!c) {
    return (
      <div className="flex flex-col gap-4">
        <Link to="/cotizaciones" className="self-start text-[12.5px] font-medium text-muted no-underline hover:text-ink">
          ← Volver a cotizaciones
        </Link>
        <p className="text-[13.5px] text-muted">No se encontró la cotización {numero}.</p>
      </div>
    )
  }

  const totales = calcularTotales(c.lineas, c.descuentoGlobal)

  return (
    <div className="flex flex-col gap-6">
      <Link to="/cotizaciones" className="self-start text-[12.5px] font-medium text-muted no-underline hover:text-ink">
        ← Volver a cotizaciones
      </Link>

      <DocumentHeader
        eyebrow="Cotización"
        numero={c.numero}
        estado={c.estado}
        meta={[
          { label: 'Emitida', value: formatDate(c.createdAt) },
          { label: 'Válida hasta', value: formatDate(c.fechaValidez) },
        ]}
        actions={
          <>
            <Button variant="secondary" icon={<IconDownload />}>
              Descargar PDF
            </Button>
            <Button variant="secondary">Editar</Button>
            <Button variant="primary">Enviar a cliente</Button>
          </>
        }
      />

      <div className="grid grid-cols-3 gap-4 max-[1100px]:grid-cols-1">
        <PartyCard
          title="Cliente"
          icon={<IconCustomers size={15} />}
          fields={[
            { label: 'Nombre', value: c.cliente.nombre },
            { label: 'Tipo', value: c.cliente.esAseguradora ? `${c.cliente.tipo} · Aseguradora` : c.cliente.tipo },
            { label: 'Cédula / RNC', value: c.cliente.cedulaRnc, mono: true },
            { label: 'Teléfono', value: c.cliente.telefono, mono: true },
          ]}
        />
        <PartyCard
          title="Vehículo"
          icon={<IconCar size={16} />}
          fields={[
            { label: 'Marca / Modelo', value: `${c.vehiculo.marca} ${c.vehiculo.modelo} (${c.vehiculo.anio})` },
            { label: 'Placa', value: c.vehiculo.placa, mono: true },
            { label: 'Color', value: c.vehiculo.color },
            { label: 'VIN / Chasis', value: c.vehiculo.vinChasis, mono: true },
          ]}
        />
        <PartyCard
          title="Aseguradora"
          icon={<IconShield size={15} />}
          fields={[
            { label: 'Compañía', value: c.vehiculo.aseguradora === '—' ? 'Particular' : c.vehiculo.aseguradora },
            { label: 'Cobertura', value: c.vehiculo.aseguradora === '—' ? 'N/A' : 'Daños a terceros + colisión' },
          ]}
        />
      </div>

      <div className="grid grid-cols-[2.2fr_1fr] items-start gap-6 max-[1100px]:grid-cols-1">
        <LineItemsTable lineas={c.lineas} />
        <TotalsCard {...totales}>
          <p className="mt-4 border-t border-line pt-4 text-[12px] leading-[1.5] text-muted">{c.notas}</p>
        </TotalsCard>
      </div>
    </div>
  )
}
