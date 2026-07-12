import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PartyCard } from '../../components/document/PartyCard'
import { OrdenEstadoBadge } from '../../components/ui/StampBadge'
import { Button } from '../../components/ui/Button'
import { ReasignarTecnicoModal } from '../../components/forms/ReasignarTecnicoModal'
import { EditWorkOrderModal } from '../../components/forms/EditWorkOrderModal'
import { SearchableSelect } from '../../components/forms/SearchableSelect'
import { fieldClass } from '../../components/forms/fields'
import { IconCustomers, IconCar, IconWorkOrder, IconPlus, IconTrash, IconChevronDown } from '../../components/ui/icons'
import { useApiResource } from '../../hooks/useApiResource'
import { useApiList } from '../../hooks/useApiList'
import { materialService } from '../../services/material'
import {
  ordenTrabajoService,
  ESTADOS_ORDEN_TRABAJO,
  type EstadoOrdenTrabajo,
} from '../../services/ordenTrabajo'
import { formatDate } from '../../utils/format'

const estadoLabels: Record<EstadoOrdenTrabajo, string> = {
  pendiente: 'Pendiente',
  recibida: 'Recibida',
  en_progreso: 'En progreso',
  entregada_temporalmente: 'Entregada temporalmente',
  entregada: 'Entregada',
  cancelada: 'Cancelada',
}

// Mirrors the tones OrdenEstadoBadge/StampBadge use for each estado.
const estadoDotClass: Record<EstadoOrdenTrabajo, string> = {
  pendiente: 'bg-warning',
  recibida: 'bg-muted',
  en_progreso: 'bg-warning',
  entregada_temporalmente: 'bg-warning',
  entregada: 'bg-success',
  cancelada: 'bg-error',
}

interface EstadoMenuProps {
  estado: EstadoOrdenTrabajo
  disabled: boolean
  onSelect: (estado: EstadoOrdenTrabajo) => void
}

