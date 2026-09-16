import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { getPublishedTours } from "@/lib/public-api";
import { TourCard } from "@/components/public/tour-card";
import { toApiLocale } from "@/lib/format";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("home");
  const { items } = await getPublishedTours({ lang: toApiLocale(locale), page: 1 });

  const themes = ["HEALING", "YOUTH", "ACADEMIC", "CLASSIC", "NATURE", "ADVENTURE", "HERITAGE"];
  const types = ["OUTBOUND", "INBOUND", "DOMESTIC"];

  return (
    <div>
      <section className="bg-gradient-to-b from-teal-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-teal-900">
            {t("heroTitle")}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("heroSubtitle")}
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button size="lg" render={<Link href="/tours" />}>
              {t("browseTours")}
            </Button>
            <Button size="lg" variant="outline" render={<Link href="/tour-requests/new" />}>
              {t("requestCustom")}
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-xl font-semibold mb-6">{t("featuredTours")}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 6).map((tour) => (
            <TourCard key={tour.id} tour={tour} locale={locale} />
          ))}
          {items.length === 0 && (
            <p className="text-muted-foreground col-span-full">
              Chưa có tour nào được xuất bản (hoặc backend chưa sẵn sàng).
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-xl font-semibold mb-4">{t("byType")}</h2>
        <div className="flex flex-wrap gap-2 mb-8">
          {types.map((type) => (
            <Link
              key={type}
              href={{ pathname: "/tours", query: { type } }}
              className="rounded-full border px-4 py-1.5 text-sm hover:bg-teal-50"
            >
              {type}
            </Link>
          ))}
        </div>
        <h2 className="text-xl font-semibold mb-4">{t("byTheme")}</h2>
        <div className="flex flex-wrap gap-2">
          {themes.map((theme) => (
            <Link
              key={theme}
              href={{ pathname: "/tours", query: { theme } }}
              className="rounded-full border px-4 py-1.5 text-sm hover:bg-teal-50"
            >
              {theme}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
