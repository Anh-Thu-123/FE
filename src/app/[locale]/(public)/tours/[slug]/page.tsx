import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getTourBySlug } from "@/lib/public-api";
import { bi } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { DepartureList } from "@/components/public/departure-list";
import { TourCoverArt } from "@/components/public/tour-cover-art";
import { Reveal } from "@/components/public/reveal";
import { CalendarDays } from "lucide-react";

export const revalidate = 600;
export const dynamicParams = true;

export async function generateStaticParams() {
  // Best-effort pre-render; falls back to on-demand ISR when the backend
  // isn't reachable at build time (dynamicParams: true above).
  return [];
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) notFound();

  const t = await getTranslations("tourDetail");
  const tType = await getTranslations("tourType");
  const tTheme = await getTranslations("tourTheme");
  // Tour dang soan (chua nhap du itinerary/inclusions/exclusions) co the co cac truong nay = null.
  const itinerary = tour.itinerary ?? [];
  const inclusions = tour.inclusions ?? [];
  const exclusions = tour.exclusions ?? [];

  return (
    <div>
      <div className="relative h-56 md:h-80 w-full">
        {tour.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={tour.coverImage} alt={bi(tour.title, locale)} className="h-full w-full object-cover" />
        ) : (
          <TourCoverArt theme={tour.theme} className="h-full w-full" iconClassName="h-24 w-24 md:h-32 md:w-32" />
        )}
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10">
        <Reveal>
          <div className="flex gap-2 mb-3">
            <Badge variant="secondary">{tType(tour.type)}</Badge>
            <Badge variant="outline">{tTheme(tour.theme)}</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-heading)]">{bi(tour.title, locale)}</h1>
          <p className="mt-3 text-muted-foreground max-w-3xl">{bi(tour.summary, locale)}</p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-8 mt-8">
          <div className="md:col-span-2 space-y-10">
            <Reveal delay={0.05}>
              <section>
                <h2 className="text-xl font-semibold font-[family-name:var(--font-heading)] mb-4">{t("itinerary")}</h2>
                <ol className="space-y-3">
                  {itinerary.map((day) => (
                    <li key={day.day} className="border rounded-xl p-4 hover:border-primary/40 transition-colors">
                      <p className="font-semibold text-primary flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        {t("day", { n: day.day })} — {bi(day.title, locale)}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1.5">{bi(day.detail, locale)}</p>
                    </li>
                  ))}
                  {itinerary.length === 0 && (
                    <p className="text-sm text-muted-foreground">—</p>
                  )}
                </ol>
              </section>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="grid sm:grid-cols-2 gap-6">
                <section>
                  <h2 className="text-lg font-semibold mb-2">{t("inclusions")}</h2>
                  <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                    {inclusions.map((item, i) => (
                      <li key={i}>{bi(item, locale)}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h2 className="text-lg font-semibold mb-2">{t("exclusions")}</h2>
                  <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                    {exclusions.map((item, i) => (
                      <li key={i}>{bi(item, locale)}</li>
                    ))}
                  </ul>
                </section>
              </div>
            </Reveal>
          </div>

          <aside>
            <Reveal delay={0.15}>
              <div className="border rounded-xl p-4 sticky top-20 bg-card">
                <h2 className="font-semibold mb-3">{t("departures")}</h2>
                <DepartureList tourId={tour.id} locale={locale} />
              </div>
            </Reveal>
          </aside>
        </div>
      </div>
    </div>
  );
}
