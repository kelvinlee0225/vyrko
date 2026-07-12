import { useState } from 'react'
import { CatalogoSection } from '../../components/catalogos/CatalogoSection'
import { ServicioModal } from '../../components/catalogos/ServicioModal'
import { PiezaModal } from '../../components/catalogos/PiezaModal'
import { AseguradoraModal } from '../../components/catalogos/AseguradoraModal'
import { useApiList } from '../../hooks/useApiList'
import { servicioService, type Servicio } from '../../services/servicio'
import { piezaService, type Pieza } from '../../services/pieza'
import { aseguradoraService, type Aseguradora } from '../../services/aseguradora'
import { formatCurrency } from '../../utils/format'

const TABS = ['Servicios', 'Piezas', 'Aseguradoras'] as const
type Tab = (typeof TABS)[number]

export function Catalogos() {
  const [tab, setTab] = useState<Tab>('Servicios')

  const servicios = useApiList(servicioService.list)
  const piezas = useApiList(piezaService.list)
  const aseguradoras = useApiList(aseguradoraService.list)

  // undefined = modal cerrado; null = crear; objeto = editar.
  const [servicioModal, setServicioModal] = useState<Servicio | null | undefined>(undefined)
  const [piezaModal, setPiezaModal] = useState<Pieza | null | undefined>(undefined)
  const [aseguradoraModal, setAseguradoraModal] = useState<Aseguradora | null | undefined>(undefined)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl">Catálogos</h1>
        <p className="mt-1 text-[13.5px] text-muted">
          Administra los servicios, piezas y aseguradoras que se usan en cotizaciones y facturas.
        </p>
      </div>

      <div className="flex gap-1 border-b border-line">
        {TABS.map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setTab(t)}
            className={`cursor-pointer border-b-2 px-4 py-2.5 text-[13.5px] font-medium transition-colors ${
              tab === t
                ? 'border-brand font-semibold text-brand'
                : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Servicios' && (
        <CatalogoSection
          items={servicios.data}
          loading={servicios.loading}
          error={servicios.error}
          columns={[
            { header: 'Nombre', render: (s) => <span className="font-medium">{s.nombre}</span> },
            { header: 'Tipo de trabajo', render: (s) => <span className="text-muted">{s.tipoTrabajo}</span> },
            {
              header: 'Precio base',
              align: 'right',
              render: (s) => <span className="font-mono tabular-nums">{formatCurrency(parseFloat(s.precioBase))}</span>,
            },
            {
              header: 'ITBIS',
              render: (s) => (
                <span className="inline-flex rounded-full bg-surface-alt px-2 py-[2px] text-[11px] font-medium text-muted">
                  {s.llevaItbis ? '18%' : 'Exento'}
                </span>
              ),
            },
          ]}
          addLabel="Nuevo servicio"
          emptyMessage="No hay servicios registrados todavía."
          inUseMessage="No se puede eliminar el servicio porque está en uso en cotizaciones o facturas."
          confirmDeleteMessage={(s) => `¿Eliminar el servicio "${s.nombre}"?`}
          onDelete={(s) => servicioService.remove(s.id)}
          onReload={servicios.reload}
          onEdit={(s) => setServicioModal(s)}
          onAdd={() => setServicioModal(null)}
        />
      )}

      {tab === 'Piezas' && (
        <CatalogoSection
          items={piezas.data}
          loading={piezas.loading}
          error={piezas.error}
          columns={[{ header: 'Nombre', render: (p) => <span className="font-medium">{p.nombre}</span> }]}
          addLabel="Nueva pieza"
          emptyMessage="No hay piezas registradas todavía."
          inUseMessage="No se puede eliminar la pieza porque está en uso en cotizaciones o facturas."
          confirmDeleteMessage={(p) => `¿Eliminar la pieza "${p.nombre}"?`}
          onDelete={(p) => piezaService.remove(p.id)}
          onReload={piezas.reload}
          onEdit={(p) => setPiezaModal(p)}
          onAdd={() => setPiezaModal(null)}
        />
      )}

      {tab === 'Aseguradoras' && (
        <CatalogoSection
          items={aseguradoras.data}
          loading={aseguradoras.loading}
          error={aseguradoras.error}
          columns={[
            { header: 'Nombre', render: (a) => <span className="font-medium">{a.nombre}</span> },
            {
              header: 'RNC / Cédula',
              render: (a) => <span className="font-mono tabular-nums text-muted">{a.rncCedula ?? '—'}</span>,
            },
            {
              header: 'Teléfono',
              render: (a) => <span className="font-mono tabular-nums text-muted">{a.telefono ?? '—'}</span>,
            },
            { header: 'Correo', render: (a) => <span className="text-muted">{a.correo ?? '—'}</span> },
          ]}
          addLabel="Nueva aseguradora"
          emptyMessage="No hay aseguradoras registradas todavía."
          inUseMessage="No se puede eliminar la aseguradora porque tiene vehículos asociados."
          confirmDeleteMessage={(a) => `¿Eliminar la aseguradora "${a.nombre}"?`}
          onDelete={(a) => aseguradoraService.remove(a.id)}
          onReload={aseguradoras.reload}
          onEdit={(a) => setAseguradoraModal(a)}
          onAdd={() => setAseguradoraModal(null)}
        />
      )}

      {servicioModal !== undefined && (
        <ServicioModal
          servicio={servicioModal ?? undefined}
          onClose={() => setServicioModal(undefined)}
          onSaved={servicios.reload}
        />
      )}
      {piezaModal !== undefined && (
        <PiezaModal
          pieza={piezaModal ?? undefined}
          onClose={() => setPiezaModal(undefined)}
          onSaved={piezas.reload}
        />
      )}
      {aseguradoraModal !== undefined && (
        <AseguradoraModal
          aseguradora={aseguradoraModal ?? undefined}
          onClose={() => setAseguradoraModal(undefined)}
          onSaved={aseguradoras.reload}
        />
      )}
    </div>
  )
}
