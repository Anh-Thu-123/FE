import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPublishedTours } from "@/lib/public-api";
import { TourCard } from "@/components/public/tour-card";
import { TourFilters } from "@/components/public/tour-filters";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { toApiLocale } from "@/lib/format";
import { Compass } from "lucide-react";

export const revalidate = 600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tours" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function ToursPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string; theme?: string }>;
}) {
  const { locale } = await params;
  const { type, theme } = await searchParams;
  const t = await getTranslations("tours");
  const tNav = await getTranslations("nav");
  const { items } = await getPublishedTours({ type, theme, lang: toApiLocale(locale) });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <header className="mb-8">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight md:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">{t("subtitle")}</p>
      </header>

      {/* Bo loc hien ro tren trang thay vi an trong query string (rule P8). */}
      <TourFilters activeType={type} activeTheme={theme} />

      <p className="mt-6 mb-6 text-sm text-muted-foreground" aria-live="polite">
        {t("resultCount", { count: items.length })}
      </p>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed px-6 py-16 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Compass className="size-6" aria-hidden />
          </div>
          <p className="mt-5 font-[family-name:var(--font-heading)] text-lg font-semibold">
            {t("noResults")}
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            {t("noResultsHint")}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button variant="outline" className="h-10 rounded-full" render={<Link href="/tours" />}>
              {t("clearFilters")}
            </Button>
            <Button className="h-10 rounded-full" render={<Link href="/tour-requests/new" />}>
              {tNav("customTour")}
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((tour, i) => (
            <TourCard key={tour.id} tour={tour} locale={locale} index={i} priority={i < 3} />
          ))}
        </div>
      )}
    </div>
  );
}
