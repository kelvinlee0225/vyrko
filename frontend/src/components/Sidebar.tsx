import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  IconPanel,
  IconQuote,
  IconWorkOrder,
  IconInvoice,
  IconCustomers,
  IconInventory,
  IconSettings,
  IconPin,
} from './icons'
import { useDataStore } from '../store/dataStore'

export function Sidebar() {
  const cotizaciones = useDataStore((s) => s.cotizaciones)
  const ordenesTrabajo = useDataStore((s) => s.ordenesTrabajo)
  const [pinned, setPinned] = useState(() => localStorage.getItem('sidebar-pinned') === '1')
  const [hovered, setHovered] = useState(false)
  const expanded = pinned || hovered

  useEffect(() => {
    localStorage.setItem('sidebar-pinned', pinned ? '1' : '0')
  }, [pinned])

  const cotizacionesPendientes = cotizaciones.filter((c) => c.estado === 'enviada').length
  const ordenesAbiertas = ordenesTrabajo.filter((o) => o.estado !== 'entregado' && o.estado !== 'cancelado').length

  const navItems = [
    { to: '/', label: 'Panel principal', icon: IconPanel, end: true },
    { to: '/cotizaciones', label: 'Cotizaciones', icon: IconQuote, badge: String(cotizacionesPendientes) },
    { to: '/ordenes', label: 'Órdenes de trabajo', icon: IconWorkOrder, badge: String(ordenesAbiertas) },
    { to: '/facturacion', label: 'Facturación', icon: IconInvoice },
    { to: '/clientes', label: 'Clientes', icon: IconCustomers },
    { to: '/inventario', label: 'Inventario', icon: IconInventory, disabled: true },
  ]

  const itemClass = (extra = '') =>
    `relative flex items-center gap-2 whitespace-nowrap rounded-md border-l-[3px] border-transparent py-[9px] text-[13.5px] font-medium text-muted no-underline transition-colors ${
      expanded ? 'justify-start px-[10px]' : 'justify-center px-0'
    } ${extra}`.trim()

  return (
    <aside
      className={`sticky top-0 z-10 flex h-[100svh] flex-shrink-0 flex-col overflow-hidden border-r border-line bg-surface px-2 py-6 transition-[width] duration-150 ${
        expanded ? 'w-[232px]' : 'w-16'
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex min-h-[30px] items-center gap-2 px-1 pb-6">
        <span className="flex h-[30px] min-w-[30px] flex-shrink-0 items-center justify-center rounded-sm bg-brand px-1.5 font-display text-[13px] font-bold tracking-[0.02em] text-inverse">
          NY
        </span>
        {expanded && (
          <span className="overflow-hidden text-ellipsis whitespace-nowrap font-display text-[15px] font-semibold tracking-[-0.01em] text-ink">
            Taller Nang Yang
          </span>
        )}
        {expanded && (
          <button
            type="button"
            className={`ml-auto flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-sm text-muted transition-colors hover:bg-surface-alt hover:text-ink ${
              pinned ? 'text-brand' : ''
            }`}
            onClick={() => setPinned((p) => !p)}
            title={pinned ? 'Desanclar panel' : 'Fijar panel abierto'}
          >
            <IconPin />
          </button>
        )}
      </div>

      <nav className="flex flex-col gap-0.5">
        {navItems.map((item) => {
          const Icon = item.icon
          if (item.disabled) {
            return (
              <div className={itemClass('cursor-default opacity-50')} key={item.to} title="Próximamente">
                <Icon />
                {expanded && (
                  <>
                    <span>{item.label}</span>
                    <span className="ml-auto text-[10px] uppercase tracking-[0.04em] text-muted">Pronto</span>
                  </>
                )}
              </div>
            )
          }
          return (
            <NavLink
              to={item.to}
              end={item.end}
              key={item.to}
              title={item.label}
              className={({ isActive }) =>
                itemClass(
                  `hover:bg-surface-alt hover:text-ink ${
                    isActive ? 'border-l-brand bg-surface-alt font-semibold text-brand' : ''
                  }`,
                )
              }
            >
              <Icon />
              {expanded && <span>{item.label}</span>}
              {expanded && item.badge && (
                <span className="ml-auto rounded-full bg-accent px-1.5 py-[3px] font-mono text-[11px] font-semibold leading-none text-inverse">
                  {item.badge}
                </span>
              )}
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-4 border-t border-line pt-4">
        <div className={itemClass('cursor-default opacity-50')} title="Ajustes">
          <IconSettings />
          {expanded && <span>Ajustes</span>}
        </div>
        {expanded && (
          <div className="flex flex-col gap-0.5 whitespace-nowrap px-[14px] py-2">
            <span className="overflow-hidden text-ellipsis text-[12.5px] font-semibold text-ink">Taller Nang Yang</span>
            <span className="font-mono text-[11px] text-muted">RNC 1-31-08452-3</span>
          </div>
        )}
      </div>
    </aside>
  )
}
