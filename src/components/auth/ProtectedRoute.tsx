import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { DashboardSkeleton } from '../ui/Skeleton'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <DashboardSkeleton />
  }

  if (!user) {
    return <Navigate to="/logowanie" replace state={{ from: location.pathname }} />
  }

  return children
}
