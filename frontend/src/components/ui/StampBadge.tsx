export type Tone = 'success' | 'warning' | 'error' | 'neutral'

const estadoMap: Record<string, { label: string; tone: Tone }> = {
  borrador: { label: 'Borrador', tone: 'neutral' },
  entregada: { label: 'Entregada', tone: 'warning' },
  vencida: { label: 'Vencida', tone: 'error' },
  pendiente: { label: 'Pendiente', tone: 'warning' },
  pago_parcial: { label: 'Pago parcial', tone: 'warning' },
  pagada: { label: 'Pagada', tone: 'success' },
  anulada: { label: 'Anulada', tone: 'error' },
  recibida: { label: 'Recibida', tone: 'neutral' },
  en_progreso: { label: 'En progreso', tone: 'warning' },
  entregada_temporalmente: { label: 'Entrega temporal', tone: 'warning' },
  cancelada: { label: 'Cancelada', tone: 'error' },
  entrada: { label: 'Entrada', tone: 'success' },
  salida: { label: 'Salida', tone: 'neutral' },
}

const toneClasses: Record<Tone, string> = {
  success: 'text-success bg-success-soft',
  warning: 'text-warning bg-warning-soft',
  error: 'text-error bg-error-soft',
  neutral: 'text-muted bg-surface-alt',
}

interface StampBadgeProps {
  estado?: keyof typeof estadoMap | string
  label?: string
  tone?: Tone
}

/**
 * For órdenes de trabajo, 'entregada' is a terminal success state — unlike la
 * cotización 'entregada' (in the shared map as warning: awaiting client response).
 */
export function OrdenEstadoBadge({ estado }: { estado: string }) {
  return <StampBadge estado={estado} tone={estado === 'entregada' ? 'success' : undefined} />
}

export function StampBadge({ estado, label, tone }: StampBadgeProps) {
  const resolved = estado ? estadoMap[estado] : undefined
  const finalLabel = label ?? resolved?.label ?? estado ?? ''
  const finalTone: Tone = tone ?? resolved?.tone ?? 'neutral'

  return (
    <span
      className={`relative inline-flex -rotate-2 items-center rounded-sm border-[1.5px] border-current px-[11px] py-1 font-mono text-[11px] font-semibold uppercase leading-[1.4] tracking-[0.06em] ${toneClasses[finalTone]}`}
    >
      <span className="pointer-events-none absolute inset-0.5 rounded-[2px] border border-current opacity-45" aria-hidden="true" />
      {finalLabel}
    </span>
  )
}
