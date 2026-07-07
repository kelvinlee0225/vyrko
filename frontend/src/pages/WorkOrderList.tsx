import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { StampBadge } from '../components/StampBadge'
import { Button } from '../components/Button'
import { IconPlus, IconSearch } from '../components/icons'
import { useDataStore } from '../store/dataStore'
import { NewWorkOrderModal } from '../components/forms/NewWorkOrderModal'
import { formatDate } from '../utils/format'

const columns = 'grid-cols-[120px_1fr_150px_150px_90px_100px_140px]'

export function WorkOrderList() {
  const ordenesTrabajo = useDataStore((s) => s.ordenesTrabajo)
  const [query, setQuery] = useState('')
  const [showNewModal, setShowNewModal] = useState(false)

  const resultados = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ordenesTrabajo
    return ordenesTrabajo.filter((o) =>
      [o.numero, o.cliente.nombre, o.vehiculo.placa, o.vehiculo.marca, o.vehiculo.modelo].some((field) =>
        field.toLowerCase().includes(q),
      ),
    )
  }, [query, ordenesTrabajo])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl">Órdenes de trabajo</h1>
          <p className="mt-1 text-[13.5px] text-muted">{ordenesTrabajo.length} órdenes registradas.</p>
        </div>
        <Button variant="primary" icon={<IconPlus />} onClick={() => setShowNewModal(true)}>
          Nueva orden de trabajo
        </Button>
      </div>

      {showNewModal && <NewWorkOrderModal onClose={() => setShowNewModal(false)} />}

      <label className="flex w-full max-w-sm items-center gap-2 rounded-md border border-line bg-surface px-4 py-2 text-muted">
        <IconSearch size={16} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por número, cliente o placa…"
          className="w-full border-none bg-transparent text-[13.5px] text-ink outline-none placeholder:text-muted"
        />
      </label>

      <div className="overflow-x-auto rounded-lg border border-line bg-surface">
        <div className={`grid ${columns} min-w-[950px] gap-4 border-b border-line bg-surface-alt px-6 py-2 text-[11px] font-semibold uppercase tracking-[0.04em] text-muted`}>
          <span>Número</span>
          <span>Cliente</span>
          <span>Vehículo</span>
          <span>Técnico</span>
          <span>Entrada</span>
          <span>Entrega est.</span>
          <span>Estado</span>
        </div>
        <div className="flex min-w-[950px] flex-col">
          {resultados.length === 0 && (
            <p className="px-6 py-8 text-center text-[13px] text-muted">
              No se encontraron órdenes de trabajo para "{query}".
            </p>
          )}
          {resultados.map((o) => (
            <Link
              to={`/ordenes/${o.numero}`}
              key={o.numero}
              className={`grid ${columns} items-center gap-4 border-b border-line px-6 py-4 no-underline transition-colors last:border-b-0 hover:bg-surface-alt`}
            >
              <span className="font-mono text-[13px] font-semibold tabular-nums text-ink">{o.numero}</span>
              <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-medium text-ink">
                {o.cliente.nombre}
              </span>
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[12.5px] font-medium text-ink">
                  {o.vehiculo.placa}
                </span>
                <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[12px] text-muted">
                  {o.vehiculo.marca} {o.vehiculo.modelo}
                </span>
              </span>
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[12.5px] text-ink">
                  {o.tecnico.nombre}
                </span>
                <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[11.5px] text-muted">
                  {o.tecnico.especialidad}
                </span>
              </span>
              <span className="text-[12.5px] text-muted">{formatDate(o.fechaEntrada)}</span>
              <span className="text-[12.5px] text-muted">
                {o.fechaEntregaEstimada ? formatDate(o.fechaEntregaEstimada) : '—'}
              </span>
              <span>
                <StampBadge estado={o.estado} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
