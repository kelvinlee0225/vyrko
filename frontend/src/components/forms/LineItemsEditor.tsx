import { IconPlus, IconTrash } from '../ui/icons'
import { fieldClass } from './fields'
import { SearchableSelect } from './SearchableSelect'
import { useApiList } from '../../hooks/useApiList'
import { servicioService } from '../../services/servicio'
import { piezaService } from '../../services/pieza'
import { formatCurrency } from '../../utils/format'
import { emptyLinea, type LineaItemDraft } from './lineaItemDraft'

interface LineItemsEditorProps {
  lineas: LineaItemDraft[]
  onChange: (lineas: LineaItemDraft[]) => void
}

function computeItbis(cantidad: number, precioUnitario: number, llevaItbis: boolean) {
  if (!llevaItbis) return 0
  return Math.round(cantidad * precioUnitario * 0.18 * 100) / 100
}

function autoLabel(servicioNombre?: string, piezaNombre?: string) {
  if (!servicioNombre) return ''
  return piezaNombre ? `${servicioNombre} · ${piezaNombre}` : servicioNombre
}

export function LineItemsEditor({ lineas, onChange }: LineItemsEditorProps) {
  const { data: servicios } = useApiList(servicioService.list)
  const { data: piezas } = useApiList(piezaService.list)

  function updateLinea(index: number, patch: Partial<LineaItemDraft>) {
    const next = lineas.map((l, i) => (i === index ? { ...l, ...patch } : l))
    if (patch.cantidad !== undefined || patch.precioUnitario !== undefined) {
      const linea = next[index]
      const servicio = servicios.find((s) => s.id === linea.servicioId)
      next[index] = { ...linea, itbis: computeItbis(linea.cantidad, linea.precioUnitario, servicio?.llevaItbis ?? true) }
    }
    onChange(next)
  }

  function handleServicioChange(index: number, servicioId: string) {
    const servicio = servicios.find((s) => s.id === servicioId)
    const linea = lineas[index]
    const servicioAnterior = servicios.find((s) => s.id === linea.servicioId)
    const pieza = piezas.find((p) => p.id === (linea.piezaId ?? undefined))
    const labelAnterior = autoLabel(servicioAnterior?.nombre, pieza?.nombre)
    const descripcion =
      !linea.descripcion || linea.descripcion === labelAnterior
        ? autoLabel(servicio?.nombre, pieza?.nombre)
        : linea.descripcion
    updateLinea(index, {
      servicioId,
      descripcion,
      precioUnitario: servicio ? parseFloat(servicio.precioBase) : linea.precioUnitario,
      itbis: servicio
        ? computeItbis(linea.cantidad, parseFloat(servicio.precioBase), servicio.llevaItbis)
        : linea.itbis,
    })
  }

  function handlePiezaChange(index: number, piezaId: string) {
    const linea = lineas[index]
    const servicio = servicios.find((s) => s.id === linea.servicioId)
    const piezaAnterior = piezas.find((p) => p.id === (linea.piezaId ?? undefined))
    const piezaNueva = piezas.find((p) => p.id === piezaId)
    const labelAnterior = autoLabel(servicio?.nombre, piezaAnterior?.nombre)
    const descripcion =
      !linea.descripcion || linea.descripcion === labelAnterior
        ? autoLabel(servicio?.nombre, piezaNueva?.nombre)
        : linea.descripcion
    updateLinea(index, { piezaId: piezaId || null, descripcion })
  }

  function removeLinea(index: number) {
    onChange(lineas.filter((_, i) => i !== index))
  }

  return (
    <div className="flex min-w-0 flex-col gap-3">
      {lineas.map((linea, index) => {
        const importe = linea.cantidad * linea.precioUnitario - (linea.descuento ?? 0)
        return (
          <div key={index} className="flex min-w-0 flex-col gap-2 rounded-md border border-line bg-canvas p-3">
            <div className="flex min-w-0 gap-2">
              <div className="min-w-0 flex-1">
                <SearchableSelect
                  value={linea.servicioId}
                  onChange={(value) => handleServicioChange(index, value)}
                  placeholder="Buscar servicio…"
                  options={servicios.map((s) => ({
                    value: s.id,
                    label: s.nombre,
                    sublabel: `${s.tipoTrabajo} · ${formatCurrency(parseFloat(s.precioBase))}`,
                  }))}
                />
              </div>
              <div className="w-48 flex-shrink-0">
                <SearchableSelect
                  value={linea.piezaId ?? ''}
                  onChange={(value) => handlePiezaChange(index, value)}
                  placeholder="Pieza (opcional)…"
                  options={piezas.map((p) => ({ value: p.id, label: p.nombre }))}
                />
              </div>
              <button
                type="button"
                onClick={() => removeLinea(index)}
                disabled={lineas.length === 1}
                aria-label="Eliminar línea"
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md text-muted transition-colors hover:bg-error-soft hover:text-error disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted"
              >
                <IconTrash size={15} />
              </button>
            </div>
            <input
              type="text"
              value={linea.descripcion}
              onChange={(e) => updateLinea(index, { descripcion: e.target.value })}
              placeholder="Descripción"
              className={fieldClass}
            />
            <div className="grid grid-cols-4 gap-2">
              <label className="flex flex-col gap-1">
                <span className="text-[11px] text-muted">Cantidad</span>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={linea.cantidad}
                  onChange={(e) => updateLinea(index, { cantidad: parseFloat(e.target.value) || 0 })}
                  className={fieldClass}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[11px] text-muted">Precio unit.</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={linea.precioUnitario}
                  onChange={(e) => updateLinea(index, { precioUnitario: parseFloat(e.target.value) || 0 })}
                  className={fieldClass}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[11px] text-muted">Descuento</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={linea.descuento ?? 0}
                  onChange={(e) => updateLinea(index, { descuento: parseFloat(e.target.value) || 0 })}
                  className={fieldClass}
                />
              </label>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-muted">Importe (+ITBIS)</span>
                <span className="flex h-9 items-center text-[13px] font-semibold tabular-nums text-ink">
                  {formatCurrency(importe)}
                </span>
              </div>
            </div>
          </div>
        )
      })}
      <button
        type="button"
        onClick={() => onChange([...lineas, emptyLinea()])}
        className="flex items-center justify-center gap-2 rounded-md border border-dashed border-line py-2 text-[12.5px] font-medium text-muted transition-colors hover:border-brand hover:text-brand"
      >
        <IconPlus size={14} /> Agregar línea
      </button>
    </div>
  )
}
