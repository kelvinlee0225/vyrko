import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  IconPanel,
  IconQuote,
  IconWorkOrder,
  IconInvoice,
  IconCustomers,
  IconInventory,
  IconWrench,
  IconCatalog,
  IconSettings,
  IconPin,
  IconUser,
} from './ui/icons'
import { useApiList } from '../hooks/useApiList'
import { cotizacionService } from '../services/cotizacion'
import { ordenTrabajoService } from '../services/ordenTrabajo'
import { materialService } from '../services/material'
import { useAuth } from '../context/useAuth'

export function Sidebar() {
  const { user } = useAuth()
  const { data: cotizaciones } = useApiList(cotizacionService.list)
  const { data: ordenesTrabajo } = useApiList(ordenTrabajoService.list)
  const { data: materiales } = useApiList(materialService.list)
  const [pinned, setPinned] = useState(() => localStorage.getItem('sidebar-pinned') === '1')
  const [hovered, setHovered] = useState(false)
  const expanded = pinned || hovered

  useEffect(() => {
    localStorage.setItem('sidebar-pinned', pinned ? '1' : '0')
  }, [pinned])

  const cotizacionesPendientes = cotizaciones.filter((c) => c.estado === 'entregada').length
  const ordenesAbiertas = ordenesTrabajo.filter((o) => o.estado !== 'entregada' && o.estado !== 'cancelada').length
  const materialesBajoStock = materiales.filter((m) => parseFloat(m.stockActual) <= m.stockMinimo).length

  const navItems = [
    { to: '/', label: 'Panel principal', icon: IconPanel, end: true },
    { to: '/cotizaciones', label: 'Cotizaciones', icon: IconQuote, badge: String(cotizacionesPendientes) },
    { to: '/ordenes', label: 'Órdenes de trabajo', icon: IconWorkOrder, badge: String(ordenesAbiertas) },
    { to: '/facturacion', label: 'Facturación', icon: IconInvoice },
    { to: '/clientes', label: 'Clientes', icon: IconCustomers },
    { to: '/inventario', label: 'Inventario', icon: IconInventory, badge: String(materialesBajoStock) },
    { to: '/catalogos', label: 'Catálogos', icon: IconCatalog },
    ...(user?.rol === 'admin'
      ? [
          { to: '/tecnicos', label: 'Técnicos', icon: IconWrench },
          { to: '/usuarios', label: 'Usuarios', icon: IconUser },
        ]
      : []),
  ]

  const itemClass = (extra = '') =>
    `relative flex items-center gap-2 whitespace-nowrap rounded-md border-l-[3px] border-transparent py-[9px] text-[13.5px] font-medium text-muted no-underline transition-colors ${
      expanded ? 'justify-start px-[10px]' : 'justify-center px-0'
    } ${extra}`.trim()

  return (
    <aside
      className={`no-print sticky top-0 z-10 flex h-[100svh] flex-shrink-0 flex-col overflow-hidden border-r border-line bg-surface px-2 py-6 transition-[width] duration-150 ${
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
