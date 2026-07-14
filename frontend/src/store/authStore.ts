import { create } from 'zustand'

export interface CurrentUser {
  id: string
  nombre: string
  username: string
  rol: string
}

interface AuthState {
  accessToken: string | null
  user: CurrentUser | null
  isLoading: boolean
  setToken: (accessToken: string) => void
  setSession: (accessToken: string, user: CurrentUser) => void
  clearSession: () => void
  setLoading: (isLoading: boolean) => void
  updateUser: (partial: Partial<CurrentUser>) => void
}

/**
 * Deliberately not persisted (no zustand `persist` middleware, no localStorage/sessionStorage).
 * The access token lives only in this in-memory store — a page reload wipes it, and
 * AuthProvider re-establishes the session via the httpOnly refresh cookie instead.
 */
export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isLoading: true,
  setToken: (accessToken) => set({ accessToken }),
  setSession: (accessToken, user) => set({ accessToken, user }),
  clearSession: () => set({ accessToken: null, user: null }),
  setLoading: (isLoading) => set({ isLoading }),
  updateUser: (partial) => set((s) => ({ user: s.user ? { ...s.user, ...partial } : s.user })),
}))
