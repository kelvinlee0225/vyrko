import { useState, type SubmitEvent } from 'react'
import { z } from 'zod'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Field, fieldClass, FormError } from '../forms/fields'
import { servicioService, type Servicio } from '../../services/servicio'

interface ServicioModalProps {
  servicio?: Servicio
  onClose: () => void
  onSaved: () => void
}

const schema = z.object({
  nombre: z.string().min(2, 'Ingresa el nombre del servicio.'),
  tipoTrabajo: z.string().min(2, 'Ingresa el tipo de trabajo.'),
  precioBase: z.string().min(1, 'Ingresa el precio base.'),
})

export function ServicioModal({ servicio, onClose, onSaved }: ServicioModalProps) {
  const [nombre, setNombre] = useState(servicio?.nombre ?? '')
  const [tipoTrabajo, setTipoTrabajo] = useState(servicio?.tipoTrabajo ?? '')
  const [precioBase, setPrecioBase] = useState(servicio?.precioBase ?? '')
  const [llevaItbis, setLlevaItbis] = useState(servicio?.llevaItbis ?? true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    e.stopPropagation()
    setError(null)

    const parsed = schema.safeParse({ nombre, tipoTrabajo, precioBase })
    if (!parsed.success) {
      setError(parsed.error.issues[0].message)
      return
    }

    setSubmitting(true)
    try {
      if (servicio) {
        await servicioService.update(servicio.id, { nombre, tipoTrabajo, precioBase, llevaItbis })
      } else {
        await servicioService.create({ nombre, tipoTrabajo, precioBase, llevaItbis })
      }
      onSaved()
      onClose()
    } catch {
      setError('No se pudo guardar el servicio. Intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title={servicio ? `Editar servicio — ${servicio.nombre}` : 'Nuevo servicio'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormError message={error} />

        <Field label="Nombre">
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className={fieldClass} />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Tipo de trabajo">
            <input
              type="text"
              value={tipoTrabajo}
              onChange={(e) => setTipoTrabajo(e.target.value)}
              className={fieldClass}
            />
          </Field>
          <Field label="Precio base">
            <input
              type="number"
              min="0"
              step="0.01"
              value={precioBase}
              onChange={(e) => setPrecioBase(e.target.value)}
              className={fieldClass}
            />
          </Field>
        </div>

        <label className="flex items-center gap-2 text-[13px] text-ink">
          <input
            type="checkbox"
            checked={llevaItbis}
            onChange={(e) => setLlevaItbis(e.target.checked)}
            className="h-4 w-4 rounded border-line accent-brand"
          />
          Este servicio lleva ITBIS (18%)
        </label>

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Guardando…' : servicio ? 'Guardar cambios' : 'Crear servicio'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