function EstadoMenu({ estado, disabled, onSelect }: EstadoMenuProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <Button variant="primary" disabled={disabled} onClick={() => setOpen((o) => !o)}>
        Cambiar estado
        <IconChevronDown size={12} />
      </Button>
      {open && (
        <div className="absolute right-0 top-full z-10 mt-2 w-60 rounded-md border border-line bg-surface py-1 shadow-lg">
          {ESTADOS_ORDEN_TRABAJO.map((opcion) => (
            <button
              type="button"
              key={opcion}
              onClick={() => {
                setOpen(false)
                onSelect(opcion)
              }}
              className={`flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left text-[13px] text-ink transition-colors hover:bg-surface-alt ${
                opcion === estado ? 'font-semibold' : ''
              }`}
            >
              <span className={`h-2 w-2 flex-shrink-0 rounded-full ${estadoDotClass[opcion]}`} aria-hidden="true" />
              {estadoLabels[opcion]}
              {opcion === estado && <span className="ml-auto text-[11px] font-normal text-muted">Actual</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function WorkOrder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: o, loading, error, reload } = useApiResource(() => ordenTrabajoService.get(id!), id)
  const { data: materiales } = useApiList(materialService.list)
  const [showReasignar, setShowReasignar] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [estadoError, setEstadoError] = useState<string | null>(null)
  const [updatingEstado, setUpdatingEstado] = useState(false)
  const [nuevoMaterialId, setNuevoMaterialId] = useState('')
  const [nuevaCantidad, setNuevaCantidad] = useState('')
  const [consumoError, setConsumoError] = useState<string | null>(null)
  const [savingConsumo, setSavingConsumo] = useState(false)

  async function handleEstadoChange(nuevoEstado: EstadoOrdenTrabajo) {
    if (!o || nuevoEstado === o.estado) return
    setEstadoError(null)
    setUpdatingEstado(true)
    try {
      await ordenTrabajoService.update(o.id, { estado: nuevoEstado })
      reload()
    } catch {
      setEstadoError('No se pudo actualizar el estado. Intenta de nuevo.')
    } finally {
      setUpdatingEstado(false)
    }
  }

  async function handleAgregarConsumo() {
    if (!o) return
    setConsumoError(null)
    if (!nuevoMaterialId || !nuevaCantidad || parseFloat(nuevaCantidad) <= 0) {
      setConsumoError('Selecciona un material y una cantidad mayor a cero.')
      return
    }
    setSavingConsumo(true)
    try {
      await ordenTrabajoService.addConsumo(o.id, { materialId: nuevoMaterialId, cantidadReal: nuevaCantidad })
      setNuevoMaterialId('')
      setNuevaCantidad('')
      reload()
    } catch {
      setConsumoError('No se pudo registrar el consumo. Verifica el stock disponible.')
    } finally {
      setSavingConsumo(false)
    }
  }

  async function handleEliminarConsumo(consumoId: string) {
    if (!o) return
    setConsumoError(null)
    setSavingConsumo(true)
    try {
      await ordenTrabajoService.removeConsumo(o.id, consumoId)
      reload()
    } catch {
      setConsumoError('No se pudo eliminar el consumo. Intenta de nuevo.')
    } finally {
      setSavingConsumo(false)
    }
  }

  if (loading) {
    return <p className="text-[13.5px] text-muted">Cargando orden de trabajo…</p>
  }

  if (error || !o) {
    return (
      <div className="flex flex-col gap-4">
        <Link to="/ordenes" className="self-start text-[12.5px] font-medium text-muted no-underline hover:text-ink">
          ← Volver a órdenes de trabajo
        </Link>
        <p className="text-[13.5px] text-muted">{error ?? `No se encontró la orden de trabajo ${id}.`}</p>
      </div>
    )
  }

  const asignaciones = [...o.asignaciones].sort((a, b) => b.asignadoEn.localeCompare(a.asignadoEn))

  return (
    <div className="flex flex-col gap-6">
      <Link to="/ordenes" className="self-start text-[12.5px] font-medium text-muted no-underline hover:text-ink">
        ← Volver a órdenes de trabajo
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-6 rounded-lg border border-line bg-surface p-6">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl">
              {o.vehiculo.marca} {o.vehiculo.modelo} — {o.vehiculo.placa}
            </h1>
            <OrdenEstadoBadge estado={o.estado} />
          </div>
          <span className="text-[12.5px] text-muted">Cliente: {o.vehiculo.cliente.nombreRazonSocial}</span>
        </div>
        <div className="flex flex-shrink-0 flex-wrap items-center gap-2">
          {o.cotizacion && (
            <Link
              to={`/cotizaciones/${o.cotizacion.id}`}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-md border border-line bg-surface px-4 py-2.5 text-[13.5px] font-semibold text-ink no-underline transition-colors hover:border-brand hover:text-brand"
            >
              Ver cotización {o.cotizacion.numero}
            </Link>
          )}
          <Button variant="ghost" onClick={() => setShowEdit(true)}>
            Editar
          </Button>
          <Button variant="secondary" onClick={() => setShowReasignar(true)}>
            Reasignar técnico
          </Button>
          <Button variant="success" onClick={() => navigate(`/facturacion/nueva?orden=${o.id}`)}>
            Facturar
          </Button>
          <EstadoMenu estado={o.estado} disabled={updatingEstado} onSelect={handleEstadoChange} />
        </div>
      </div>

      {estadoError && <p className="text-[12.5px] text-error">{estadoError}</p>}

      <div className="grid grid-cols-3 gap-4 max-[720px]:grid-cols-1">
        <div className="rounded-lg border border-line bg-surface p-6">
          <span className="text-[12.5px] text-muted">Entrada</span>
          <p className="mt-1 text-[15px] font-semibold text-ink">{formatDate(o.fechaEntrada)}</p>
        </div>
        <div className="rounded-lg border border-line bg-surface p-6">
          <span className="text-[12.5px] text-muted">Entrega estimada</span>
          <p className="mt-1 text-[15px] font-semibold text-ink">
            {o.fechaEntregaEstimada ? formatDate(o.fechaEntregaEstimada) : '—'}
          </p>
        </div>
        <div className="rounded-lg border border-line bg-surface p-6">
          <span className="text-[12.5px] text-muted">Entrega real</span>
          <p className="mt-1 text-[15px] font-semibold text-ink">
            {o.fechaEntregaReal ? formatDate(o.fechaEntregaReal) : '—'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 max-[1100px]:grid-cols-1">
        <PartyCard
          title="Cliente"
          icon={<IconCustomers size={15} />}
          fields={[
            { label: 'Nombre', value: o.vehiculo.cliente.nombreRazonSocial },
            {
              label: 'Tipo',
              value: o.vehiculo.cliente.esAseguradora
                ? `${o.vehiculo.cliente.tipoCliente} · Aseguradora`
                : o.vehiculo.cliente.tipoCliente,
            },
            { label: 'Teléfono', value: o.vehiculo.cliente.telefono, mono: true },
          ]}
        />
        <PartyCard
          title="Vehículo"
          icon={<IconCar size={16} />}
          fields={[
            { label: 'Marca / Modelo', value: `${o.vehiculo.marca} ${o.vehiculo.modelo} (${o.vehiculo.año})` },
            { label: 'Placa', value: o.vehiculo.placa, mono: true },
            { label: 'Color', value: o.vehiculo.color },
          ]}
        />
        <PartyCard
          title="Técnico actual"
          icon={<IconWorkOrder size={15} />}
          fields={[
            { label: 'Nombre', value: o.tecnico.nombre },
            { label: 'Especialidad', value: o.tecnico.especialidad },
          ]}
        />
      </div>

      <div className="rounded-lg border border-line bg-surface p-6">
        <h2 className="mb-2 text-[15px]">Descripción del trabajo</h2>
        <p className="text-[13px] leading-[1.5] text-muted">{o.descripcionTrabajo ?? 'Sin descripción registrada.'}</p>
      </div>

      <div className="grid grid-cols-2 items-start gap-6 max-[1100px]:grid-cols-1">
        {/* Sin overflow-hidden: recortaría el dropdown del buscador de materiales. */}
        <div className="rounded-lg border border-line bg-surface">
          <div className="border-b border-line px-6 py-4">
            <h2 className="text-[15px]">Materiales consumidos</h2>
          </div>
          {o.consumos.length === 0 ? (
            <p className="px-6 py-6 text-center text-[13px] text-muted">No se han registrado consumos de materiales.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border-b border-line bg-surface-alt px-6 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.04em] text-muted">
                    Material
                  </th>
                  <th className="border-b border-line bg-surface-alt px-6 py-2 text-right text-[11px] font-semibold uppercase tracking-[0.04em] text-muted">
                    Cantidad
                  </th>
                  <th className="w-12 border-b border-line bg-surface-alt px-2 py-2" aria-label="Acciones" />
                </tr>
              </thead>
              <tbody>
                {o.consumos.map((c) => (
                  <tr key={c.id}>
                    <td className="border-b border-line px-6 py-2.5 text-[13px] text-ink">{c.material.nombre}</td>
                    <td className="border-b border-line px-6 py-2.5 text-right font-mono text-[13px] tabular-nums text-ink">
                      {c.cantidadReal}
                    </td>
                    <td className="border-b border-line px-2 py-2.5 text-center">
                      <button
                        type="button"
                        disabled={savingConsumo}
                        onClick={() => handleEliminarConsumo(c.id)}
                        aria-label={`Eliminar consumo de ${c.material.nombre}`}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-error-soft hover:text-error disabled:opacity-50"
                      >
                        <IconTrash size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="flex flex-col gap-2 border-t border-line px-6 py-4">
            {consumoError && <p className="text-[12px] text-error">{consumoError}</p>}
            <div className="flex min-w-0 items-center gap-2">
              <div className="min-w-0 flex-1">
                <SearchableSelect
                  value={nuevoMaterialId}
                  onChange={setNuevoMaterialId}
                  placeholder="Buscar material…"
                  options={materiales.map((m) => ({
                    value: m.id,
                    label: m.nombre,
                    sublabel: `${m.codigo} · Stock: ${m.stockActual}`,
                  }))}
                />
              </div>
              <div className="w-20 flex-shrink-0">
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={nuevaCantidad}
                  onChange={(e) => setNuevaCantidad(e.target.value)}
                  placeholder="Cant."
                  className={fieldClass}
                />
              </div>
              <Button
                type="button"
                variant="secondary"
                icon={<IconPlus size={14} />}
                disabled={savingConsumo}
                onClick={handleAgregarConsumo}
              >
                Agregar
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-line bg-surface">
          <div className="border-b border-line px-6 py-4">
            <h2 className="text-[15px]">Historial de técnicos</h2>
          </div>
          {asignaciones.length === 0 ? (
            <p className="px-6 py-8 text-center text-[13px] text-muted">Sin asignaciones registradas.</p>
          ) : (
            <div className="flex flex-col">
              {asignaciones.map((a, index) => (
                <div key={a.id} className="flex items-start gap-3 border-b border-line px-6 py-3 last:border-b-0">
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-[13px] font-medium text-ink">
                      {a.tecnico.nombre}
                      {index === 0 && (
                        <span className="ml-2 rounded-full bg-surface-alt px-2 py-[2px] text-[10px] font-medium text-muted">
                          Actual
                        </span>
                      )}
                    </span>
                    {a.notas && <span className="text-[12px] text-muted">{a.notas}</span>}
                  </div>
                  <span className="flex-shrink-0 text-[11.5px] text-muted">
                    {formatDate(a.asignadoEn.slice(0, 10))}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showReasignar && (
        <ReasignarTecnicoModal
          ordenTrabajoId={o.id}
          tecnicoActualId={o.tecnico.id}
          onClose={() => setShowReasignar(false)}
          onReasignado={reload}
        />
      )}

      {showEdit && <EditWorkOrderModal orden={o} onClose={() => setShowEdit(false)} onSaved={reload} />}
    </div>
  )
}
