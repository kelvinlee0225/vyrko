import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { StatTiles } from '../components/StatTiles'
import { StampBadge } from '../components/StampBadge'
import { Button } from '../components/Button'
import { IconQuote, IconInvoice, IconCustomers, IconWorkOrder, IconPlus } from '../components/icons'
import { actividadReciente } from '../data/mockData'
import { useEstadisticasPanel } from '../store/dataStore'
import { useAuth } from '../context/useAuth'
import { NewWorkOrderModal } from '../components/forms/NewWorkOrderModal'
import { NewClientModal } from '../components/forms/NewClientModal'

const iconoPorTipo = {
  factura: IconInvoice,
  cotizacion: IconQuote,
  orden: IconWorkOrder,
}

type ModalKind = 'workorder' | 'client' | null

const accesos = [
  { label: 'Nueva cotización', icon: IconQuote, to: '/cotizaciones/nueva' },
  { label: 'Nueva factura', icon: IconInvoice, to: '/facturacion/nueva' },
  { label: 'Registrar cliente', icon: IconCustomers, modal: 'client' as const },
  { label: 'Nueva orden de trabajo', icon: IconWorkOrder, modal: 'workorder' as const },
]

export function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const estadisticasPanel = useEstadisticasPanel()
  const [openModal, setOpenModal] = useState<ModalKind>(null)

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl">Panel principal</h1>
          <p className="mt-1 text-[13.5px] text-muted">
            Bienvenido de vuelta, {user?.nombre.split(' ')[0]} — esto es lo que pasa hoy en el taller.
          </p>
        </div>
        <div className="flex flex-shrink-0 gap-2">
          <Button variant="secondary" icon={<IconQuote size={16} />} onClick={() => navigate('/cotizaciones/nueva')}>
            Nueva cotización
          </Button>
          <Button variant="primary" icon={<IconPlus />} onClick={() => navigate('/facturacion/nueva')}>
            Nueva factura
          </Button>
        </div>
      </div>

      <StatTiles items={estadisticasPanel} />

      <div className="grid grid-cols-[2fr_1fr] items-start gap-6 max-lg:grid-cols-1">
        <section className="overflow-hidden rounded-lg border border-line bg-surface">
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <h2 className="text-[15px]">Actividad reciente</h2>
            <Link to="/facturacion" className="text-[12.5px] font-semibold text-brand no-underline hover:underline">
              Ver todo
            </Link>
          </div>
          <div className="flex flex-col">
            {actividadReciente.map((item) => {
              const Icon = iconoPorTipo[item.tipo as keyof typeof iconoPorTipo]
              return (
                <div
                  className="flex items-center gap-4 border-b border-line px-6 py-4 last:border-b-0"
                  key={item.numero}
                >
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-surface-alt text-brand">
                    <Icon size={16} />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="font-mono text-[12.5px] font-semibold tabular-nums text-ink">{item.numero}</span>
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[12.5px] text-muted">
                      {item.descripcion}
                    </span>
                  </div>
                  <span className="flex-shrink-0 font-mono text-[13px] font-semibold tabular-nums text-ink">
                    {item.monto}
                  </span>
                  <StampBadge estado={item.estado} />
                  <span className="w-16 flex-shrink-0 text-right text-[11.5px] text-muted">{item.hora}</span>
                </div>
              )
            })}
          </div>
        </section>

        <section className="overflow-hidden rounded-lg border border-line bg-surface">
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <h2 className="text-[15px]">Accesos rápidos</h2>
          </div>
          <div className="flex flex-col p-2">
            {accesos.map((acceso) => {
              const Icon = acceso.icon
              const content = (
                <>
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-sm bg-surface-alt text-brand">
                    <Icon size={17} />
                  </span>
                  {acceso.label}
                </>
              )
              return acceso.to ? (
                <Link
                  to={acceso.to}
                  className="flex items-center gap-2 rounded-md px-4 py-2 text-[13px] font-medium text-ink no-underline hover:bg-surface-alt"
                  key={acceso.label}
                >
                  {content}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setOpenModal(acceso.modal ?? null)}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-left text-[13px] font-medium text-ink transition-colors hover:bg-surface-alt"
                  key={acceso.label}
                >
                  {content}
                </button>
              )
            })}
          </div>
        </section>
      </div>

      {openModal === 'workorder' && <NewWorkOrderModal onClose={() => setOpenModal(null)} />}
      {openModal === 'client' && <NewClientModal onClose={() => setOpenModal(null)} />}
    </div>
  )
}
