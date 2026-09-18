import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { getPublishedTours } from "@/lib/public-api";
import { TourCard } from "@/components/public/tour-card";
import { Reveal } from "@/components/public/reveal";
import { HeroWaves } from "@/components/public/hero-waves";
import { toApiLocale } from "@/lib/format";
import { ArrowRight } from "lucide-react";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("home");
  const tType = await getTranslations("tourType");
  const tTheme = await getTranslations("tourTheme");
  const { items } = await getPublishedTours({ lang: toApiLocale(locale), page: 1 });

  const themes = ["HEALING", "YOUTH", "ACADEMIC", "CLASSIC", "NATURE", "ADVENTURE", "HERITAGE"] as const;
  const types = ["OUTBOUND", "INBOUND", "DOMESTIC"] as const;

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/8 via-accent/5 to-background">
        <HeroWaves />
        <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-32 text-center">
          <Reveal>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-[family-name:var(--font-heading)] leading-[1.05]">
              {t("heroTitle")}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("heroSubtitle")}
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-9 flex justify-center gap-3 flex-wrap">
              <Button size="lg" className="rounded-full px-7" render={<Link href="/tours" />}>
                {t("browseTours")}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-7" render={<Link href="/tour-requests/new" />}>
                {t("requestCustom")}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <Reveal>
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-2xl font-semibold font-[family-name:var(--font-heading)]">{t("featuredTours")}</h2>
            <Link href="/tours" className="text-sm text-primary hover:underline flex items-center gap-1">
              {t("browseTours")} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 6).map((tour, i) => (
            <TourCard key={tour.id} tour={tour} locale={locale} index={i} />
          ))}
          {items.length === 0 && (
            <p className="text-muted-foreground col-span-full">
              Chưa có tour nào được xuất bản (hoặc backend chưa sẵn sàng).
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24">
        <Reveal>
          <h2 className="text-xl font-semibold font-[family-name:var(--font-heading)] mb-4">{t("byType")}</h2>
          <div className="flex flex-wrap gap-2 mb-10">
            {types.map((type) => (
              <Link
                key={type}
                href={{ pathname: "/tours", query: { type } }}
                className="rounded-full border px-4 py-1.5 text-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
              >
                {tType(type)}
              </Link>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-xl font-semibold font-[family-name:var(--font-heading)] mb-4">{t("byTheme")}</h2>
          <div className="flex flex-wrap gap-2">
            {themes.map((theme) => (
              <Link
                key={theme}
                href={{ pathname: "/tours", query: { theme } }}
                className="rounded-full border px-4 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors"
              >
                {tTheme(theme)}
              </Link>
            ))}
          </div>
        </Reveal>
      </section>
    </div>
  );
}
