import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { StampBadge } from '../components/StampBadge'
import { IconPlus, IconSearch } from '../components/icons'
import { calcularTotales } from '../data/mockData'
import { useDataStore } from '../store/dataStore'
import { formatCurrency, formatDate } from '../utils/format'

const columns = 'grid-cols-[120px_1fr_150px_130px_95px_100px_100px_105px]'

export function InvoiceList() {
  const facturas = useDataStore((s) => s.facturas)
  const [query, setQuery] = useState('')

  const resultados = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return facturas
    return facturas.filter((f) =>
      [f.numero, f.cliente.nombre, f.vehiculo.placa, f.vehiculo.marca, f.vehiculo.modelo].some((field) =>
        field.toLowerCase().includes(q),
      ),
    )
  }, [query, facturas])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl">Facturación</h1>
          <p className="mt-1 text-[13.5px] text-muted">{facturas.length} facturas registradas.</p>
        </div>
        <Link
          to="/facturacion/nueva"
          className="inline-flex items-center gap-2 whitespace-nowrap rounded-md border border-transparent bg-brand px-4 py-2.5 text-[13.5px] font-semibold text-inverse no-underline transition-colors hover:bg-brand-hover"
        >
          <IconPlus />
          Nueva factura
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
        <div className={`grid ${columns} min-w-[980px] gap-4 border-b border-line bg-surface-alt px-6 py-2 text-[11px] font-semibold uppercase tracking-[0.04em] text-muted`}>
          <span>Número</span>
          <span>Cliente</span>
          <span>Vehículo</span>
          <span>Aseguradora</span>
          <span>Vencimiento</span>
          <span className="text-right">Total</span>
          <span className="text-right">Saldo</span>
          <span>Estado</span>
        </div>
        <div className="flex min-w-[980px] flex-col">
          {resultados.length === 0 && (
            <p className="px-6 py-8 text-center text-[13px] text-muted">No se encontraron facturas para "{query}".</p>
          )}
          {resultados.map((f) => {
            const { total } = calcularTotales(f.lineas, f.descuentoGlobal)
            const saldo = total - f.montoPagado
            return (
              <Link
                to={`/facturacion/${f.numero}`}
                key={f.numero}
                className={`grid ${columns} items-center gap-4 border-b border-line px-6 py-4 no-underline transition-colors last:border-b-0 hover:bg-surface-alt`}
              >
                <span className="font-mono text-[13px] font-semibold tabular-nums text-ink">{f.numero}</span>
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-medium text-ink">
                    {f.cliente.nombre}
                  </span>
                  {f.cliente.esAseguradora && (
                    <span className="inline-flex w-fit rounded-full bg-surface-alt px-2 py-[2px] text-[10px] font-medium text-muted">
                      Aseguradora
                    </span>
                  )}
                </span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[12.5px] font-medium text-ink">
                    {f.vehiculo.placa}
                  </span>
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[12px] text-muted">
                    {f.vehiculo.marca} {f.vehiculo.modelo}
                  </span>
                </span>
                <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[12.5px] text-muted">
                  {f.vehiculo.aseguradora === '—' ? 'Particular' : f.vehiculo.aseguradora}
                </span>
                <span className="text-[12.5px] text-muted">{formatDate(f.fechaVencimiento)}</span>
                <span className="text-right font-mono text-[13px] font-semibold tabular-nums text-ink">
                  {formatCurrency(total)}
                </span>
                <span
                  className={`text-right font-mono text-[13px] font-semibold tabular-nums ${saldo > 0 ? 'text-accent' : 'text-muted'}`}
                >
                  {formatCurrency(saldo)}
                </span>
                <span>
                  <StampBadge estado={f.estado} />
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
