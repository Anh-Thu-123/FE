/**
 * Thin fetch wrapper for the Spring Boot backend.
 *
 * Per muc 09 of the design doc:
 *  - Access token is kept in memory only (module-level variable below), never localStorage.
 *  - Refresh token is an httpOnly cookie set by the backend on the same root domain,
 *    so the browser sends it automatically with credentials: "include" - the frontend
 *    never reads or writes that cookie directly.
 *  - On a 401 we try /api/auth/refresh exactly once, then retry the original request.
 */
import type { ApiError } from "@/types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8080";

let accessToken: string | null = null;
let refreshPromise: Promise<boolean> | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export class ApiClientError extends Error {
  status: number;
  payload?: ApiError;
  constructor(status: number, payload?: ApiError) {
    super(payload?.message ?? `Request failed with status ${status}`);
    this.status = status;
    this.payload = payload;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  skipAuth?: boolean;
  /** Skip the automatic 401 -> refresh -> retry dance (used by /auth/refresh itself). */
  skipRefresh?: boolean;
}

async function doFetch(path: string, options: RequestOptions): Promise<Response> {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (!options.skipAuth && accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include", // send the httpOnly refresh cookie
    body:
      options.body instanceof FormData
        ? options.body
        : options.body !== undefined
          ? JSON.stringify(options.body)
          : undefined,
    cache: options.cache ?? "no-store",
  });
}

async function tryRefresh(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await doFetch("/api/auth/refresh", { method: "POST", skipRefresh: true });
        if (!res.ok) return false;
        const data = (await res.json()) as { accessToken: string };
        setAccessToken(data.accessToken);
        return true;
      } catch {
        return false;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  let res = await doFetch(path, options);

  if (res.status === 401 && !options.skipRefresh && !options.skipAuth) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      res = await doFetch(path, options);
    }
  }

  if (!res.ok) {
    let payload: ApiError | undefined;
    try {
      payload = await res.json();
    } catch {
      // no body
    }
    throw new ApiClientError(res.status, payload);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) => apiFetch<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiFetch<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiFetch<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiFetch<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: RequestOptions) => apiFetch<T>(path, { ...options, method: "DELETE" }),
};

/**
 * The backend on Render's free tier can be asleep. Wraps a promise and reports
 * "still waking up" if it takes longer than `warnAfterMs`.
 */
export function withWakeupWarning<T>(
  promise: Promise<T>,
  onSlow: () => void,
  warnAfterMs = 3000
): Promise<T> {
  const timer = setTimeout(onSlow, warnAfterMs);
  return promise.finally(() => clearTimeout(timer));
}
