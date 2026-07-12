import { useState, type SubmitEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Field, fieldClass, FormError } from './fields'
import { SearchableSelect } from './SearchableSelect'
import { VehiculoPicker } from './VehiculoPicker'
import { IconPlus, IconTrash } from '../ui/icons'
import { useApiList } from '../../hooks/useApiList'
import { clienteService } from '../../services/cliente'
import { vehiculoService } from '../../services/vehiculo'
import { tecnicoService } from '../../services/tecnico'
import { cotizacionService } from '../../services/cotizacion'
import { materialService } from '../../services/material'
import { ordenTrabajoService, type CreateOrdenTrabajoConsumoDto } from '../../services/ordenTrabajo'

interface ConsumoDraft {
  materialId: string
  cantidadReal: string
}

const schema = z.object({
  vehiculoId: z.string().min(1, 'Selecciona un vehículo.'),
  tecnicoId: z.string().min(1, 'Selecciona un técnico.'),
  fechaEntrada: z.string().min(1, 'Selecciona la fecha de entrada.'),
})

export function NewWorkOrderModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const { data: clientes } = useApiList(clienteService.list)
  const { data: vehiculos, reload: reloadVehiculos } = useApiList(vehiculoService.list)
  const { data: tecnicos } = useApiList(tecnicoService.list)
  const { data: cotizaciones } = useApiList(cotizacionService.list)
  const { data: materiales } = useApiList(materialService.list)

  const [clienteId, setClienteId] = useState('')
  const [vehiculoId, setVehiculoId] = useState('')
  const [tecnicoId, setTecnicoId] = useState('')
  const [fechaEntrada, setFechaEntrada] = useState(() => new Date().toISOString().slice(0, 10))
  const [fechaEntregaEstimada, setFechaEntregaEstimada] = useState('')
  const [cotizacionId, setCotizacionId] = useState('')
  const [descripcionTrabajo, setDescripcionTrabajo] = useState('')
  const [consumos, setConsumos] = useState<ConsumoDraft[]>([])
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const vehiculosCliente = vehiculos.filter((v) => v.cliente.id === clienteId)

  function handleCotizacionChange(nuevaCotizacionId: string) {
    setCotizacionId(nuevaCotizacionId)
    const cotizacion = cotizaciones.find((c) => c.id === nuevaCotizacionId)
    if (cotizacion) {
      setClienteId(cotizacion.cliente.id)
      setVehiculoId(cotizacion.vehiculo.id)
    }
  }

  function updateConsumo(index: number, patch: Partial<ConsumoDraft>) {
    setConsumos(consumos.map((c, i) => (i === index ? { ...c, ...patch } : c)))
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    e.stopPropagation()
    setError(null)

    const parsed = schema.safeParse({ vehiculoId, tecnicoId, fechaEntrada })
    if (!parsed.success) {
      setError(parsed.error.issues[0].message)
      return
    }
    const consumosValidos = consumos.filter((c) => c.materialId && c.cantidadReal)
    if (consumos.some((c) => (c.materialId || c.cantidadReal) && (!c.materialId || !c.cantidadReal))) {
      setError('Completa material y cantidad en cada línea de consumo, o elimínala.')
      return
    }

    setSubmitting(true)
    try {
      const consumosDto: CreateOrdenTrabajoConsumoDto[] = consumosValidos.map((c) => ({
        materialId: c.materialId,
        cantidadReal: c.cantidadReal,
      }))
      const nueva = await ordenTrabajoService.create({
        cotizacionId: cotizacionId || undefined,
        vehiculoId,
        tecnicoId,
        fechaEntrada,
        fechaEntregaEstimada: fechaEntregaEstimada || undefined,
        descripcionTrabajo: descripcionTrabajo || undefined,
        consumos: consumosDto.length > 0 ? consumosDto : undefined,
      })
      onClose()
      navigate(`/ordenes/${nueva.id}`)
    } catch {
      setError('No se pudo crear la orden de trabajo. Verifica los datos e intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title="Nueva orden de trabajo" onClose={onClose} maxWidthClassName="max-w-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormError message={error} />

        <Field label="Cotización de origen (opcional)">
          <select value={cotizacionId} onChange={(e) => handleCotizacionChange(e.target.value)} className={fieldClass}>
            <option value="">Ninguna — crear orden desde cero</option>
            {cotizaciones.map((c) => (
              <option key={c.id} value={c.id}>
                {c.numero} — {c.cliente.nombreRazonSocial}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Cliente">
            <SearchableSelect
              value={clienteId}
              onChange={(value) => {
                setClienteId(value)
                setVehiculoId('')
              }}
              placeholder="Buscar cliente…"
              options={clientes.map((c) => ({ value: c.id, label: c.nombreRazonSocial, sublabel: c.cedulaRnc ?? undefined }))}
            />
          </Field>
          <Field label="Técnico asignado">
            <select value={tecnicoId} onChange={(e) => setTecnicoId(e.target.value)} className={fieldClass}>
              <option value="">Selecciona un técnico…</option>
              {tecnicos.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre} — {t.especialidad}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div>
          <p className="mb-2 text-[12.5px] font-medium text-muted">Vehículo</p>
          {clienteId ? (
            <VehiculoPicker
              vehiculos={vehiculosCliente}
              value={vehiculoId}
              onChange={setVehiculoId}
              clienteId={clienteId}
              onVehiculoCreated={reloadVehiculos}
            />
          ) : (
            <p className="text-[12.5px] text-muted">Selecciona un cliente primero.</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Entrada">
            <input type="date" value={fechaEntrada} onChange={(e) => setFechaEntrada(e.target.value)} className={fieldClass} />
          </Field>
          <Field label="Entrega estimada (opcional)">
            <input
              type="date"
              value={fechaEntregaEstimada}
              onChange={(e) => setFechaEntregaEstimada(e.target.value)}
              className={fieldClass}
            />
          </Field>
        </div>

        <Field label="Descripción del trabajo (opcional)">
          <textarea
            value={descripcionTrabajo}
            onChange={(e) => setDescripcionTrabajo(e.target.value)}
            rows={2}
            className={`${fieldClass} resize-none`}
          />
        </Field>

        <div>
          <p className="mb-2 text-[12.5px] font-medium text-muted">Materiales a consumir (opcional)</p>
          <div className="flex flex-col gap-2">
            {consumos.map((consumo, index) => (
              <div key={index} className="flex min-w-0 gap-2">
                <div className="min-w-0 flex-1">
                  <SearchableSelect
                    value={consumo.materialId}
                    onChange={(value) => updateConsumo(index, { materialId: value })}
                    placeholder="Buscar material…"
                    options={materiales.map((m) => ({
                      value: m.id,
                      label: m.nombre,
                      sublabel: `${m.codigo} · Stock: ${m.stockActual}`,
                    }))}
                  />
                </div>
                <div className="w-24 flex-shrink-0">
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={consumo.cantidadReal}
                    onChange={(e) => updateConsumo(index, { cantidadReal: e.target.value })}
                    placeholder="Cant."
                    className={fieldClass}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setConsumos(consumos.filter((_, i) => i !== index))}
                  aria-label="Eliminar material"
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md text-muted transition-colors hover:bg-error-soft hover:text-error"
                >
                  <IconTrash size={15} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setConsumos([...consumos, { materialId: '', cantidadReal: '' }])}
              className="flex items-center justify-center gap-2 rounded-md border border-dashed border-line py-2 text-[12.5px] font-medium text-muted transition-colors hover:border-brand hover:text-brand"
            >
              <IconPlus size={14} /> Agregar material
            </button>
          </div>
        </div>

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Creando…' : 'Crear orden de trabajo'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
