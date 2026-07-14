import { useState, type SubmitEvent } from 'react'
import axios from 'axios'
import { z } from 'zod'
import { Button } from '../../components/ui/Button'
import { Field, fieldClass, FormError } from '../../components/forms/fields'
import { useAuth } from '../../context/useAuth'
import { useAuthStore } from '../../store/authStore'
import { usuarioService } from '../../services/usuario'

const schema = z
  .object({
    nombre: z.string().min(2, 'Ingresa tu nombre.'),
    username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres.'),
    password: z.union([z.string().min(8, 'La nueva contraseña debe tener al menos 8 caracteres.'), z.literal('')]),
    currentPassword: z.string(),
  })
  .refine((data) => data.password === '' || data.currentPassword.length > 0, {
    message: 'Ingresa tu contraseña actual para cambiarla.',
    path: ['currentPassword'],
  })

function extractErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const message = (err.response?.data as { message?: string } | undefined)?.message
    if (typeof message === 'string') return message
  }
  return fallback
}

export function EditProfile() {
  const { user } = useAuth()
  const [nombre, setNombre] = useState(user?.nombre ?? '')
  const [username, setUsername] = useState(user?.username ?? '')
  const [password, setPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    e.stopPropagation()
    setError(null)
    setSuccess(false)

    const parsed = schema.safeParse({ nombre, username, password, currentPassword })
    if (!parsed.success) {
      setError(parsed.error.issues[0].message)
      return
    }

    setSubmitting(true)
    try {
      const updated = await usuarioService.updateMe({
        nombre,
        username,
        password: password || undefined,
        currentPassword: password ? currentPassword : undefined,
      })
      useAuthStore.getState().updateUser({ nombre: updated.nombre, username: updated.username })
      setPassword('')
      setCurrentPassword('')
      setSuccess(true)
    } catch (err) {
      setError(extractErrorMessage(err, 'No se pudo guardar el perfil. Intenta de nuevo.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl">Editar perfil</h1>
        <p className="mt-1 text-[13.5px] text-muted">Actualiza tu nombre, usuario y contraseña.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4 rounded-lg border border-line bg-surface p-6">
        <FormError message={error} />
        {success && (
          <p className="rounded-md bg-success-soft px-3 py-2 text-[12.5px] text-success">
            Perfil actualizado correctamente.
          </p>
        )}

        <Field label="Nombre">
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className={fieldClass} />
        </Field>

        <Field label="Usuario">
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className={fieldClass} />
        </Field>

        <div className="mt-2 border-t border-line pt-4">
          <p className="mb-3 text-[12.5px] font-semibold text-ink">Cambiar contraseña (opcional)</p>
          <div className="flex flex-col gap-4">
            <Field label="Nueva contraseña">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Dejar en blanco para no cambiarla"
                className={fieldClass}
              />
            </Field>
            {password && (
              <Field label="Contraseña actual">
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={fieldClass}
                />
              </Field>
            )}
          </div>
        </div>

        <div className="mt-2 flex justify-end">
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Guardando…' : 'Guardar cambios'}
          </Button>
        </div>
      </form>
    </div>
  )
}
