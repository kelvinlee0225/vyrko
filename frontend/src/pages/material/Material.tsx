import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { StampBadge } from '../../components/ui/StampBadge'
import { Button } from '../../components/ui/Button'
import { NewMovimientoModal } from '../../components/forms/NewMovimientoModal'
import { useApiResource } from '../../hooks/useApiResource'
import { useApiList } from '../../hooks/useApiList'
import { materialService } from '../../services/material'
import { movimientoInventarioService } from '../../services/movimientoInventario'
import { formatCurrency, formatDate } from '../../utils/format'

export function Material() {
  const { id } = useParams()
  const { data: m, loading, error, reload: reloadMaterial } = useApiResource(() => materialService.get(id!), id)
  const { data: movimientosInventario, reload: reloadMovimientos } = useApiList(movimientoInventarioService.list)
  const [showNewMovimiento, setShowNewMovimiento] = useState(false)

  function handleCloseMovimiento() {
    setShowNewMovimiento(false)
    reloadMaterial()
    reloadMovimientos()
  }

  if (loading) {
    return <p className="text-[13.5px] text-muted">Cargando material…</p>
  }

  if (error || !m) {
    return (
      <div className="flex flex-col gap-4">
        <Link to="/inventario" className="self-start text-[12.5px] font-medium text-muted no-underline hover:text-ink">
          ← Volver a inventario
        </Link>
        <p className="text-[13.5px] text-muted">{error ?? `No se encontró el material ${id}.`}</p>
      </div>
    )
  }

  const stockActual = parseFloat(m.stockActual)
  const bajoStock = stockActual <= m.stockMinimo
  const movimientos = movimientosInventario.filter((mov) => mov.material.id === m.id)

  return (
    <div className="flex flex-col gap-6">
      <Link to="/inventario" className="self-start text-[12.5px] font-medium text-muted no-underline hover:text-ink">
        ← Volver a inventario
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-6 rounded-lg border border-line bg-surface p-6">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-xl">{m.nombre}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[12.5px] text-muted">{m.codigo}</span>
            <span className="inline-flex w-fit rounded-full bg-surface-alt px-2 py-[2px] text-[10px] font-medium text-muted">
              {m.categoria.nombre}
            </span>
            {bajoStock && <StampBadge label="Bajo stock" tone="warning" />}
          </div>
        </div>
        <Button variant="primary" onClick={() => setShowNewMovimiento(true)}>
          Registrar movimiento
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4 max-[720px]:grid-cols-1">
        <div className="rounded-lg border border-line bg-surface p-6">
          <span className="text-[12.5px] text-muted">Costo</span>
          <p className="mt-1 font-mono text-[20px] font-semibold tabular-nums text-ink">
            {formatCurrency(parseFloat(m.precioCosto))}
          </p>
        </div>
        <div className="rounded-lg border border-line bg-surface p-6">
          <span className="text-[12.5px] text-muted">Stock actual</span>
          <p className={`mt-1 font-mono text-[20px] font-semibold tabular-nums ${bajoStock ? 'text-accent' : 'text-ink'}`}>
            {stockActual}
          </p>
        </div>
        <div className="rounded-lg border border-line bg-surface p-6">
          <span className="text-[12.5px] text-muted">Stock mínimo</span>
          <p className="mt-1 font-mono text-[20px] font-semibold tabular-nums text-ink">{m.stockMinimo}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-line bg-surface">
        <div className="border-b border-line px-6 py-4">
          <h2 className="text-[15px]">Historial de movimientos</h2>
        </div>
        {movimientos.length === 0 ? (
          <p className="px-6 py-8 text-center text-[13px] text-muted">Sin movimientos registrados para este material.</p>
        ) : (
          <div className="flex flex-col">
            {movimientos.map((mov) => (
              <div className="flex items-center gap-4 border-b border-line px-6 py-4 last:border-b-0" key={mov.id}>
                <StampBadge estado={mov.tipoMovimiento} />
                <span className="font-mono text-[13px] font-semibold tabular-nums text-ink">
                  {mov.tipoMovimiento === 'entrada' ? '+' : '−'}
                  {mov.cantidad}
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[12.5px] text-ink">
                    {mov.motivo ?? 'Sin motivo registrado'}
                  </span>
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[11.5px] text-muted">
                    {mov.proveedor ? `Proveedor: ${mov.proveedor.nombre} · ` : ''}
                    {mov.usuario.nombre}
                  </span>
                </div>
                <span className="flex-shrink-0 text-[12px] text-muted">{formatDate(mov.createdAt.slice(0, 10))}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showNewMovimiento && <NewMovimientoModal onClose={handleCloseMovimiento} initialMaterialId={m.id} />}
    </div>
  )
}
