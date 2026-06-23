import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ROUTES } from '../constants/routes'

export function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return children
}
