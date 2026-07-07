import type { LineaItem } from '../../data/mockData'
import { IconPlus, IconTrash } from '../icons'
import { fieldClass } from './fields'
import { formatCurrency } from '../../utils/format'

interface LineItemsEditorProps {
  lineas: LineaItem[]
  onChange: (lineas: LineaItem[]) => void
}

function computeItbis(cantidad: number, precioUnitario: number) {
  return Math.round(cantidad * precioUnitario * 0.18 * 100) / 100
}

function emptyLinea(): LineaItem {
  return { descripcion: '', tipo: 'servicio', cantidad: 1, precioUnitario: 0, itbis: 0 }
}

export function LineItemsEditor({ lineas, onChange }: LineItemsEditorProps) {
  function updateLinea(index: number, patch: Partial<LineaItem>) {
    const next = lineas.map((l, i) => (i === index ? { ...l, ...patch } : l))
    if (patch.cantidad !== undefined || patch.precioUnitario !== undefined) {
      const linea = next[index]
      next[index] = { ...linea, itbis: computeItbis(linea.cantidad, linea.precioUnitario) }
    }
    onChange(next)
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
              <input
                type="text"
                value={linea.descripcion}
                onChange={(e) => updateLinea(index, { descripcion: e.target.value })}
                placeholder="Descripción"
                className={`${fieldClass} min-w-0 flex-1`}
              />
              <select
                value={linea.tipo}
                onChange={(e) => updateLinea(index, { tipo: e.target.value as LineaItem['tipo'] })}
                className={`${fieldClass} w-32`}
              >
                <option value="servicio">Servicio</option>
                <option value="pieza">Pieza</option>
              </select>
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
            <div className="grid min-w-0 grid-cols-4 gap-2">
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
                <span className="text-[11px] text-muted">Importe (+18% ITBIS)</span>
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
