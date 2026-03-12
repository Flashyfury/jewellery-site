import { useAuth } from '../../context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'

export function AdminRoute() {
  const { user, isLoaded, isAdmin } = useAuth()

  if (!isLoaded) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    // If not admin, redirect to home
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
