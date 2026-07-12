import { useState, type SubmitEvent } from 'react'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '../ui/Button'
import { Field, fieldClass, FormError } from './fields'
import { SearchableSelect } from './SearchableSelect'
import { VehiculoPicker } from './VehiculoPicker'
import { LineItemsEditor } from './LineItemsEditor'
import type { LineaItemDraft } from './lineaItemDraft'
import { IconCustomers, IconCar, IconPlus } from '../ui/icons'
import { useApiList } from '../../hooks/useApiList'
import { clienteService } from '../../services/cliente'
import { vehiculoService } from '../../services/vehiculo'
import type { CreateCotizacionLineaDto } from '../../services/cotizacion'
import { calcularTotales } from '../../utils/totales'
import { formatCurrency } from '../../utils/format'

const schema = z.object({
  clienteId: z.string().min(1, 'Selecciona un cliente.'),
  vehiculoId: z.string().min(1, 'Selecciona un vehículo.'),
  fechaValidez: z.string().min(1, 'Selecciona la fecha de validez.'),
})

export interface QuoteFormValues {
  clienteId: string
  vehiculoId: string
  fechaValidez: string
  descuentoGlobal: string
  notas: string
  lineas: LineaItemDraft[]
}

export interface QuoteFormSubmitPayload {
  clienteId: string
  vehiculoId: string
  fechaValidez: string
  descuentoGlobal?: string
  notas?: string
  lineas: CreateCotizacionLineaDto[]
}

interface QuoteFormProps {
  heading: string
  description: string
  submitLabel: string
  submittingLabel: string
  initial: QuoteFormValues
  onCancel: () => void
  onSubmit: (payload: QuoteFormSubmitPayload) => Promise<void>
}

export function QuoteForm({ heading, description, submitLabel, submittingLabel, initial, onCancel, onSubmit }: QuoteFormProps) {
  const { data: clientes } = useApiList(clienteService.list)
  const { data: vehiculos, reload: reloadVehiculos } = useApiList(vehiculoService.list)

  const [clienteId, setClienteId] = useState(initial.clienteId)
  const [vehiculoId, setVehiculoId] = useState(initial.vehiculoId)
  const [fechaValidez, setFechaValidez] = useState(initial.fechaValidez)
  const [descuentoGlobal, setDescuentoGlobal] = useState(initial.descuentoGlobal)
  const [notas, setNotas] = useState(initial.notas)
  const [lineas, setLineas] = useState<LineaItemDraft[]>(initial.lineas)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const vehiculosCliente = vehiculos.filter((v) => v.cliente.id === clienteId)
  const totales = calcularTotales(lineas, descuentoGlobal)

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const parsed = schema.safeParse({ clienteId, vehiculoId, fechaValidez })
    if (!parsed.success) {
      setError(parsed.error.issues[0].message)
      return
    }
    if (lineas.some((l) => !l.servicioId)) {
      setError('Selecciona un servicio para cada línea.')
      return
    }

    setSubmitting(true)
    try {
      const lineasDto: CreateCotizacionLineaDto[] = lineas.map((l) => ({
        servicioId: l.servicioId,
        piezaId: l.piezaId ?? undefined,
        descripcion: l.descripcion,
        cantidad: String(l.cantidad),
        precioUnitario: String(l.precioUnitario),
        itbis: String(l.itbis),
        descuento: l.descuento ? String(l.descuento) : undefined,
      }))
      await onSubmit({
        clienteId,
        vehiculoId,
        fechaValidez,
        descuentoGlobal: descuentoGlobal || undefined,
        notas: notas || undefined,
        lineas: lineasDto,
      })
    } catch {
      setError('No se pudo guardar la cotización. Verifica los datos e intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Link to="/cotizaciones" className="self-start text-[12.5px] font-medium text-muted no-underline hover:text-ink">
        ← Volver a cotizaciones
      </Link>

      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl">{heading}</h1>
          <p className="mt-1 text-[13.5px] text-muted">{description}</p>
        </div>
        <div className="flex flex-shrink-0 gap-2">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" icon={<IconPlus size={16} />} disabled={submitting}>
            {submitting ? submittingLabel : submitLabel}
          </Button>
        </div>
      </div>

      <FormError message={error} />

      <div className="grid grid-cols-2 gap-4 max-[900px]:grid-cols-1">
        <div className="min-w-0 rounded-lg border border-line bg-surface p-6">
          <div className="mb-4 flex items-center gap-2 text-[13px] font-semibold text-ink">
            <span className="flex h-[26px] w-[26px] items-center justify-center rounded-sm bg-surface-alt text-brand">
              <IconCustomers size={15} />
            </span>
            Cliente
          </div>
          <div className="flex flex-col gap-3">
            <Field label="Cliente">
              <SearchableSelect
                value={clienteId}
                onChange={(value) => {
                  setClienteId(value)
                  setVehiculoId('')
                }}
                placeholder="Buscar cliente…"
                options={clientes.map((c) => ({
                  value: c.id,
                  label: c.nombreRazonSocial,
                  sublabel: c.cedulaRnc ?? undefined,
                }))}
              />
            </Field>
            <Field label="Válida hasta">
              <input
                type="date"
                value={fechaValidez}
                onChange={(e) => setFechaValidez(e.target.value)}
                className={fieldClass}
              />
            </Field>
          </div>
        </div>

        <div className="min-w-0 rounded-lg border border-line bg-surface p-6">
          <div className="mb-4 flex items-center gap-2 text-[13px] font-semibold text-ink">
            <span className="flex h-[26px] w-[26px] items-center justify-center rounded-sm bg-surface-alt text-brand">
              <IconCar size={16} />
            </span>
            Vehículo
          </div>
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
      </div>

      <div className="grid grid-cols-[2.2fr_1fr] items-start gap-6 max-[1100px]:grid-cols-1">
        <div className="min-w-0 rounded-lg border border-line bg-surface p-6">
          <p className="mb-3 text-[12.5px] font-medium text-muted">Líneas</p>
          <LineItemsEditor lineas={lineas} onChange={setLineas} />
        </div>

        <div className="flex min-w-0 flex-col gap-4 rounded-lg border border-line bg-surface p-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-[13px] text-ink">
              <span>Subtotal</span>
              <span className="font-mono tabular-nums">{formatCurrency(totales.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-[13px] text-ink">
              <span>ITBIS</span>
              <span className="font-mono tabular-nums">{formatCurrency(totales.itbis)}</span>
            </div>
            <Field label="Descuento global">
              <input
                type="number"
                min="0"
                step="0.01"
                value={descuentoGlobal}
                onChange={(e) => setDescuentoGlobal(e.target.value)}
                className={fieldClass}
              />
            </Field>
            <div className="mt-2 flex items-center justify-between border-t border-line pt-4 text-[17px] font-bold text-brand">
              <span>Total</span>
              <span className="font-mono tabular-nums">{formatCurrency(totales.total)}</span>
            </div>
          </div>

          <Field label="Notas (opcional)">
            <textarea value={notas} onChange={(e) => setNotas(e.target.value)} rows={3} className={`${fieldClass} resize-none`} />
          </Field>
        </div>
      </div>
    </form>
  )
}
