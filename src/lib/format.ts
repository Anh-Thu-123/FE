import type { Bilingual, Locale } from "@/types";

export function bi(value: Bilingual | undefined, locale: string): string {
  if (!value) return "";
  if (locale === "ja") return value.ja || value.vi || "";
  return value.vi || value.ja || "";
}

export function formatCurrency(amount: number, currency: "VND" | "JPY") {
  return new Intl.NumberFormat(currency === "JPY" ? "ja-JP" : "vi-VN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date, locale: string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale === "ja" ? "ja-JP" : "vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export function toApiLocale(locale: string): Locale {
  return locale === "ja" ? "ja" : "vi";
}

/** Backend list endpoints sometimes return a bare array, sometimes a PageResult<T>. */
export function toArray<T>(data: T[] | { items: T[] } | undefined | null): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data.items ?? [];
}
