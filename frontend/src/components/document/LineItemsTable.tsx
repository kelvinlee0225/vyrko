import { formatCurrency } from '../../utils/format'

interface LineItemRow {
  id: string
  servicio: { nombre: string }
  pieza: { nombre: string } | null
  descripcion: string
  cantidad: string
  precioUnitario: string
  descuento: string | null
}

export function LineItemsTable({ lineas }: { lineas: LineItemRow[] }) {
  return (
    <table className="w-full border-collapse overflow-hidden rounded-lg border border-line bg-surface [&>tbody>tr:last-child>td]:border-b-0">
      <thead>
        <tr>
          <th className="w-[35%] border-b border-line bg-surface-alt px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.04em] text-muted">
            Descripción
          </th>
          <th className="border-b border-line bg-surface-alt px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.04em] text-muted">
            Servicio
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
          const cantidad = parseFloat(linea.cantidad)
          const precioUnitario = parseFloat(linea.precioUnitario)
          const importe = cantidad * precioUnitario - (linea.descuento ? parseFloat(linea.descuento) : 0)
          return (
            <tr key={linea.id}>
              <td className="w-[35%] border-b border-line px-4 py-2 text-[13px] text-ink">{linea.descripcion}</td>
              <td className="border-b border-line px-4 py-2 text-[13px] text-ink">
                <span className="inline-flex rounded-full bg-surface-alt px-2 py-[2px] text-[11px] font-medium text-muted">
                  {linea.servicio.nombre}
                  {linea.pieza ? ` · ${linea.pieza.nombre}` : ''}
                </span>
              </td>
              <td className="border-b border-line px-4 py-2 text-right font-mono text-[13px] tabular-nums text-ink">
                {cantidad}
              </td>
              <td className="border-b border-line px-4 py-2 text-right font-mono text-[13px] tabular-nums text-ink">
                {formatCurrency(precioUnitario)}
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
