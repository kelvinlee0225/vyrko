import { Link } from 'react-router-dom'
import { IconWorkOrder, IconQuote, IconInvoice } from './icons'

const iconoPorClave = {
  ordenes: IconWorkOrder,
  cotizaciones: IconQuote,
  porCobrar: IconInvoice,
}

interface StatTileProps {
  etiqueta: string
  valor: string
  variacion: string
  icono: keyof typeof iconoPorClave
  to: string
}

export function StatTiles({ items }: { items: StatTileProps[] }) {
  return (
    <div className="grid grid-cols-3 gap-4 max-[720px]:grid-cols-1">
      {items.map((item) => {
        const Icon = iconoPorClave[item.icono]
        return (
          <Link
            className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-6 no-underline transition-colors hover:border-brand"
            to={item.to}
            key={item.etiqueta}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-surface-alt text-brand">
              <Icon size={20} />
            </span>
            <span className="font-mono text-2xl font-semibold tabular-nums text-ink">{item.valor}</span>
            <span className="text-[12.5px] font-medium text-muted">{item.etiqueta}</span>
            <span className="text-[11px] text-muted">{item.variacion}</span>
          </Link>
        )
      })}
    </div>
  )
}
