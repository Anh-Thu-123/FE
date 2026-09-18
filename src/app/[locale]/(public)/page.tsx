import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { getPublishedTours } from "@/lib/public-api";
import { TourCard } from "@/components/public/tour-card";
import { Reveal } from "@/components/public/reveal";
import { HeroWaves } from "@/components/public/hero-waves";
import { toApiLocale } from "@/lib/format";
import { ArrowRight, Compass, Sparkles } from "lucide-react";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("home");
  const tType = await getTranslations("tourType");
  const tTheme = await getTranslations("tourTheme");
  const tTours = await getTranslations("tours");
  const { items } = await getPublishedTours({ lang: toApiLocale(locale), page: 1 });

  const themes = ["HEALING", "YOUTH", "ACADEMIC", "CLASSIC", "NATURE", "ADVENTURE", "HERITAGE"] as const;
  const types = ["OUTBOUND", "INBOUND", "DOMESTIC"] as const;
  const featured = items.slice(0, 6);

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/8 via-accent/5 to-background">
        <HeroWaves />
        <div className="relative mx-auto max-w-6xl px-4 py-24 text-center md:py-32">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/12 px-4 py-1.5 text-xs font-medium tracking-wide text-accent-foreground dark:text-accent">
              <Sparkles className="size-3.5" aria-hidden />
              Kintsugi · Kyoto · Kanazawa
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            {/* text-balance (dat o globals) giu tieu de khong bi lech dong tren mobile. */}
            <h1 className="mt-6 font-[family-name:var(--font-heading)] text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
              {t("heroTitle")}
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {t("heroSubtitle")}
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button size="lg" className="h-11 rounded-full px-7" render={<Link href="/tours" />}>
                {t("browseTours")}
                <ArrowRight className="size-4" aria-hidden />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-11 rounded-full px-7"
                render={<Link href="/tour-requests/new" />}
              >
                {t("requestCustom")}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <Reveal>
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold md:text-3xl">
              {t("featuredTours")}
            </h2>
            <Link
              href="/tours"
              className="flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-sm text-primary hover:underline"
            >
              {t("browseTours")} <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>
        </Reveal>

        {featured.length === 0 ? (
          <div className="rounded-2xl border border-dashed px-6 py-16 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Compass className="size-6" aria-hidden />
            </div>
            <p className="mt-5 font-[family-name:var(--font-heading)] text-lg font-semibold">
              {tTours("noResults")}
            </p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              {tTours("noResultsHint")}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((tour, i) => (
              // 3 the dau la vung LCP -> tai anh voi do uu tien cao.
              <TourCard key={tour.id} tour={tour} locale={locale} index={i} priority={i < 3} />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24">
        <Reveal>
          <h2 className="mb-4 font-[family-name:var(--font-heading)] text-xl font-semibold">
            {t("byType")}
          </h2>
          <div className="mb-10 flex flex-wrap gap-2">
            {types.map((type) => (
              <Link
                key={type}
                href={{ pathname: "/tours", query: { type } }}
                className="inline-flex min-h-10 items-center rounded-full border px-4 text-sm transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
              >
                {tType(type)}
              </Link>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mb-4 font-[family-name:var(--font-heading)] text-xl font-semibold">
            {t("byTheme")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {themes.map((theme) => (
              <Link
                key={theme}
                href={{ pathname: "/tours", query: { theme } }}
                className="inline-flex min-h-10 items-center rounded-full border px-4 text-sm transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground"
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
