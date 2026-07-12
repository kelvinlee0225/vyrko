import { useState, type SubmitEvent } from 'react'
import { z } from 'zod'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Field, fieldClass, FormError } from './fields'
import { facturaService, type Factura } from '../../services/factura'
import { formatCurrency } from '../../utils/format'

interface RegistrarPagoModalProps {
  factura: Factura
  onClose: () => void
  onPagoRegistrado: () => void
}

const METODOS_PAGO = ['Efectivo', 'Tarjeta', 'Transferencia', 'Cheque']

const schema = z.object({
  monto: z.string().min(1, 'Ingresa el monto del pago.'),
})

export function RegistrarPagoModal({ factura, onClose, onPagoRegistrado }: RegistrarPagoModalProps) {
  const saldo = parseFloat(factura.saldoPendiente)
  const [monto, setMonto] = useState(factura.saldoPendiente)
  const [metodoPago, setMetodoPago] = useState(factura.metodoPago ?? 'Efectivo')
  const [fechaPago, setFechaPago] = useState(() => new Date().toISOString().slice(0, 10))
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    e.stopPropagation()
    setError(null)

    const parsed = schema.safeParse({ monto })
    if (!parsed.success) {
      setError(parsed.error.issues[0].message)
      return
    }
    const montoNum = parseFloat(monto)
    if (Number.isNaN(montoNum) || montoNum <= 0) {
      setError('El monto debe ser mayor a cero.')
      return
    }
    if (montoNum > saldo) {
      setError(`El monto excede el balance pendiente (${formatCurrency(saldo)}).`)
      return
    }

    setSubmitting(true)
    try {
      await facturaService.registrarPago(factura.id, { monto, metodoPago, fechaPago })
      onPagoRegistrado()
      onClose()
    } catch {
      setError('No se pudo registrar el pago. Intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title={`Registrar pago — ${factura.numero}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormError message={error} />

        <div className="flex items-center justify-between rounded-md bg-surface-alt px-4 py-3 text-[13px]">
          <span className="text-muted">Balance pendiente</span>
          <span className="font-mono font-semibold tabular-nums text-ink">{formatCurrency(saldo)}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Monto">
            <input
              type="number"
              min="0"
              step="0.01"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              className={fieldClass}
            />
          </Field>
          <Field label="Método de pago">
            <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)} className={fieldClass}>
              {METODOS_PAGO.map((metodo) => (
                <option key={metodo} value={metodo}>
                  {metodo}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Fecha del pago">
          <input type="date" value={fechaPago} onChange={(e) => setFechaPago(e.target.value)} className={fieldClass} />
        </Field>

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Registrando…' : 'Registrar pago'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
