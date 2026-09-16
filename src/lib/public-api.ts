/**
 * Server-side fetch helpers for the public marketing site.
 * These hit /api/public/* only (per muc 07 - the only endpoints Next.js is
 * allowed to call at build/render time without a token) and are cached with
 * revalidate: 600 as required for the catalog/detail pages. Live seat counts
 * are intentionally NOT here - see src/hooks/use-departures.ts for the
 * client-side, no-cache version used on the tour detail page.
 */
import { API_BASE_URL } from "@/lib/api-client";
import type { Tour, PageResult, Locale } from "@/types";

async function publicGet<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, { next: { revalidate: 600 } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    // Backend may not be reachable yet (e.g. during FE-only development).
    return null;
  }
}

export async function getPublishedTours(params: {
  type?: string;
  theme?: string;
  lang?: Locale;
  page?: number;
}) {
  const qs = new URLSearchParams();
  if (params.type) qs.set("type", params.type);
  if (params.theme) qs.set("theme", params.theme);
  if (params.lang) qs.set("lang", params.lang);
  qs.set("page", String(params.page ?? 1));

  const data = await publicGet<PageResult<Tour>>(`/api/public/tours?${qs.toString()}`);
  return data ?? { items: [], page: 1, pageSize: 12, total: 0 };
}

export async function getTourBySlug(slug: string) {
  return publicGet<Tour>(`/api/public/tours/${slug}`);
}
