import type { ReactNode } from 'react'
import { formatCurrency } from '../../utils/format'

interface TotalsCardProps {
  subtotal: number
  itbis: number
  descuentoGlobal: number
  total: number
  extraRows?: { label: string; value: string; muted?: boolean }[]
  children?: ReactNode
}

export function TotalsCard({ subtotal, itbis, descuentoGlobal, total, extraRows, children }: TotalsCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-line bg-surface p-6">
      <div className="flex items-center justify-between text-[13px] text-ink">
        <span>Subtotal</span>
        <span className="font-mono tabular-nums">{formatCurrency(subtotal)}</span>
      </div>
      <div className="flex items-center justify-between text-[13px] text-ink">
        <span>ITBIS (18%)</span>
        <span className="font-mono tabular-nums">{formatCurrency(itbis)}</span>
      </div>
      {descuentoGlobal > 0 && (
        <div className="flex items-center justify-between text-[13px] text-muted">
          <span>Descuento</span>
          <span className="font-mono tabular-nums">−{formatCurrency(descuentoGlobal)}</span>
        </div>
      )}
      <div className="mt-2 flex items-center justify-between border-t border-line pt-4 text-[17px] font-bold text-brand">
        <span>Total</span>
        <span className="font-mono tabular-nums">{formatCurrency(total)}</span>
      </div>
      {extraRows?.map((row) => (
        <div
          className={`flex items-center justify-between text-[13px] ${row.muted ? 'text-muted' : 'text-ink'}`}
          key={row.label}
        >
          <span>{row.label}</span>
          <span className="font-mono tabular-nums">{row.value}</span>
        </div>
      ))}
      {children}
    </div>
  )
}
