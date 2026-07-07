import { Link, useParams } from 'react-router-dom'
import { PartyCard } from '../components/document/PartyCard'
import { StampBadge } from '../components/StampBadge'
import { Button } from '../components/Button'
import { IconCustomers, IconShield, IconCar } from '../components/icons'
import { calcularTotales } from '../data/mockData'
import { useDataStore } from '../store/dataStore'
import { formatCurrency, formatDate } from '../utils/format'

export function Client() {
  const { cedulaRnc } = useParams()
  const clientes = useDataStore((s) => s.clientes)
  const cotizaciones = useDataStore((s) => s.cotizaciones)
  const facturas = useDataStore((s) => s.facturas)
  const ordenesTrabajo = useDataStore((s) => s.ordenesTrabajo)
  const c = clientes.find((item) => item.cedulaRnc === cedulaRnc)

  if (!c) {
    return (
      <div className="flex flex-col gap-4">
        <Link to="/clientes" className="self-start text-[12.5px] font-medium text-muted no-underline hover:text-ink">
          ← Volver a clientes
        </Link>
        <p className="text-[13.5px] text-muted">No se encontró el cliente {cedulaRnc}.</p>
      </div>
    )
  }

  const iniciales = c.nombre
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const cotizacionesCliente = cotizaciones.filter((item) => item.cliente.cedulaRnc === c.cedulaRnc)
  const facturasCliente = facturas.filter((item) => item.cliente.cedulaRnc === c.cedulaRnc)
  const ordenesCliente = ordenesTrabajo.filter((item) => item.cliente.cedulaRnc === c.cedulaRnc)

  return (
    <div className="flex flex-col gap-6">
      <Link to="/clientes" className="self-start text-[12.5px] font-medium text-muted no-underline hover:text-ink">
        ← Volver a clientes
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-6 rounded-lg border border-line bg-surface p-6">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-brand font-display text-lg font-semibold text-inverse">
            {iniciales}
          </span>
          <div className="flex flex-col gap-1.5">
            <h1 className="text-xl">{c.nombre}</h1>
            <div className="flex flex-wrap gap-1">
              <span className="inline-flex w-fit rounded-full bg-surface-alt px-2 py-[2px] text-[10px] font-medium text-muted">
                {c.tipo}
              </span>
              {c.esAseguradora && (
                <span className="inline-flex w-fit rounded-full bg-surface-alt px-2 py-[2px] text-[10px] font-medium text-muted">
                  Aseguradora
                </span>
              )}
            </div>
            <span className="font-mono text-[12.5px] text-muted">{c.cedulaRnc}</span>
          </div>
        </div>
        <Button variant="secondary" disabled title="Próximamente">
          Editar
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 max-[720px]:grid-cols-1">
        <PartyCard
          title="Contacto"
          icon={<IconCustomers size={15} />}
          fields={[
            { label: 'Teléfono', value: c.telefono, mono: true },
            { label: 'Correo', value: c.correo },
            { label: 'Dirección', value: c.direccion },
          ]}
        />
        <PartyCard
          title="Términos de crédito"
          icon={<IconShield size={15} />}
          fields={[
            { label: 'Límite de crédito', value: c.limiteCredito ? formatCurrency(c.limiteCredito) : 'Sin límite establecido' },
            { label: 'Días de crédito', value: c.diasCredito ? `${c.diasCredito} días` : 'Contado' },
          ]}
        />
      </div>

      <div className="overflow-hidden rounded-lg border border-line bg-surface">
        <div className="border-b border-line px-6 py-4">
          <h2 className="text-[15px]">Vehículos</h2>
        </div>
        {c.vehiculos.length === 0 ? (
          <p className="px-6 py-8 text-center text-[13px] text-muted">
            {c.esAseguradora
              ? 'Este cliente es una aseguradora y no tiene vehículos propios registrados.'
              : 'No hay vehículos registrados para este cliente.'}
          </p>
        ) : (
          <div className="flex flex-col">
            {c.vehiculos.map((v) => (
              <div className="flex items-center gap-3 border-b border-line px-6 py-3 last:border-b-0" key={v.placa}>
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-surface-alt text-brand">
                  <IconCar size={16} />
                </span>
                <span className="font-mono text-[13px] font-medium text-ink">{v.placa}</span>
                <span className="text-[13px] text-muted">
                  {v.marca} {v.modelo} ({v.anio}) · {v.color}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 max-[900px]:grid-cols-1">
        <div className="overflow-hidden rounded-lg border border-line bg-surface">
          <div className="border-b border-line px-6 py-4">
            <h2 className="text-[15px]">Cotizaciones</h2>
          </div>
          {cotizacionesCliente.length === 0 ? (
            <p className="px-6 py-6 text-center text-[13px] text-muted">Sin cotizaciones registradas.</p>
          ) : (
            <div className="flex flex-col">
              {cotizacionesCliente.map((item) => {
                const { total } = calcularTotales(item.lineas, item.descuentoGlobal)
                return (
                  <Link
                    to={`/cotizaciones/${item.numero}`}
                    key={item.numero}
                    className="flex items-center gap-3 border-b border-line px-6 py-3 no-underline transition-colors last:border-b-0 hover:bg-surface-alt"
                  >
                    <span className="font-mono text-[12.5px] font-semibold tabular-nums text-ink">{item.numero}</span>
                    <span className="ml-auto font-mono text-[12.5px] tabular-nums text-muted">{formatCurrency(total)}</span>
                    <StampBadge estado={item.estado} />
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-lg border border-line bg-surface">
          <div className="border-b border-line px-6 py-4">
            <h2 className="text-[15px]">Facturas</h2>
          </div>
          {facturasCliente.length === 0 ? (
            <p className="px-6 py-6 text-center text-[13px] text-muted">Sin facturas registradas.</p>
          ) : (
            <div className="flex flex-col">
              {facturasCliente.map((item) => {
                const { total } = calcularTotales(item.lineas, item.descuentoGlobal)
                return (
                  <Link
                    to={`/facturacion/${item.numero}`}
                    key={item.numero}
                    className="flex items-center gap-3 border-b border-line px-6 py-3 no-underline transition-colors last:border-b-0 hover:bg-surface-alt"
                  >
                    <span className="font-mono text-[12.5px] font-semibold tabular-nums text-ink">{item.numero}</span>
                    <span className="ml-auto font-mono text-[12.5px] tabular-nums text-muted">{formatCurrency(total)}</span>
                    <StampBadge estado={item.estado} />
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-line bg-surface">
        <div className="border-b border-line px-6 py-4">
          <h2 className="text-[15px]">Órdenes de trabajo</h2>
        </div>
        {ordenesCliente.length === 0 ? (
          <p className="px-6 py-6 text-center text-[13px] text-muted">Sin órdenes de trabajo registradas.</p>
        ) : (
          <div className="flex flex-col">
            {ordenesCliente.map((item) => (
              <Link
                to={`/ordenes/${item.numero}`}
                key={item.numero}
                className="flex items-center gap-3 border-b border-line px-6 py-3 no-underline transition-colors last:border-b-0 hover:bg-surface-alt"
              >
                <span className="font-mono text-[12.5px] font-semibold tabular-nums text-ink">{item.numero}</span>
                <span className="text-[12.5px] text-muted">
                  {item.vehiculo.marca} {item.vehiculo.modelo}
                </span>
                <span className="ml-auto text-[12px] text-muted">{formatDate(item.fechaEntrada)}</span>
                <StampBadge estado={item.estado} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
