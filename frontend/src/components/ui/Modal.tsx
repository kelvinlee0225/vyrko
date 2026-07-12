import { useEffect, type ReactNode } from 'react'
import { IconClose } from './icons'

interface ModalProps {
  title: string
  onClose: () => void
  children: ReactNode
  maxWidthClassName?: string
}

export function Modal({ title, onClose, children, maxWidthClassName = 'max-w-xl' }: ModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-[6vh]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className={`w-full ${maxWidthClassName} rounded-lg border border-line bg-surface shadow-lg`}>
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="text-[15px] font-semibold text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-alt hover:text-ink"
          >
            <IconClose />
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
