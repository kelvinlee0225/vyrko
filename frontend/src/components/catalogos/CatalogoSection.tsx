import { useState, type ReactNode } from 'react'
import { Button } from '../ui/Button'
import { IconPlus, IconTrash } from '../ui/icons'

export interface CatalogoColumn<T> {
  header: string
  align?: 'left' | 'right'
  render: (item: T) => ReactNode
}

interface CatalogoSectionProps<T extends { id: string }> {
  items: T[]
  loading: boolean
  error: string | null
  columns: CatalogoColumn<T>[]
  addLabel: string
  emptyMessage: string
  inUseMessage: string
  onDelete: (item: T) => Promise<void>
  onReload: () => void
  onEdit: (item: T) => void
  onAdd: () => void
  confirmDeleteMessage: (item: T) => string
  canDelete?: (item: T) => boolean
}

export function CatalogoSection<T extends { id: string }>({
  items,
  loading,
  error,
  columns,
  addLabel,
  emptyMessage,
  inUseMessage,
  onDelete,
  onReload,
  onEdit,
  onAdd,
  confirmDeleteMessage,
  canDelete,
}: CatalogoSectionProps<T>) {
  const [actionError, setActionError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete(item: T) {
    if (!window.confirm(confirmDeleteMessage(item))) return
    setActionError(null)
    setDeleting(true)
    try {
      await onDelete(item)
      onReload()
    } catch {
      setActionError(inUseMessage)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {actionError && <p className="text-[12.5px] text-error">{actionError}</p>}
      <div className="flex justify-end">
        <Button variant="primary" icon={<IconPlus />} onClick={onAdd}>
          {addLabel}
        </Button>
      </div>
      <div className="rounded-lg border border-line bg-surface">
        <table className="w-full border-collapse [&>tbody>tr:last-child>td]:border-b-0">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.header}
                  className={`border-b border-line bg-surface-alt px-6 py-2 text-[11px] font-semibold uppercase tracking-[0.04em] text-muted ${
                    col.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  {col.header}
                </th>
              ))}
              <th className="w-24 border-b border-line bg-surface-alt px-2 py-2" aria-label="Acciones" />
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-[13px] text-muted">
                  Cargando…
                </td>
              </tr>
            )}
            {error && !loading && (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-[13px] text-error">
                  {error}
                </td>
              </tr>
            )}
            {!loading && !error && items.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-[13px] text-muted">
                  {emptyMessage}
                </td>
              </tr>
            )}
            {items.map((item) => (
              <tr key={item.id} className="transition-colors hover:bg-surface-alt">
                {columns.map((col) => (
                  <td
                    key={col.header}
                    className={`border-b border-line px-6 py-3 text-[13px] text-ink ${
                      col.align === 'right' ? 'text-right' : ''
                    }`}
                  >
                    {col.render(item)}
                  </td>
                ))}
                <td className="border-b border-line px-2 py-3">
                  <div className="flex items-center justify-end gap-1 pr-2">
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      className="cursor-pointer rounded-md px-2 py-1 text-[12px] font-medium text-muted transition-colors hover:bg-surface-alt hover:text-brand"
                    >
                      Editar
                    </button>
                    {(!canDelete || canDelete(item)) && (
                      <button
                        type="button"
                        disabled={deleting}
                        onClick={() => handleDelete(item)}
                        aria-label="Eliminar"
                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-muted transition-colors hover:bg-error-soft hover:text-error disabled:opacity-50"
                      >
                        <IconTrash size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
