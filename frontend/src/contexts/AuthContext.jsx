import { createContext, useEffect, useMemo, useState } from 'react'
import { ROLES } from '../constants/roles'

const initialAuth = {
  user: null,
  role: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
}

export const AuthContext = createContext({
  ...initialAuth,
  login: () => {},
  chooseRole: () => {},
  logout: () => {},
})

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => {
    try {
      const stored = localStorage.getItem('bookverse-auth')
      return stored ? JSON.parse(stored) : initialAuth
    } catch {
      return initialAuth
    }
  })

  useEffect(() => {
    localStorage.setItem('bookverse-auth', JSON.stringify(authState))
  }, [authState])

  const login = (payload) => {
    setAuthState({
      user: {
        id: payload.user?.id || payload.id || null,
        name: payload.user?.name || payload.name || 'BookVerse Reader',
        email: payload.user?.email || payload.email || '',
        avatar:
          payload.user?.avatar ||
          payload.avatar ||
          'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80',
      },

      role: payload.user?.role || payload.role || ROLES.READER,

      accessToken:
        payload.accessToken ||
        payload.token ||
        null,

      refreshToken:
        payload.refreshToken ||
        null,

      isAuthenticated: true,
    })
  }

  const chooseRole = (role) => {
    if (![ROLES.READER, ROLES.WRITER, ROLES.ADMIN].includes(role)) {
      return
    }

    setAuthState((current) => ({
      ...current,
      role,
    }))
  }

  const logout = () => {
    localStorage.removeItem('bookverse-auth')
    setAuthState(initialAuth)
  }

  const value = useMemo(
    () => ({
      ...authState,
      login,
      chooseRole,
      logout,
    }),
    [authState],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
