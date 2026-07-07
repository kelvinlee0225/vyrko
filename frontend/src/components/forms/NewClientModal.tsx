import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Modal } from '../Modal'
import { Button } from '../Button'
import { Field, fieldClass, FormError } from './fields'
import { useDataStore } from '../../store/dataStore'
import type { ClienteDirectorio } from '../../data/mockData'

const schema = z.object({
  nombre: z.string().min(2, 'Ingresa el nombre o razón social.'),
  tipo: z.enum(['Persona física', 'Persona jurídica']),
  cedulaRnc: z.string().min(9, 'Ingresa una cédula o RNC válida.'),
  telefono: z.string().min(7, 'Ingresa un teléfono válido.'),
  correo: z.union([z.string().email('Correo inválido.'), z.literal('')]),
  direccion: z.string().min(3, 'Ingresa una dirección.'),
})

export function NewClientModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const clientes = useDataStore((s) => s.clientes)
  const addCliente = useDataStore((s) => s.addCliente)

  const [nombre, setNombre] = useState('')
  const [tipo, setTipo] = useState<'Persona física' | 'Persona jurídica'>('Persona física')
  const [cedulaRnc, setCedulaRnc] = useState('')
  const [telefono, setTelefono] = useState('')
  const [correo, setCorreo] = useState('')
  const [direccion, setDireccion] = useState('')
  const [esAseguradora, setEsAseguradora] = useState(false)
  const [limiteCredito, setLimiteCredito] = useState('')
  const [diasCredito, setDiasCredito] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    const parsed = schema.safeParse({ nombre, tipo, cedulaRnc, telefono, correo, direccion })
    if (!parsed.success) {
      setError(parsed.error.issues[0].message)
      return
    }
    if (clientes.some((c) => c.cedulaRnc === cedulaRnc)) {
      setError('Ya existe un cliente con esa cédula/RNC.')
      return
    }

    const nuevo: ClienteDirectorio = {
      nombre,
      tipo,
      cedulaRnc,
      telefono,
      correo,
      esAseguradora,
      direccion,
      limiteCredito: limiteCredito ? parseFloat(limiteCredito) : null,
      diasCredito: diasCredito ? parseInt(diasCredito, 10) : null,
      vehiculos: [],
    }
    addCliente(nuevo)
    onClose()
    navigate(`/clientes/${nuevo.cedulaRnc}`)
  }

  return (
    <Modal title="Registrar cliente" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormError message={error} />

        <Field label="Nombre / Razón social">
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className={fieldClass} />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Tipo">
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as 'Persona física' | 'Persona jurídica')}
              className={fieldClass}
            >
              <option value="Persona física">Persona física</option>
              <option value="Persona jurídica">Persona jurídica</option>
            </select>
          </Field>
          <Field label="Cédula / RNC">
            <input type="text" value={cedulaRnc} onChange={(e) => setCedulaRnc(e.target.value)} className={fieldClass} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Teléfono">
            <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} className={fieldClass} />
          </Field>
          <Field label="Correo">
            <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} className={fieldClass} />
          </Field>
        </div>

        <Field label="Dirección">
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
          <Button type="submit" variant="primary">
            Registrar cliente
          </Button>
        </div>
      </form>
    </Modal>
  )
}
