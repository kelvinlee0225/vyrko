import { useState, type SubmitEvent } from 'react'
import { z } from 'zod'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Field, fieldClass, FormError } from '../forms/fields'
import { aseguradoraService, type Aseguradora } from '../../services/aseguradora'

interface AseguradoraModalProps {
  aseguradora?: Aseguradora
  onClose: () => void
  onSaved: () => void
}

const schema = z.object({
  nombre: z.string().min(2, 'Ingresa el nombre de la aseguradora.'),
  correo: z.union([z.string().email('Correo inválido.'), z.literal('')]),
})

export function AseguradoraModal({ aseguradora, onClose, onSaved }: AseguradoraModalProps) {
  const [nombre, setNombre] = useState(aseguradora?.nombre ?? '')
  const [rncCedula, setRncCedula] = useState(aseguradora?.rncCedula ?? '')
  const [telefono, setTelefono] = useState(aseguradora?.telefono ?? '')
  const [correo, setCorreo] = useState(aseguradora?.correo ?? '')
  const [direccion, setDireccion] = useState(aseguradora?.direccion ?? '')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    e.stopPropagation()
    setError(null)

    const parsed = schema.safeParse({ nombre, correo })
    if (!parsed.success) {
      setError(parsed.error.issues[0].message)
      return
    }

    setSubmitting(true)
    try {
      const dto = {
        nombre,
        rncCedula: rncCedula || undefined,
        telefono: telefono || undefined,
        correo: correo || undefined,
        direccion: direccion || undefined,
      }
      if (aseguradora) {
        await aseguradoraService.update(aseguradora.id, dto)
      } else {
        await aseguradoraService.create(dto)
      }
      onSaved()
      onClose()
    } catch {
      setError('No se pudo guardar la aseguradora. Intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      title={aseguradora ? `Editar aseguradora — ${aseguradora.nombre}` : 'Nueva aseguradora'}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormError message={error} />

        <div className="grid grid-cols-2 gap-3">
          <Field label="Nombre">
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className={fieldClass} />
          </Field>
          <Field label="RNC / Cédula (opcional)">
            <input type="text" value={rncCedula} onChange={(e) => setRncCedula(e.target.value)} className={fieldClass} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Teléfono (opcional)">
            <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} className={fieldClass} />
          </Field>
          <Field label="Correo (opcional)">
            <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} className={fieldClass} />
          </Field>
        </div>

        <Field label="Dirección (opcional)">
          <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} className={fieldClass} />
        </Field>

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Guardando…' : aseguradora ? 'Guardar cambios' : 'Crear aseguradora'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
