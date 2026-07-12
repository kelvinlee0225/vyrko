import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { IconPlus, IconSearch } from '../../components/ui/icons'
import { NewClientModal } from '../../components/forms/NewClientModal'
import { useApiList } from '../../hooks/useApiList'
import { clienteService } from '../../services/cliente'

const columns = 'grid-cols-[1fr_140px_140px_1fr]'

export function ClientList() {
  const { data: clientes, loading, error } = useApiList(clienteService.list)
  const [query, setQuery] = useState('')
  const [showNewModal, setShowNewModal] = useState(false)

  const resultados = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return clientes
    return clientes.filter((c) =>
      [c.nombreRazonSocial, c.cedulaRnc ?? '', c.telefono, c.correo ?? ''].some((field) =>
        field.toLowerCase().includes(q),
      ),
    )
  }, [query, clientes])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl">Clientes</h1>
          <p className="mt-1 text-[13.5px] text-muted">{clientes.length} clientes registrados.</p>
        </div>
        <Button variant="primary" icon={<IconPlus />} onClick={() => setShowNewModal(true)}>
          Registrar cliente
        </Button>
      </div>

      {showNewModal && <NewClientModal onClose={() => setShowNewModal(false)} />}

      <label className="flex w-full max-w-sm items-center gap-2 rounded-md border border-line bg-surface px-4 py-2 text-muted">
        <IconSearch size={16} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre, cédula/RNC o teléfono…"
          className="w-full border-none bg-transparent text-[13.5px] text-ink outline-none placeholder:text-muted"
        />
      </label>

      <div className="overflow-x-auto rounded-lg border border-line bg-surface">
        <div className={`grid ${columns} min-w-[700px] gap-4 border-b border-line bg-surface-alt px-6 py-2 text-[11px] font-semibold uppercase tracking-[0.04em] text-muted`}>
          <span>Nombre</span>
          <span>Cédula / RNC</span>
          <span>Teléfono</span>
          <span>Correo</span>
        </div>
        <div className="flex min-w-[700px] flex-col">
          {loading && <p className="px-6 py-8 text-center text-[13px] text-muted">Cargando clientes…</p>}
          {error && <p className="px-6 py-8 text-center text-[13px] text-error">{error}</p>}
          {!loading && !error && resultados.length === 0 && (
            <p className="px-6 py-8 text-center text-[13px] text-muted">No se encontraron clientes para "{query}".</p>
          )}
          {resultados.map((c) => (
            <Link
              to={`/clientes/${c.id}`}
              key={c.id}
              className={`grid ${columns} items-center gap-4 border-b border-line px-6 py-4 no-underline transition-colors last:border-b-0 hover:bg-surface-alt`}
            >
              <span className="flex min-w-0 flex-col gap-1">
                <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-medium text-ink">
                  {c.nombreRazonSocial}
                </span>
                <span className="flex gap-1">
                  <span className="inline-flex w-fit rounded-full bg-surface-alt px-2 py-[2px] text-[10px] font-medium text-muted">
                    {c.tipoCliente}
                  </span>
                  {c.esAseguradora && (
                    <span className="inline-flex w-fit rounded-full bg-surface-alt px-2 py-[2px] text-[10px] font-medium text-muted">
                      Aseguradora
                    </span>
                  )}
                </span>
              </span>
              <span className="overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[12.5px] text-muted">
                {c.cedulaRnc ?? '—'}
              </span>
              <span className="overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[12.5px] text-muted">
                {c.telefono}
              </span>
              <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[12.5px] text-muted">
                {c.correo ?? '—'}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
