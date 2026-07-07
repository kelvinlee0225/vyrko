import type { LineaItem } from '../../data/mockData'
import { formatCurrency } from '../../utils/format'

export function LineItemsTable({ lineas }: { lineas: LineaItem[] }) {
  return (
    <table className="w-full border-collapse overflow-hidden rounded-lg border border-line bg-surface [&>tbody>tr:last-child>td]:border-b-0">
      <thead>
        <tr>
          <th className="w-[40%] border-b border-line bg-surface-alt px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.04em] text-muted">
            Descripción
          </th>
          <th className="border-b border-line bg-surface-alt px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.04em] text-muted">
            Tipo
          </th>
          <th className="border-b border-line bg-surface-alt px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-[0.04em] text-muted">
            Cant.
          </th>
          <th className="border-b border-line bg-surface-alt px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-[0.04em] text-muted">
            Precio unit.
          </th>
          <th className="border-b border-line bg-surface-alt px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-[0.04em] text-muted">
            Importe
          </th>
        </tr>
      </thead>
      <tbody>
        {lineas.map((linea) => {
          const importe = linea.cantidad * linea.precioUnitario - (linea.descuento ?? 0)
          return (
            <tr key={linea.descripcion}>
              <td className="w-[40%] border-b border-line px-4 py-2 text-[13px] text-ink">{linea.descripcion}</td>
              <td className="border-b border-line px-4 py-2 text-[13px] text-ink">
                <span className="inline-flex rounded-full bg-surface-alt px-2 py-[2px] text-[11px] font-medium text-muted">
                  {linea.tipo === 'servicio' ? 'Servicio' : 'Pieza'}
                </span>
              </td>
              <td className="border-b border-line px-4 py-2 text-right font-mono text-[13px] tabular-nums text-ink">
                {linea.cantidad}
              </td>
              <td className="border-b border-line px-4 py-2 text-right font-mono text-[13px] tabular-nums text-ink">
                {formatCurrency(linea.precioUnitario)}
              </td>
              <td className="border-b border-line px-4 py-2 text-right font-mono text-[13px] font-semibold tabular-nums text-ink">
                {formatCurrency(importe)}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
