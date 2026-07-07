import { api, rawApi } from './api'
import { useAuthStore, type CurrentUser } from '../store/authStore'
import { decodeJwt } from '../utils/jwt'

interface UsuarioResponse {
  id: string
  nombre: string
  username: string
  rol: { nombre: string }
}

async function fetchCurrentUser(accessToken: string): Promise<CurrentUser> {
  const payload = decodeJwt(accessToken)
  if (!payload) {
    throw new Error('Token invalido')
  }
  const { data } = await api.get<UsuarioResponse>(`/usuarios/${payload.sub}`)
  return { id: data.id, nombre: data.nombre, username: data.username, rol: data.rol.nombre }
}

export async function login(username: string, password: string) {
  const { data } = await api.post<{ accessToken: string }>('/auth/login', { username, password })
  useAuthStore.getState().setToken(data.accessToken)
  const user = await fetchCurrentUser(data.accessToken)
  useAuthStore.getState().setSession(data.accessToken, user)
}

export async function logout() {
  try {
    await rawApi.post('/auth/logout')
  } finally {
    useAuthStore.getState().clearSession()
  }
}

/** Called once on app mount — exchanges the httpOnly refresh cookie for a fresh access token. */
export async function bootstrapSession() {
  const store = useAuthStore.getState()
  try {
    const { data } = await rawApi.post<{ accessToken: string }>('/auth/refresh')
    store.setToken(data.accessToken)
    const user = await fetchCurrentUser(data.accessToken)
    store.setSession(data.accessToken, user)
  } catch {
    store.clearSession()
  } finally {
    store.setLoading(false)
  }
}
