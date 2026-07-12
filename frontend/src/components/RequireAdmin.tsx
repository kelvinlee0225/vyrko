import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  if (user?.rol !== 'admin') {
    return <Navigate to="/" replace />
  }
  return children
}
