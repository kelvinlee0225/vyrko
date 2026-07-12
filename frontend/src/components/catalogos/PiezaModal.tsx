import { useState, type SubmitEvent } from 'react'
import { z } from 'zod'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Field, fieldClass, FormError } from '../forms/fields'
import { piezaService, type Pieza } from '../../services/pieza'

interface PiezaModalProps {
  pieza?: Pieza
  onClose: () => void
  onSaved: () => void
}

const schema = z.object({
  nombre: z.string().min(2, 'Ingresa el nombre de la pieza.'),
})

export function PiezaModal({ pieza, onClose, onSaved }: PiezaModalProps) {
  const [nombre, setNombre] = useState(pieza?.nombre ?? '')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    e.stopPropagation()
    setError(null)

    const parsed = schema.safeParse({ nombre })
    if (!parsed.success) {
      setError(parsed.error.issues[0].message)
      return
    }

    setSubmitting(true)
    try {
      if (pieza) {
        await piezaService.update(pieza.id, { nombre })
      } else {
        await piezaService.create({ nombre })
      }
      onSaved()
      onClose()
    } catch {
      setError('No se pudo guardar la pieza. Intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title={pieza ? `Editar pieza — ${pieza.nombre}` : 'Nueva pieza'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormError message={error} />

        <Field label="Nombre">
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className={fieldClass} />
        </Field>

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Guardando…' : pieza ? 'Guardar cambios' : 'Crear pieza'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
