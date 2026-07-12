import { useState, type SubmitEvent } from 'react'
import { z } from 'zod'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Field, fieldClass, FormError } from './fields'
import { SearchableSelect } from './SearchableSelect'
import { VehiculoPicker } from './VehiculoPicker'
import { useApiList } from '../../hooks/useApiList'
import { clienteService } from '../../services/cliente'
import { vehiculoService } from '../../services/vehiculo'
import { cotizacionService } from '../../services/cotizacion'
import { ordenTrabajoService, type OrdenTrabajo } from '../../services/ordenTrabajo'

interface EditWorkOrderModalProps {
  orden: OrdenTrabajo
  onClose: () => void
  onSaved: () => void
}

const schema = z.object({
  vehiculoId: z.string().min(1, 'Selecciona un vehículo.'),
  fechaEntrada: z.string().min(1, 'Selecciona la fecha de entrada.'),
})

export function EditWorkOrderModal({ orden, onClose, onSaved }: EditWorkOrderModalProps) {
  const { data: clientes } = useApiList(clienteService.list)
  const { data: vehiculos, reload: reloadVehiculos } = useApiList(vehiculoService.list)
  const { data: cotizaciones } = useApiList(cotizacionService.list)

  const [cotizacionId, setCotizacionId] = useState(orden.cotizacion?.id ?? '')
  const [clienteId, setClienteId] = useState(orden.vehiculo.cliente.id)
  const [vehiculoId, setVehiculoId] = useState(orden.vehiculo.id)
  const [fechaEntrada, setFechaEntrada] = useState(orden.fechaEntrada)
  const [fechaEntregaEstimada, setFechaEntregaEstimada] = useState(orden.fechaEntregaEstimada ?? '')
  const [descripcionTrabajo, setDescripcionTrabajo] = useState(orden.descripcionTrabajo ?? '')
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

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    e.stopPropagation()
    setError(null)

    const parsed = schema.safeParse({ vehiculoId, fechaEntrada })
    if (!parsed.success) {
      setError(parsed.error.issues[0].message)
      return
    }

    setSubmitting(true)
    try {
      await ordenTrabajoService.update(orden.id, {
        cotizacionId: cotizacionId || undefined,
        vehiculoId,
        fechaEntrada,
        fechaEntregaEstimada: fechaEntregaEstimada || undefined,
        descripcionTrabajo: descripcionTrabajo || undefined,
      })
      onSaved()
      onClose()
    } catch {
      setError('No se pudo guardar la orden de trabajo. Verifica los datos e intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title="Editar orden de trabajo" onClose={onClose} maxWidthClassName="max-w-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormError message={error} />

        <Field label="Cotización de origen (opcional)">
          <select value={cotizacionId} onChange={(e) => handleCotizacionChange(e.target.value)} className={fieldClass}>
            <option value="">Ninguna</option>
            {cotizaciones.map((c) => (
              <option key={c.id} value={c.id}>
                {c.numero} — {c.cliente.nombreRazonSocial}
              </option>
            ))}
          </select>
        </Field>

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

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Guardando…' : 'Guardar cambios'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
