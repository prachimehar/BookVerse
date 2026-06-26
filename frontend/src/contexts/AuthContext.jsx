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
  hasRole: () => false,
  logout: () => {},
});

function normalizeRoles(roles = []) {
  return roles.map((r) => {
    const role = r.toLowerCase();

    if (role === "role_admin" || role === "admin") return "admin";
    if (role === "role_writer" || role === "writer") return "writer";
    if (role === "role_reader" || role === "reader") return "reader";

    return role;
  });
}

function primaryRole(roles = []) {
  if (roles.includes("admin")) return "admin";
  if (roles.includes("writer")) return "writer";
  return "reader";
}

function clearUserScopedStorage() {
  const prefixes = [
    "bookverse-bookmarks",
    "bookverse-library",
    "bookverse-payments",
    "bookverse-profile",
    "bookverse-purchases",
    "bookverse-reader-progress",
    "bookverse-writer-dashboard",
    "bookverse-admin-dashboard",
  ];

  for (const storage of [localStorage, sessionStorage]) {
    prefixes.forEach((prefix) => {
      Object.keys(storage)
        .filter((key) => key === prefix || key.startsWith(`${prefix}:`))
        .forEach((key) => storage.removeItem(key));
    });
  }
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : initialAuth;
    } catch {
      return initialAuth;
    }
  });

  useEffect(() => {
    if (authState.isAuthenticated) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [authState]);

  // ✅ LOGIN FIXED
  const login = (payload) => {
    clearUserScopedStorage();

    const rawRoles = payload.user?.roles || payload.roles || [];

    const roles = normalizeRoles(rawRoles);

    setAuthState({
      user: {
        id: payload.user?.id || payload.id,
        name: payload.user?.name || payload.name,
        email: payload.user?.email || payload.email,
        avatar:
          payload.user?.avatar ||
          payload.avatar ||
          "https://images.unsplash.com/photo-1544723795-3fb6469f5b39",
        roles,
      },

      roles,

      accessToken: payload.accessToken || payload.token || null,
      refreshToken: payload.refreshToken || null,
      tokenType: payload.tokenType || "Bearer",

      isAuthenticated: true,
    });
  };

  const hasRole = (role) => {
    return authState.roles?.includes(role.toLowerCase());
  };

  const logout = () => {
    const refreshToken = authState.refreshToken;

    if (refreshToken) {
      logoutSession(refreshToken).catch(() => {});
    }

    clearUserScopedStorage();
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthState(initialAuth);
  };

  const value = useMemo(
    () => ({
      ...authState,
      login,
      hasRole,
      role: primaryRole(authState.roles),
      logout,
    }),
    [authState]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}