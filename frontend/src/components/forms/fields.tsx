import type { ReactNode } from 'react'

export const fieldClass =
  'w-full min-w-0 rounded-md border border-line bg-canvas px-3 py-2 text-[13.5px] text-ink outline-none'

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className="text-[12.5px] font-medium text-muted">{label}</span>
      {children}
    </label>
  )
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null
  return <p className="rounded-md bg-error-soft px-3 py-2 text-[12.5px] text-error">{message}</p>
}
