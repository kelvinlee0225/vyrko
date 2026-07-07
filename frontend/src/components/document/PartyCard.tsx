import type { ReactNode } from 'react'

interface Field {
  label: string
  value: string
  mono?: boolean
}

interface PartyCardProps {
  title: string
  icon: ReactNode
  fields: Field[]
}

export function PartyCard({ title, icon, fields }: PartyCardProps) {
  return (
    <div className="rounded-lg border border-line bg-surface p-6">
      <div className="mb-4 flex items-center gap-2 text-[13px] font-semibold text-ink">
        <span className="flex h-[26px] w-[26px] items-center justify-center rounded-sm bg-surface-alt text-brand">
          {icon}
        </span>
        {title}
      </div>
      <dl className="m-0 grid grid-cols-2 gap-x-4 gap-y-2">
        {fields.map((f) => (
          <div className="flex flex-col gap-0.5" key={f.label}>
            <dt className="text-[11px] text-muted">{f.label}</dt>
            <dd className={`m-0 text-[13px] font-medium text-ink ${f.mono ? 'font-mono tabular-nums' : ''}`}>
              {f.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
