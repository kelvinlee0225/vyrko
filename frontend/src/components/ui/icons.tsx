type IconProps = { size?: number }

const base = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function IconPanel({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <rect x="3.5" y="3.5" width="7" height="8" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="5" rx="1.5" />
      <rect x="13.5" y="11.5" width="7" height="9" rx="1.5" />
      <rect x="3.5" y="14.5" width="7" height="6" rx="1.5" />
    </svg>
  )
}

export function IconQuote({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M6 3.5h9l3.5 3.5V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
      <path d="M15 3.5V7h3.5" />
      <path d="M8 12h8M8 15.5h8M8 8.5h4" />
    </svg>
  )
}

export function IconWorkOrder({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M14.7 4.3a3 3 0 0 0-4.24 4.24L4 15v3.5a1.5 1.5 0 0 0 1.5 1.5H9l6.46-6.46a3 3 0 0 0 4.24-4.24l-2.5 2.5-2-2 2.5-2.5Z" />
    </svg>
  )
}

export function IconInvoice({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M6 3.5h12v17l-2.5-1.5-2 1.5-2-1.5-2 1.5-2-1.5L6 20.5Z" />
      <path d="M8.5 8h7M8.5 11.5h7M8.5 15h4.5" />
    </svg>
  )
}

export function IconCustomers({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20c0-3.3 2.5-5.5 5.5-5.5s5.5 2.2 5.5 5.5" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M15.8 14.6c2.4.3 4.2 2.2 4.2 5" />
    </svg>
  )
}

export function IconInventory({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M4 7.5 12 3.5l8 4v9L12 20.5l-8-4Z" />
      <path d="M4 7.5 12 11.5m0 0 8-4M12 11.5v9" />
    </svg>
  )
}

export function IconSettings({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2.2M12 18.3v2.2M20.5 12h-2.2M5.7 12H3.5M17.7 6.3l-1.5 1.5M7.8 16.2l-1.5 1.5M17.7 17.7l-1.5-1.5M7.8 7.8 6.3 6.3" />
    </svg>
  )
}

export function IconSearch({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4-4" />
    </svg>
  )
}

export function IconChevronDown({ size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export function IconPlus({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function IconClose({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  )
}

export function IconTrash({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M5 7h14M9.5 7V5.5a1.5 1.5 0 0 1 1.5-1.5h2a1.5 1.5 0 0 1 1.5 1.5V7M7 7l.7 12a2 2 0 0 0 2 1.9h4.6a2 2 0 0 0 2-1.9L17 7" />
    </svg>
  )
}

export function IconCar({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M4 16v-3l1.8-4.3A2 2 0 0 1 7.6 7.4h8.8a2 2 0 0 1 1.8 1.3L20 13v3" />
      <path d="M4 16h16v2.5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V17H7v1.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z" />
      <circle cx="7.5" cy="16" r="1.4" />
      <circle cx="16.5" cy="16" r="1.4" />
    </svg>
  )
}

export function IconShield({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M12 3.5 19 6v6c0 4.5-3 7.5-7 8.5-4-1-7-4-7-8.5V6Z" />
    </svg>
  )
}

export function IconPin({ size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M12 2.5c-3 0-5.5 2.3-5.5 5.5 0 3.8 5.5 10.5 5.5 10.5s5.5-6.7 5.5-10.5c0-3.2-2.5-5.5-5.5-5.5Z" />
      <circle cx="12" cy="8" r="2" />
    </svg>
  )
}

export function IconCatalog({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M12 3.5 20 8l-8 4.5L4 8Z" />
      <path d="m4 12.5 8 4.5 8-4.5" />
      <path d="m4 16.5 8 4.5 8-4.5" />
    </svg>
  )
}

export function IconWrench({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M14.7 6.3a4 4 0 0 0-5.4 4.9L4 16.5V20h3.5l5.3-5.3a4 4 0 0 0 4.9-5.4l-2.8 2.8-2.4-2.4Z" />
    </svg>
  )
}

export function IconUser({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c0-3.6 3-6.5 7.5-6.5s7.5 2.9 7.5 6.5" />
    </svg>
  )
}

export function IconDownload({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M12 3.5v11.5m0 0-4-4m4 4 4-4" />
      <path d="M5 18h14" />
    </svg>
  )
}
