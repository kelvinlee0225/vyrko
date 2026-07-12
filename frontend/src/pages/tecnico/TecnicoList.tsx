import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { IconPlus } from '../../components/ui/icons'
import { NewTecnicoModal } from '../../components/forms/NewTecnicoModal'
import { useApiList } from '../../hooks/useApiList'
import { tecnicoService } from '../../services/tecnico'

const columns = 'grid-cols-[1fr_1fr_120px]'

export function TecnicoList() {
  const { data: tecnicos, loading, error, reload } = useApiList(tecnicoService.list)
  const [showNewModal, setShowNewModal] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl">Técnicos</h1>
          <p className="mt-1 text-[13.5px] text-muted">{tecnicos.length} técnicos registrados.</p>
        </div>
        <Button variant="primary" icon={<IconPlus />} onClick={() => setShowNewModal(true)}>
          Registrar técnico
        </Button>
      </div>

      {showNewModal && <NewTecnicoModal onClose={() => setShowNewModal(false)} onCreated={reload} />}

      <div className="overflow-x-auto rounded-lg border border-line bg-surface">
        <div className={`grid ${columns} min-w-[560px] gap-4 border-b border-line bg-surface-alt px-6 py-2 text-[11px] font-semibold uppercase tracking-[0.04em] text-muted`}>
          <span>Nombre</span>
          <span>Especialidad</span>
          <span>Estado</span>
        </div>
        <div className="flex min-w-[560px] flex-col">
          {loading && <p className="px-6 py-8 text-center text-[13px] text-muted">Cargando técnicos…</p>}
          {error && <p className="px-6 py-8 text-center text-[13px] text-error">{error}</p>}
          {!loading && !error && tecnicos.length === 0 && (
            <p className="px-6 py-8 text-center text-[13px] text-muted">No hay técnicos registrados todavía.</p>
          )}
          {tecnicos.map((t) => (
            <div key={t.id} className={`grid ${columns} items-center gap-4 border-b border-line px-6 py-4 last:border-b-0`}>
              <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-medium text-ink">
                {t.nombre}
              </span>
              <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[12.5px] text-muted">
                {t.especialidad}
              </span>
              <span
                className={`inline-flex w-fit rounded-full px-2 py-[2px] text-[10px] font-medium ${
                  t.activo ? 'bg-surface-alt text-muted' : 'bg-error-soft text-error'
                }`}
              >
                {t.activo ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
