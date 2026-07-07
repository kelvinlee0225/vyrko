import { useEffect, type ReactNode } from 'react'
import { bootstrapSession } from '../lib/auth'

/** Kicks off the silent-refresh session bootstrap once on mount; state itself lives in useAuthStore. */
export function AuthProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    bootstrapSession()
  }, [])

  return children
}
