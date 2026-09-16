import { getTranslations } from "next-intl/server";
import { getPublishedTours } from "@/lib/public-api";
import { TourCard } from "@/components/public/tour-card";
import { toApiLocale } from "@/lib/format";

export const revalidate = 600;

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
  const { items } = await getPublishedTours({ type, theme, lang: toApiLocale(locale) });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>
      {items.length === 0 ? (
        <p className="text-muted-foreground">{t("noResults")}</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((tour) => (
            <TourCard key={tour.id} tour={tour} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
