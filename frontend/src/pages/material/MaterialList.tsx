import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { StampBadge } from '../../components/ui/StampBadge'
import { IconPlus, IconSearch } from '../../components/ui/icons'
import { useApiList } from '../../hooks/useApiList'
import { materialService } from '../../services/material'
import { NewMaterialModal } from '../../components/forms/NewMaterialModal'
import { NewMovimientoModal } from '../../components/forms/NewMovimientoModal'
import { formatCurrency } from '../../utils/format'

const columns = 'grid-cols-[110px_1fr_150px_110px_100px_100px_110px]'

export function MaterialList() {
  const { data: materiales, loading, error, reload } = useApiList(materialService.list)
  const [query, setQuery] = useState('')
  const [showNewMaterial, setShowNewMaterial] = useState(false)
  const [showNewMovimiento, setShowNewMovimiento] = useState(false)

  const resultados = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return materiales
    return materiales.filter((m) =>
      [m.codigo, m.nombre, m.categoria.nombre].some((field) => field.toLowerCase().includes(q)),
    )
  }, [query, materiales])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl">Inventario</h1>
          <p className="mt-1 text-[13.5px] text-muted">{materiales.length} materiales registrados.</p>
        </div>
        <div className="flex flex-shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setShowNewMaterial(true)}
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-md border border-line bg-surface px-4 py-2.5 text-[13.5px] font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
          >
            <IconPlus size={16} />
            Nuevo material
          </button>
          <button
            type="button"
            onClick={() => setShowNewMovimiento(true)}
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-md border border-transparent bg-brand px-4 py-2.5 text-[13.5px] font-semibold text-inverse transition-colors hover:bg-brand-hover"
          >
            <IconPlus size={16} />
            Registrar movimiento
          </button>
        </div>
      </div>

      <label className="flex w-full max-w-sm items-center gap-2 rounded-md border border-line bg-surface px-4 py-2 text-muted">
        <IconSearch size={16} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por código, nombre o categoría…"
          className="w-full border-none bg-transparent text-[13.5px] text-ink outline-none placeholder:text-muted"
        />
      </label>

      <div className="overflow-x-auto rounded-lg border border-line bg-surface">
        <div className={`grid ${columns} min-w-[900px] gap-4 border-b border-line bg-surface-alt px-6 py-2 text-[11px] font-semibold uppercase tracking-[0.04em] text-muted`}>
          <span>Código</span>
          <span>Nombre</span>
          <span>Categoría</span>
          <span className="text-right">Costo</span>
          <span className="text-right">Stock</span>
          <span className="text-right">Mínimo</span>
          <span>Estado</span>
        </div>
        <div className="flex min-w-[900px] flex-col">
          {loading && <p className="px-6 py-8 text-center text-[13px] text-muted">Cargando materiales…</p>}
          {error && <p className="px-6 py-8 text-center text-[13px] text-error">{error}</p>}
          {!loading && !error && resultados.length === 0 && (
            <p className="px-6 py-8 text-center text-[13px] text-muted">No se encontraron materiales para "{query}".</p>
          )}
          {resultados.map((m) => {
            const stockActual = parseFloat(m.stockActual)
            const bajoStock = stockActual <= m.stockMinimo
            return (
              <Link
                to={`/inventario/${m.id}`}
                key={m.id}
                className={`grid ${columns} items-center gap-4 border-b border-line px-6 py-4 no-underline transition-colors last:border-b-0 hover:bg-surface-alt`}
              >
                <span className="font-mono text-[13px] font-semibold tabular-nums text-ink">{m.codigo}</span>
                <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-medium text-ink">
                  {m.nombre}
                </span>
                <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[12.5px] text-muted">
                  {m.categoria.nombre}
                </span>
                <span className="text-right font-mono text-[13px] tabular-nums text-ink">
                  {formatCurrency(parseFloat(m.precioCosto))}
                </span>
                <span className={`text-right font-mono text-[13px] font-semibold tabular-nums ${bajoStock ? 'text-accent' : 'text-ink'}`}>
                  {stockActual}
                </span>
                <span className="text-right font-mono text-[13px] tabular-nums text-muted">{m.stockMinimo}</span>
                <span>
                  {bajoStock ? (
                    <StampBadge label="Bajo stock" tone="warning" />
                  ) : (
                    <StampBadge label="OK" tone="success" />
                  )}
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      {showNewMaterial && <NewMaterialModal onClose={() => setShowNewMaterial(false)} />}
      {showNewMovimiento && (
        <NewMovimientoModal
          onClose={() => {
            setShowNewMovimiento(false)
            reload()
          }}
        />
      )}
    </div>
  )
}
