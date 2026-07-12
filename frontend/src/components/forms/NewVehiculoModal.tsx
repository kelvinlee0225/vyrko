import { useState, type SubmitEvent } from 'react'
import { z } from 'zod'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Field, fieldClass, FormError } from './fields'
import { useApiList } from '../../hooks/useApiList'
import { aseguradoraService } from '../../services/aseguradora'
import { vehiculoService, type Vehiculo } from '../../services/vehiculo'

interface NewVehiculoModalProps {
  clienteId: string
  onClose: () => void
  onCreated: (vehiculo: Vehiculo) => void
}

const schema = z.object({
  aseguradoraId: z.string().min(1, 'Selecciona una aseguradora.'),
  placa: z.string().min(2, 'Ingresa la placa.'),
  marca: z.string().min(1, 'Ingresa la marca.'),
  modelo: z.string().min(1, 'Ingresa el modelo.'),
  anio: z.string().min(4, 'Ingresa el año.'),
  color: z.string().min(1, 'Ingresa el color.'),
})

export function NewVehiculoModal({ clienteId, onClose, onCreated }: NewVehiculoModalProps) {
  const { data: aseguradoras } = useApiList(aseguradoraService.list)

  const [aseguradoraId, setAseguradoraId] = useState('')
  const [placa, setPlaca] = useState('')
  const [marca, setMarca] = useState('')
  const [modelo, setModelo] = useState('')
  const [anio, setAnio] = useState(String(new Date().getFullYear()))
  const [color, setColor] = useState('')
  const [vinChasis, setVinChasis] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    e.stopPropagation()
    setError(null)

    const parsed = schema.safeParse({ aseguradoraId, placa, marca, modelo, anio, color })
    if (!parsed.success) {
      setError(parsed.error.issues[0].message)
      return
    }

    setSubmitting(true)
    try {
      const nuevo = await vehiculoService.create({
        clienteId,
        aseguradoraId,
        placa,
        marca,
        modelo,
        año: parseInt(anio, 10),
        color,
        vinChasis: vinChasis || undefined,
      })
      onCreated(nuevo)
    } catch {
      setError('No se pudo registrar el vehículo. Verifica los datos e intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title="Registrar vehículo" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormError message={error} />

        <div className="grid grid-cols-2 gap-3">
          <Field label="Placa">
            <input type="text" value={placa} onChange={(e) => setPlaca(e.target.value)} className={fieldClass} />
          </Field>
          <Field label="Color">
            <input type="text" value={color} onChange={(e) => setColor(e.target.value)} className={fieldClass} />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Field label="Marca">
            <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} className={fieldClass} />
          </Field>
          <Field label="Modelo">
            <input type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} className={fieldClass} />
          </Field>
          <Field label="Año">
            <input type="number" value={anio} onChange={(e) => setAnio(e.target.value)} className={fieldClass} />
          </Field>
        </div>

        <Field label="Aseguradora">
          <select value={aseguradoraId} onChange={(e) => setAseguradoraId(e.target.value)} className={fieldClass}>
            <option value="">Selecciona una aseguradora…</option>
            {aseguradoras.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombre}
              </option>
            ))}
          </select>
          {aseguradoras.length === 0 && (
            <p className="mt-1.5 text-[11.5px] text-muted">
              No hay aseguradoras registradas todavía. Registra una aseguradora antes de continuar.
            </p>
          )}
        </Field>

        <Field label="VIN / Chasis (opcional)">
          <input type="text" value={vinChasis} onChange={(e) => setVinChasis(e.target.value)} className={fieldClass} />
        </Field>

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Registrando…' : 'Registrar vehículo'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
