import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ROUTES } from '../constants/routes'

export function RoleProtectedRoute({ children, requiredRoles = [] }) {
  const { user, hasRole } = useAuth()

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  if (!requiredRoles.some((role) => hasRole(role))) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  return children
}
