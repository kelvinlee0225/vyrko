import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { useAuth } from '../context/useAuth'

export function Layout() {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-canvas text-[13px] text-muted">Cargando…</div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return (
    <div className="flex min-h-[100svh] bg-canvas">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="w-full min-w-0 flex-1 p-[clamp(20px,3vw,48px)]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
