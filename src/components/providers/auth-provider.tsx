"use client";

import * as React from "react";
import { useRouter } from "@/i18n/navigation";
import { api, setAccessToken, ApiClientError } from "@/lib/api-client";
import type { AuthUser } from "@/types";

interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

interface AuthContextValue {
  user: AuthUser | null;
  status: "loading" | "authenticated" | "unauthenticated";
  login: (username: string, password: string) => Promise<AuthUser>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

/**
 * Marks a lightweight, non-sensitive cookie so the Next.js middleware can do a
 * cheap UX-only gate on /admin routes. It carries no permissions - the backend
 * is the real authority on every request. Real access token stays in memory
 * (see src/lib/api-client.ts) and is never written here.
 */
function setSessionHintCookie(present: boolean) {
  if (present) {
    document.cookie = "nagare_session=1; path=/; max-age=1800; SameSite=Lax";
  } else {
    document.cookie = "nagare_session=; path=/; max-age=0";
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [status, setStatus] = React.useState<AuthContextValue["status"]>("loading");
  const router = useRouter();

  const refreshMe = React.useCallback(async () => {
    try {
      const me = await api.get<AuthUser>("/api/auth/me");
      setUser(me);
      setStatus("authenticated");
      setSessionHintCookie(true);
    } catch {
      setUser(null);
      setStatus("unauthenticated");
      setSessionHintCookie(false);
    }
  }, []);

  React.useEffect(() => {
    // On first load there's no access token in memory yet; try a silent
    // refresh against the httpOnly cookie before giving up.
    (async () => {
      try {
        const data = await api.post<{ accessToken: string }>("/api/auth/refresh", undefined, {
          skipAuth: true,
          skipRefresh: true,
        });
        setAccessToken(data.accessToken);
        await refreshMe();
      } catch {
        setStatus("unauthenticated");
      }
    })();
  }, [refreshMe]);

  const login = React.useCallback(
    async (username: string, password: string) => {
      const data = await api.post<LoginResponse>("/api/auth/login", { username, password }, {
        skipAuth: true,
      });
      setAccessToken(data.accessToken);
      setUser(data.user);
      setStatus("authenticated");
      setSessionHintCookie(true);
      return data.user;
    },
    []
  );

  const register = React.useCallback(async (username: string, password: string) => {
    await api.post("/api/auth/register", { username, password }, { skipAuth: true });
  }, []);

  const logout = React.useCallback(async () => {
    try {
      await api.post("/api/auth/logout");
    } catch {
      // best-effort
    }
    setAccessToken(null);
    setUser(null);
    setStatus("unauthenticated");
    setSessionHintCookie(false);
    router.push("/");
  }, [router]);

  const value: AuthContextValue = { user, status, login, register, logout, refreshMe };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { ApiClientError };
