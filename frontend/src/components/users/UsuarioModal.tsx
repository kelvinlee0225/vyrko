import { useState, type SubmitEvent } from 'react'
import { z } from 'zod'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Field, fieldClass, FormError } from '../forms/fields'
import { useApiList } from '../../hooks/useApiList'
import { rolService } from '../../services/rol'
import { usuarioService, type Usuario } from '../../services/usuario'

interface UsuarioModalProps {
  usuario?: Usuario
  onClose: () => void
  onSaved: () => void
}

const schema = z.object({
  nombre: z.string().min(2, 'Ingresa el nombre.'),
  username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres.'),
  rolId: z.string().min(1, 'Selecciona un rol.'),
  password: z.union([z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.'), z.literal('')]),
})

export function UsuarioModal({ usuario, onClose, onSaved }: UsuarioModalProps) {
  const { data: roles } = useApiList(rolService.list)

  const [nombre, setNombre] = useState(usuario?.nombre ?? '')
  const [username, setUsername] = useState(usuario?.username ?? '')
  const [rolId, setRolId] = useState(usuario?.rol.id ?? '')
  const [password, setPassword] = useState('')
  const [activo, setActivo] = useState(usuario?.activo ?? true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    e.stopPropagation()
    setError(null)

    const parsed = schema.safeParse({ nombre, username, rolId, password })
    if (!parsed.success) {
      setError(parsed.error.issues[0].message)
      return
    }
    if (!usuario && !password) {
      setError('Ingresa una contraseña.')
      return
    }

    setSubmitting(true)
    try {
      if (usuario) {
        await usuarioService.update(usuario.id, {
          nombre,
          username,
          rolId,
          activo,
          password: password || undefined,
        })
      } else {
        await usuarioService.create({ nombre, username, rolId, password, activo })
      }
      onSaved()
      onClose()
    } catch {
      setError('No se pudo guardar el usuario. Intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title={usuario ? `Editar usuario — ${usuario.nombre}` : 'Nuevo usuario'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormError message={error} />

        <div className="grid grid-cols-2 gap-3">
          <Field label="Nombre">
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className={fieldClass} />
          </Field>
          <Field label="Usuario">
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className={fieldClass} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Rol">
            <select value={rolId} onChange={(e) => setRolId(e.target.value)} className={fieldClass}>
              <option value="">Selecciona un rol…</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nombre}
                </option>
              ))}
            </select>
          </Field>
          <Field label={usuario ? 'Nueva contraseña (opcional)' : 'Contraseña'}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={usuario ? 'Dejar en blanco para no cambiarla' : undefined}
              className={fieldClass}
            />
          </Field>
        </div>

        <label className="flex items-center gap-2 text-[13px] text-ink">
          <input type="checkbox" checked={activo} onChange={(e) => setActivo(e.target.checked)} />
          Usuario activo
        </label>

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Guardando…' : usuario ? 'Guardar cambios' : 'Crear usuario'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
