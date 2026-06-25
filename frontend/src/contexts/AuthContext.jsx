import { createContext, useEffect, useMemo, useState } from 'react'
import { logoutSession } from '../services/api'

const AUTH_STORAGE_KEY = 'bookverse-auth'
const USER_SCOPED_PREFIXES = [
  'bookverse-bookmarks',
  'bookverse-library',
  'bookverse-payments',
  'bookverse-profile',
  'bookverse-purchases',
  'bookverse-reader-progress',
  'bookverse-writer-dashboard',
  'bookverse-admin-dashboard',
]

const initialAuth = {
  user: null,
  roles: [],
  accessToken: null,
  refreshToken: null,
  tokenType: null,
  isAuthenticated: false,
}

export const AuthContext = createContext({
  ...initialAuth,
  login: () => {},
  hasRole: () => false,
  logout: () => {},
})

function clearUserScopedStorage() {
  for (const storage of [localStorage, sessionStorage]) {
    USER_SCOPED_PREFIXES.forEach((prefix) => {
      Object.keys(storage)
        .filter((key) => key === prefix || key.startsWith(`${prefix}:`))
        .forEach((key) => storage.removeItem(key))
    })
  }
}

function primaryRole(roles = []) {
  if (roles.includes('admin')) return 'admin'
  if (roles.includes('writer')) return 'writer'
  return roles[0] || null
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY)
      return stored ? JSON.parse(stored) : initialAuth
    } catch {
      return initialAuth
    }
  })

  useEffect(() => {
    if (authState.isAuthenticated) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState))
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }, [authState])

  const login = (payload) => {
    clearUserScopedStorage()
    const roles = payload.user?.roles || payload.roles || ['reader']

    setAuthState({
      user: {
        id: payload.user?.id || payload.id || null,
        name: payload.user?.name || payload.name || 'BookVerse Reader',
        email: payload.user?.email || payload.email || '',
        avatar:
          payload.user?.avatar ||
          payload.avatar ||
          'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80',
        roles,
      },

      roles,

      accessToken:
        payload.accessToken ||
        payload.token ||
        null,

      refreshToken:
        payload.refreshToken ||
        null,

      tokenType:
        payload.tokenType ||
        'Bearer',

      isAuthenticated: true,
    })
  }

  const hasRole = (role) => {
    return authState.roles?.some((value) => value.toLowerCase() === role.toLowerCase())
  }

  const logout = () => {
    const refreshToken = authState.refreshToken
    if (refreshToken) {
      logoutSession(refreshToken).catch(() => {})
    }
    clearUserScopedStorage()
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setAuthState(initialAuth)
  }

  const value = useMemo(
    () => ({
      ...authState,
      login,
      hasRole,
      role: primaryRole(authState.roles),
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
