import { Link, useParams } from 'react-router-dom'
import { DocumentHeader } from '../components/document/DocumentHeader'
import { PartyCard } from '../components/document/PartyCard'
import { Button } from '../components/Button'
import { IconCustomers, IconCar, IconWorkOrder } from '../components/icons'
import { useDataStore } from '../store/dataStore'
import { formatDate } from '../utils/format'

export function WorkOrder() {
  const { numero } = useParams()
  const ordenesTrabajo = useDataStore((s) => s.ordenesTrabajo)
  const o = ordenesTrabajo.find((item) => item.numero === numero)

  if (!o) {
    return (
      <div className="flex flex-col gap-4">
        <Link to="/ordenes" className="self-start text-[12.5px] font-medium text-muted no-underline hover:text-ink">
          ← Volver a órdenes de trabajo
        </Link>
        <p className="text-[13.5px] text-muted">No se encontró la orden de trabajo {numero}.</p>
      </div>
    )
  }

  const meta = [
    { label: 'Entrada', value: formatDate(o.fechaEntrada) },
    { label: 'Entrega estimada', value: o.fechaEntregaEstimada ? formatDate(o.fechaEntregaEstimada) : '—' },
    { label: 'Entrega real', value: o.fechaEntregaReal ? formatDate(o.fechaEntregaReal) : '—' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <Link to="/ordenes" className="self-start text-[12.5px] font-medium text-muted no-underline hover:text-ink">
        ← Volver a órdenes de trabajo
      </Link>

      <DocumentHeader
        eyebrow="Orden de trabajo"
        numero={o.numero}
        estado={o.estado}
        meta={meta}
        actions={
          <>
            {o.cotizacionRef && (
              <Link
                to={`/cotizaciones/${o.cotizacionRef}`}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-md border border-line bg-surface px-4 py-2.5 text-[13.5px] font-semibold text-ink no-underline transition-colors hover:border-brand hover:text-brand"
              >
                Ver cotización {o.cotizacionRef}
              </Link>
            )}
            <Button variant="secondary">Editar</Button>
            <Button variant="primary">Marcar como entregado</Button>
          </>
        }
      />

      <div className="grid grid-cols-3 gap-4 max-[1100px]:grid-cols-1">
        <PartyCard
          title="Cliente"
          icon={<IconCustomers size={15} />}
          fields={[
            { label: 'Nombre', value: o.cliente.nombre },
            { label: 'Tipo', value: o.cliente.esAseguradora ? `${o.cliente.tipo} · Aseguradora` : o.cliente.tipo },
            { label: 'Teléfono', value: o.cliente.telefono, mono: true },
          ]}
        />
        <PartyCard
          title="Vehículo"
          icon={<IconCar size={16} />}
          fields={[
            { label: 'Marca / Modelo', value: `${o.vehiculo.marca} ${o.vehiculo.modelo} (${o.vehiculo.anio})` },
            { label: 'Placa', value: o.vehiculo.placa, mono: true },
            { label: 'Color', value: o.vehiculo.color },
          ]}
        />
        <PartyCard
          title="Técnico asignado"
          icon={<IconWorkOrder size={15} />}
          fields={[
            { label: 'Nombre', value: o.tecnico.nombre },
            { label: 'Especialidad', value: o.tecnico.especialidad },
          ]}
        />
      </div>

      <div className="rounded-lg border border-line bg-surface p-6">
        <h2 className="mb-2 text-[15px]">Descripción del trabajo</h2>
        <p className="text-[13px] leading-[1.5] text-muted">{o.descripcionTrabajo ?? 'Sin descripción registrada.'}</p>
      </div>

      <div className="overflow-hidden rounded-lg border border-line bg-surface">
        <div className="border-b border-line px-6 py-4">
          <h2 className="text-[15px]">Materiales consumidos</h2>
        </div>
        {o.consumos.length === 0 ? (
          <p className="px-6 py-8 text-center text-[13px] text-muted">No se han registrado consumos de materiales.</p>
        ) : (
          <table className="w-full border-collapse [&>tbody>tr:last-child>td]:border-b-0">
            <thead>
              <tr>
                <th className="border-b border-line bg-surface-alt px-6 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.04em] text-muted">
                  Material
                </th>
                <th className="border-b border-line bg-surface-alt px-6 py-2 text-right text-[11px] font-semibold uppercase tracking-[0.04em] text-muted">
                  Cantidad
                </th>
              </tr>
            </thead>
            <tbody>
              {o.consumos.map((c) => (
                <tr key={c.material}>
                  <td className="border-b border-line px-6 py-2.5 text-[13px] text-ink">{c.material}</td>
                  <td className="border-b border-line px-6 py-2.5 text-right font-mono text-[13px] tabular-nums text-ink">
                    {c.cantidad} {c.unidad}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
