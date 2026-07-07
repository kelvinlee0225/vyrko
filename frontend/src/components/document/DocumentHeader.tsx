import type { ReactNode } from 'react'
import { StampBadge } from '../StampBadge'

interface DocumentHeaderProps {
  eyebrow: string
  numero: string
  estado: string
  meta: { label: string; value: string }[]
  actions?: ReactNode
}

export function DocumentHeader({ eyebrow, numero, estado, meta, actions }: DocumentHeaderProps) {
  return (
    <div className="relative flex flex-wrap items-start justify-between gap-6 rounded-lg border border-line bg-surface px-8 py-6">
      <div
        className="absolute top-[-9px] left-7 h-[18px] w-[18px] rounded-full border border-line bg-canvas"
        aria-hidden="true"
      />
      <div
        className="absolute top-[-9px] right-7 h-[18px] w-[18px] rounded-full border border-line bg-canvas"
        aria-hidden="true"
      />
      <div className="flex flex-col gap-2">
        <span className="text-[11.5px] font-semibold uppercase tracking-[0.06em] text-muted">{eyebrow}</span>
        <div className="flex items-center gap-4">
          <h1 className="font-mono text-[22px] font-semibold tracking-[-0.01em] tabular-nums">{numero}</h1>
          <StampBadge estado={estado} />
        </div>
      </div>
      <div className="flex gap-8">
        {meta.map((m) => (
          <div className="flex flex-col gap-0.5" key={m.label}>
            <span className="text-[11px] uppercase tracking-[0.04em] text-muted">{m.label}</span>
            <span className="font-mono text-[13px] font-semibold tabular-nums text-ink">{m.value}</span>
          </div>
        ))}
      </div>
      {actions && <div className="flex w-full gap-2">{actions}</div>}
    </div>
  )
}
