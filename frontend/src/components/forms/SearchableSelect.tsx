import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { fieldClass } from './fields'
import { IconChevronDown, IconSearch } from '../icons'

export interface SearchableSelectOption {
  value: string
  label: string
  sublabel?: string
}

interface SearchableSelectProps {
  options: SearchableSelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchableSelect({ options, value, onChange, placeholder = 'Buscar…' }: SearchableSelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [highlighted, setHighlighted] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const selected = options.find((o) => o.value === value)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter((o) => o.label.toLowerCase().includes(q))
  }, [options, query])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function selectOption(option: SearchableSelectOption) {
    onChange(option.value)
    setOpen(false)
    setQuery('')
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setHighlighted((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const option = filtered[highlighted]
      if (option) selectOption(option)
    } else if (e.key === 'Escape') {
      setOpen(false)
      setQuery('')
    }
  }

  return (
    <div className="relative min-w-0" ref={containerRef}>
      <div className={`${fieldClass} flex items-center gap-2`}>
        <span className="flex-shrink-0 text-muted">
          <IconSearch size={14} />
        </span>
        <input
          type="text"
          value={open ? query : (selected?.label ?? '')}
          onChange={(e) => {
            setQuery(e.target.value)
            setHighlighted(0)
            setOpen(true)
          }}
          onFocus={() => {
            setOpen(true)
            setQuery('')
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full min-w-0 border-none bg-transparent p-0 text-[13.5px] text-ink outline-none placeholder:text-muted"
        />
        <span className="flex-shrink-0 text-muted">
          <IconChevronDown size={12} />
        </span>
      </div>
      {open && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-56 overflow-y-auto rounded-md border border-line bg-surface py-1 shadow-lg">
          {filtered.length === 0 && <p className="px-3 py-2 text-[12.5px] text-muted">Sin resultados.</p>}
          {filtered.map((option, index) => (
            <button
              type="button"
              key={option.value}
              onClick={() => selectOption(option)}
              onMouseEnter={() => setHighlighted(index)}
              className={`flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left text-[13px] text-ink transition-colors ${
                index === highlighted ? 'bg-surface-alt' : ''
              } ${option.value === value ? 'font-semibold' : ''}`}
            >
              <span>{option.label}</span>
              {option.sublabel && <span className="text-[11px] font-normal text-muted">{option.sublabel}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
