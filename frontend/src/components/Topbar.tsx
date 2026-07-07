import { useEffect, useRef, useState } from 'react'
import { ThemeToggle } from './ThemeToggle'
import { IconChevronDown } from './icons'
import { useAuth } from '../context/useAuth'

export function Topbar() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const iniciales = user?.nombre
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <header className="sticky top-0 z-[5] flex items-center justify-end gap-6 border-b border-line bg-canvas px-8 py-4">
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex cursor-pointer items-center gap-2 rounded-md border border-transparent py-1 pl-1 pr-2 text-muted transition-colors hover:border-line"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand font-display text-[12.5px] font-semibold text-inverse">
              {iniciales}
            </span>
            <span className="flex flex-col items-start leading-[1.2]">
              <span className="text-[13px] font-semibold text-ink">{user?.nombre}</span>
              <span className="text-[11.5px] text-muted">{user?.rol}</span>
            </span>
            <IconChevronDown />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full z-10 mt-2 w-44 rounded-md border border-line bg-surface py-1 shadow-lg">
              <button
                type="button"
                onClick={logout}
                className="w-full cursor-pointer px-3 py-2 text-left text-[13px] text-ink hover:bg-surface-alt"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
