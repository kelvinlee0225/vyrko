import { useState, type SubmitEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Field, fieldClass, FormError } from './fields'
import { clienteService } from '../../services/cliente'

const schema = z.object({
  nombreRazonSocial: z.string().min(2, 'Ingresa el nombre o razón social.'),
  tipoCliente: z.enum(['Persona física', 'Persona jurídica']),
  telefono: z.string().min(7, 'Ingresa un teléfono válido.'),
  correo: z.union([z.string().email('Correo inválido.'), z.literal('')]),
})

export function NewClientModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()

  const [nombreRazonSocial, setNombreRazonSocial] = useState('')
  const [tipoCliente, setTipoCliente] = useState<'Persona física' | 'Persona jurídica'>('Persona física')
  const [cedulaRnc, setCedulaRnc] = useState('')
  const [telefono, setTelefono] = useState('')
  const [correo, setCorreo] = useState('')
  const [direccion, setDireccion] = useState('')
  const [esAseguradora, setEsAseguradora] = useState(false)
  const [limiteCredito, setLimiteCredito] = useState('')
  const [diasCredito, setDiasCredito] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    e.stopPropagation()
    setError(null)

    const parsed = schema.safeParse({ nombreRazonSocial, tipoCliente, telefono, correo })
    if (!parsed.success) {
      setError(parsed.error.issues[0].message)
      return
    }

    setSubmitting(true)
    try {
      const nuevo = await clienteService.create({
        nombreRazonSocial,
        tipoCliente,
        esAseguradora,
        cedulaRnc: cedulaRnc || undefined,
        telefono,
        correo: correo || undefined,
        direccion: direccion || undefined,
        limiteCredito: limiteCredito || undefined,
        diasCredito: diasCredito ? parseInt(diasCredito, 10) : undefined,
      })
      onClose()
      navigate(`/clientes/${nuevo.id}`)
    } catch {
      setError('No se pudo registrar el cliente. Intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title="Registrar cliente" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormError message={error} />

        <Field label="Nombre / Razón social">
          <input
            type="text"
            value={nombreRazonSocial}
            onChange={(e) => setNombreRazonSocial(e.target.value)}
            className={fieldClass}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Tipo">
            <select
              value={tipoCliente}
              onChange={(e) => setTipoCliente(e.target.value as 'Persona física' | 'Persona jurídica')}
              className={fieldClass}
            >
              <option value="Persona física">Persona física</option>
              <option value="Persona jurídica">Persona jurídica</option>
            </select>
          </Field>
          <Field label="Cédula / RNC (opcional)">
            <input type="text" value={cedulaRnc} onChange={(e) => setCedulaRnc(e.target.value)} className={fieldClass} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Teléfono">
            <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} className={fieldClass} />
          </Field>
          <Field label="Correo (opcional)">
            <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} className={fieldClass} />
          </Field>
        </div>

        <Field label="Dirección (opcional)">
          <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} className={fieldClass} />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Límite de crédito (opcional)">
            <input
              type="number"
              min="0"
              value={limiteCredito}
              onChange={(e) => setLimiteCredito(e.target.value)}
              className={fieldClass}
            />
          </Field>
          <Field label="Días de crédito (opcional)">
            <input
              type="number"
              min="0"
              value={diasCredito}
              onChange={(e) => setDiasCredito(e.target.value)}
              className={fieldClass}
            />
          </Field>
        </div>

        <label className="flex items-center gap-2 text-[13px] text-ink">
          <input
            type="checkbox"
            checked={esAseguradora}
            onChange={(e) => setEsAseguradora(e.target.checked)}
            className="h-4 w-4 rounded border-line accent-brand"
          />
          Este cliente es una aseguradora
        </label>

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Registrando…' : 'Registrar cliente'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
