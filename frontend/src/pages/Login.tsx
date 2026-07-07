import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '../components/Button'
import { useAuth } from '../context/useAuth'

const loginSchema = z.object({
  username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres.'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.'),
})

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    const parsed = loginSchema.safeParse({ username, password })
    if (!parsed.success) {
      setError(parsed.error.issues[0].message)
      return
    }

    setSubmitting(true)
    try {
      await login(username, password)
      const redirectTo = (location.state as { from?: string } | null)?.from ?? '/'
      navigate(redirectTo, { replace: true })
    } catch {
      setError('Usuario o contraseña incorrectos.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-[100svh] items-center justify-center bg-canvas px-4">
      <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-5 rounded-lg border border-line bg-surface p-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-md bg-brand font-display text-[15px] font-bold text-inverse">
            NY
          </span>
          <h1 className="text-xl">Taller Nang Yang</h1>
          <p className="text-[13px] text-muted">Inicia sesión para continuar</p>
        </div>

        {error && <p className="rounded-md bg-error-soft px-3 py-2 text-[12.5px] text-error">{error}</p>}

        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] font-medium text-muted">Usuario</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            className="rounded-md border border-line bg-canvas px-3 py-2 text-[13.5px] text-ink outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] font-medium text-muted">Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="rounded-md border border-line bg-canvas px-3 py-2 text-[13.5px] text-ink outline-none"
          />
        </label>

        <Button type="submit" variant="primary" disabled={submitting} className="w-full justify-center">
          {submitting ? 'Ingresando…' : 'Iniciar sesión'}
        </Button>
      </form>
    </div>
  )
}
