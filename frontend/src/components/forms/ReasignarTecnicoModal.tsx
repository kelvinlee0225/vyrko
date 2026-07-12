import { useState, type SubmitEvent } from 'react'
import { z } from 'zod'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Field, fieldClass, FormError } from './fields'
import { useApiList } from '../../hooks/useApiList'
import { tecnicoService } from '../../services/tecnico'
import { ordenTrabajoService } from '../../services/ordenTrabajo'

interface ReasignarTecnicoModalProps {
  ordenTrabajoId: string
  tecnicoActualId: string
  onClose: () => void
  onReasignado: () => void
}

const schema = z.object({
  tecnicoId: z.string().min(1, 'Selecciona un técnico.'),
})

export function ReasignarTecnicoModal({
  ordenTrabajoId,
  tecnicoActualId,
  onClose,
  onReasignado,
}: ReasignarTecnicoModalProps) {
  const { data: tecnicos } = useApiList(tecnicoService.list)

  const [tecnicoId, setTecnicoId] = useState('')
  const [notas, setNotas] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const opciones = tecnicos.filter((t) => t.activo && t.id !== tecnicoActualId)

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    e.stopPropagation()
    setError(null)

    const parsed = schema.safeParse({ tecnicoId })
    if (!parsed.success) {
      setError(parsed.error.issues[0].message)
      return
    }

    setSubmitting(true)
    try {
      await ordenTrabajoService.reasignarTecnico(ordenTrabajoId, {
        tecnicoId,
        notas: notas || undefined,
      })
      onReasignado()
      onClose()
    } catch {
      setError('No se pudo reasignar el técnico. Intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title="Reasignar técnico" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormError message={error} />

        <Field label="Nuevo técnico responsable">
          <select value={tecnicoId} onChange={(e) => setTecnicoId(e.target.value)} className={fieldClass}>
            <option value="">Selecciona un técnico…</option>
            {opciones.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre} — {t.especialidad}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Notas (opcional)">
          <input
            type="text"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder='p. ej. "pasó a pintura"'
            className={fieldClass}
          />
        </Field>

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Reasignando…' : 'Reasignar técnico'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
