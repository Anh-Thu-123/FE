import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getTourBySlug } from "@/lib/public-api";
import { bi } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { DepartureList } from "@/components/public/departure-list";

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

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex gap-2 mb-3">
        <Badge variant="secondary">{tour.type}</Badge>
        <Badge variant="outline">{tour.theme}</Badge>
      </div>
      <h1 className="text-3xl font-bold">{bi(tour.title, locale)}</h1>
      <p className="mt-3 text-muted-foreground">{bi(tour.summary, locale)}</p>

      <div className="grid md:grid-cols-3 gap-8 mt-8">
        <div className="md:col-span-2 space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">{t("itinerary")}</h2>
            <ol className="space-y-4">
              {tour.itinerary.map((day) => (
                <li key={day.day} className="border rounded-lg p-4">
                  <p className="font-semibold text-teal-700">
                    {t("day", { n: day.day })} — {bi(day.title, locale)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{bi(day.detail, locale)}</p>
                </li>
              ))}
              {tour.itinerary.length === 0 && (
                <p className="text-sm text-muted-foreground">—</p>
              )}
            </ol>
          </section>

          <div className="grid sm:grid-cols-2 gap-6">
            <section>
              <h2 className="text-lg font-semibold mb-2">{t("inclusions")}</h2>
              <ul className="list-disc list-inside text-sm space-y-1">
                {tour.inclusions.map((item, i) => (
                  <li key={i}>{bi(item, locale)}</li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">{t("exclusions")}</h2>
              <ul className="list-disc list-inside text-sm space-y-1">
                {tour.exclusions.map((item, i) => (
                  <li key={i}>{bi(item, locale)}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        <aside>
          <div className="border rounded-lg p-4 sticky top-20">
            <h2 className="font-semibold mb-3">{t("departures")}</h2>
            <DepartureList tourId={tour.id} locale={locale} />
          </div>
        </aside>
      </div>
    </div>
  );
}
