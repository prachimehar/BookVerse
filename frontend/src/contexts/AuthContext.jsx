import { createContext, useEffect, useMemo, useState } from "react";
import { logoutSession } from "../services/api";

const AUTH_STORAGE_KEY = "bookverse-auth";

const initialAuth = {
  user: null,
  roles: [],
  accessToken: null,
  refreshToken: null,
  tokenType: "Bearer",
  isAuthenticated: false,
};

export const AuthContext = createContext({
  ...initialAuth,
  login: () => {},
  logout: () => {},
  hasRole: () => false,
  role: null,
});

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : initialAuth;
    } catch {
      return initialAuth;
    }
  });

  // persist auth
  useEffect(() => {
    if (authState.isAuthenticated) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [authState]);

  // ✅ LOGIN (FIXED)
  const login = (payload) => {
    const user = payload.user || payload;

    const roles = user.roles || payload.roles || ["ROLE_READER"];

    const normalizedRoles = roles.map((r) =>
      r.toUpperCase().startsWith("ROLE_")
        ? r.toUpperCase()
        : `ROLE_${r.toUpperCase()}`
    );

    setAuthState({
      user: {
        id: user.id || null,
        name: user.name || "BookVerse User",
        email: user.email || "",
        avatar:
          user.avatar ||
          "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80",
        roles: normalizedRoles,
      },

      roles: normalizedRoles,

      accessToken: payload.accessToken || null,
      refreshToken: payload.refreshToken || null,
      tokenType: payload.tokenType || "Bearer",

      isAuthenticated: true,
    });

    // ❌ IMPORTANT: DO NOT set axios headers here anymore
    // interceptor handles it
  };

  // role check
  const hasRole = (role) => {
    const normalized = `ROLE_${role.toUpperCase()}`;
    return authState.roles?.includes(normalized);
  };

  const role = useMemo(() => {
    if (authState.roles.includes("ROLE_ADMIN")) return "admin";
    if (authState.roles.includes("ROLE_WRITER")) return "writer";
    return "reader";
  }, [authState.roles]);

  const logout = () => {
    const refreshToken = authState.refreshToken;

    if (refreshToken) {
      logoutSession(refreshToken).catch(() => {});
    }

    localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthState(initialAuth);
  };

  const value = useMemo(
    () => ({
      ...authState,
      login,
      logout,
      hasRole,
      role,
    }),
    [authState]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}