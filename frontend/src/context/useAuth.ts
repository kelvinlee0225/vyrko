import { useAuthStore } from '../store/authStore'
import { login, logout } from '../lib/auth'

export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const isLoading = useAuthStore((s) => s.isLoading)

  return {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    logout,
  }
}
