import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success'
  icon?: ReactNode
}

const variantClasses = {
  primary: 'bg-brand text-inverse hover:bg-brand-hover',
  secondary: 'bg-surface text-ink border-line hover:border-brand hover:text-brand',
  danger: 'bg-transparent text-accent border-accent hover:bg-accent hover:text-inverse',
  // Low-emphasis: no border, mirrors the hover treatment Sidebar/Topbar already use for tertiary actions.
  ghost: 'bg-transparent text-muted hover:bg-surface-alt hover:text-ink',
  // Reuses the success tone/soft pairing from StampBadge, so a "positive" action reads consistently with the status pills.
  success: 'bg-success-soft text-success hover:bg-success hover:text-inverse',
}

export function Button({ variant = 'primary', icon, children, className, ...rest }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-md border border-transparent px-4 py-2.5 text-[13.5px] font-semibold cursor-pointer transition-colors active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 disabled:active:translate-y-0 ${variantClasses[variant]} ${className ?? ''}`.trim()}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}
