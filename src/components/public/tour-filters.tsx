import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { cn } from "cn";
import { X } from "lucide-react";

const TYPES = ["OUTBOUND", "INBOUND", "DOMESTIC"] as const;
const THEMES = ["HEALING", "YOUTH", "ACADEMIC", "CLASSIC", "NATURE", "ADVENTURE", "HERITAGE"] as const;

/**
 * Bo loc dang chip, render phia server nen khong ton JS phia client.
 * Moi chip cao 40px va cach nhau 8px -> dat nguong cham (rule P2).
 */
export async function TourFilters({
  activeType,
  activeTheme,
}: {
  activeType?: string;
  activeTheme?: string;
}) {
  const t = await getTranslations("tours");
  const tType = await getTranslations("tourType");
  const tTheme = await getTranslations("tourTheme");
  const hasFilter = Boolean(activeType || activeTheme);

  return (
    <div className="space-y-4 rounded-2xl border bg-card/60 p-5">
      <FilterRow
        label={t("filterType")}
        allLabel={t("all")}
        allHref={{ pathname: "/tours", query: activeTheme ? { theme: activeTheme } : {} }}
        allActive={!activeType}
        options={TYPES.map((v) => ({
          value: v,
          label: tType(v),
          active: activeType === v,
          href: { pathname: "/tours", query: { type: v, ...(activeTheme ? { theme: activeTheme } : {}) } },
        }))}
        tone="primary"
      />

      <FilterRow
        label={t("filterTheme")}
        allLabel={t("all")}
        allHref={{ pathname: "/tours", query: activeType ? { type: activeType } : {} }}
        allActive={!activeTheme}
        options={THEMES.map((v) => ({
          value: v,
          label: tTheme(v),
          active: activeTheme === v,
          href: { pathname: "/tours", query: { theme: v, ...(activeType ? { type: activeType } : {}) } },
        }))}
        tone="accent"
      />

      {hasFilter && (
        <Link
          href="/tours"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          <X className="size-3.5" aria-hidden />
          {t("clearFilters")}
        </Link>
      )}
    </div>
  );
}

type Option = {
  value: string;
  label: string;
  active: boolean;
  href: { pathname: string; query: Record<string, string> };
};

function FilterRow({
  label,
  allLabel,
  allHref,
  allActive,
  options,
  tone,
}: {
  label: string;
  allLabel: string;
  allHref: { pathname: string; query: Record<string, string> };
  allActive: boolean;
  options: Option[];
  tone: "primary" | "accent";
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <span className="w-24 shrink-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        <Chip href={allHref} active={allActive} tone={tone} label={allLabel} />
        {options.map((o) => (
          <Chip key={o.value} href={o.href} active={o.active} tone={tone} label={o.label} />
        ))}
      </div>
    </div>
  );
}

function Chip({
  href,
  active,
  tone,
  label,
}: {
  href: { pathname: string; query: Record<string, string> };
  active: boolean;
  tone: "primary" | "accent";
  label: string;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={cn(
        "inline-flex min-h-10 items-center whitespace-nowrap rounded-full border px-4 text-sm transition-colors",
        active
          ? tone === "primary"
            ? "border-primary bg-primary text-primary-foreground"
            : "border-accent bg-accent text-accent-foreground"
          : "border-border text-foreground/80 hover:border-foreground/30 hover:bg-muted"
      )}
    >
      {label}
    </Link>
  );
}
