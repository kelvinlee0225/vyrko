import { useState, type SubmitEvent } from 'react'
import { z } from 'zod'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Field, fieldClass, FormError } from './fields'
import { tecnicoService } from '../../services/tecnico'

interface NewTecnicoModalProps {
  onClose: () => void
  onCreated: () => void
}

const schema = z.object({
  nombre: z.string().min(2, 'Ingresa el nombre del técnico.'),
  especialidad: z.string().min(2, 'Ingresa la especialidad.'),
})

export function NewTecnicoModal({ onClose, onCreated }: NewTecnicoModalProps) {
  const [nombre, setNombre] = useState('')
  const [especialidad, setEspecialidad] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    e.stopPropagation()
    setError(null)

    const parsed = schema.safeParse({ nombre, especialidad })
    if (!parsed.success) {
      setError(parsed.error.issues[0].message)
      return
    }

    setSubmitting(true)
    try {
      await tecnicoService.create({ nombre, especialidad })
      onCreated()
      onClose()
    } catch {
      setError('No se pudo registrar el técnico. Intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title="Registrar técnico" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormError message={error} />

        <Field label="Nombre">
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className={fieldClass} />
        </Field>

        <Field label="Especialidad">
          <input
            type="text"
            value={especialidad}
            onChange={(e) => setEspecialidad(e.target.value)}
            className={fieldClass}
          />
        </Field>

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Registrando…' : 'Registrar técnico'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
