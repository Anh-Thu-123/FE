import { Link } from "@/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Tour } from "@/types";
import { bi, formatCurrency } from "@/lib/format";

export function TourCard({ tour, locale }: { tour: Tour; locale: string }) {
  const slug = bi(tour.slug, locale) || tour.slug.vi;
  return (
    <Link href={`/tours/${slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow py-0 gap-0">
        <div className="aspect-[4/3] bg-muted relative">
          {tour.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={tour.coverImage}
              alt={bi(tour.title, locale)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
              {tour.code}
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex gap-2 mb-2">
            <Badge variant="secondary">{tour.type}</Badge>
            <Badge variant="outline">{tour.theme}</Badge>
          </div>
          <h3 className="font-semibold line-clamp-2">{bi(tour.title, locale)}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {tour.durationDays} ngày {tour.durationNights} đêm
          </p>
          <p className="mt-2 font-semibold text-teal-700">
            {formatCurrency(tour.basePriceAdult, tour.currency)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
