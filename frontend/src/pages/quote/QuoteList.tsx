import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { StampBadge } from '../components/StampBadge'
import { IconPlus, IconSearch } from '../components/icons'
import { calcularTotales } from '../data/mockData'
import { useDataStore } from '../store/dataStore'
import { formatCurrency, formatDate } from '../utils/format'

const columns = 'grid-cols-[120px_1fr_150px_130px_85px_85px_100px_105px]'

export function QuoteList() {
  const cotizaciones = useDataStore((s) => s.cotizaciones)
  const [query, setQuery] = useState('')

  const resultados = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return cotizaciones
    return cotizaciones.filter((c) =>
      [c.numero, c.cliente.nombre, c.vehiculo.placa, c.vehiculo.marca, c.vehiculo.modelo].some((field) =>
        field.toLowerCase().includes(q),
      ),
    )
  }, [query, cotizaciones])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl">Cotizaciones</h1>
          <p className="mt-1 text-[13.5px] text-muted">{cotizaciones.length} cotizaciones registradas.</p>
        </div>
        <Link
          to="/cotizaciones/nueva"
          className="inline-flex items-center gap-2 whitespace-nowrap rounded-md border border-transparent bg-brand px-4 py-2.5 text-[13.5px] font-semibold text-inverse no-underline transition-colors hover:bg-brand-hover"
        >
          <IconPlus />
          Nueva cotización
        </Link>
      </div>

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
        <div className={`grid ${columns} min-w-[900px] gap-4 border-b border-line bg-surface-alt px-6 py-2 text-[11px] font-semibold uppercase tracking-[0.04em] text-muted`}>
          <span>Número</span>
          <span>Cliente</span>
          <span>Vehículo</span>
          <span>Aseguradora</span>
          <span>Emitida</span>
          <span>Vence</span>
          <span className="text-right">Total</span>
          <span>Estado</span>
        </div>
        <div className="flex min-w-[900px] flex-col">
          {resultados.length === 0 && (
            <p className="px-6 py-8 text-center text-[13px] text-muted">
              No se encontraron cotizaciones para "{query}".
            </p>
          )}
          {resultados.map((c) => {
            const { total } = calcularTotales(c.lineas, c.descuentoGlobal)
            return (
              <Link
                to={`/cotizaciones/${c.numero}`}
                key={c.numero}
                className={`grid ${columns} items-center gap-4 border-b border-line px-6 py-4 no-underline transition-colors last:border-b-0 hover:bg-surface-alt`}
              >
                <span className="font-mono text-[13px] font-semibold tabular-nums text-ink">{c.numero}</span>
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-medium text-ink">
                    {c.cliente.nombre}
                  </span>
                  {c.cliente.esAseguradora && (
                    <span className="inline-flex w-fit rounded-full bg-surface-alt px-2 py-[2px] text-[10px] font-medium text-muted">
                      Aseguradora
                    </span>
                  )}
                </span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[12.5px] font-medium text-ink">
                    {c.vehiculo.placa}
                  </span>
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[12px] text-muted">
                    {c.vehiculo.marca} {c.vehiculo.modelo}
                  </span>
                </span>
                <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[12.5px] text-muted">
                  {c.vehiculo.aseguradora === '—' ? 'Particular' : c.vehiculo.aseguradora}
                </span>
                <span className="text-[12.5px] text-muted">{formatDate(c.createdAt)}</span>
                <span className="text-[12.5px] text-muted">{formatDate(c.fechaValidez)}</span>
                <span className="text-right font-mono text-[13px] font-semibold tabular-nums text-ink">
                  {formatCurrency(total)}
                </span>
                <span>
                  <StampBadge estado={c.estado} />
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
