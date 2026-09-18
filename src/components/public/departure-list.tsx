"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTourDepartures, seatsAvailable } from "@/hooks/use-departures";
import { formatCurrency, formatDate } from "@/lib/format";

export function DepartureList({ tourId, locale }: { tourId: string; locale: string }) {
  const t = useTranslations("tourDetail");
  const { data, isLoading, isError } = useTourDepartures(tourId);
  const [showWakeupNotice, setShowWakeupNotice] = React.useState(false);

  React.useEffect(() => {
    if (!isLoading) {
      setShowWakeupNotice(false);
      return;
    }
    const timer = setTimeout(() => setShowWakeupNotice(true), 3000);
    return () => clearTimeout(timer);
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        {showWakeupNotice && (
          <p className="text-xs text-amber-600">{t("wakingUp")}</p>
        )}
      </div>
    );
  }

  if (isError || !data) {
    return <p className="text-sm text-muted-foreground">{t("loadingDepartures")}</p>;
  }

  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground">—</p>;
  }

  return (
    <ul className="space-y-3">
      {data.map((dep) => {
        const seats = dep.seatsAvailable ?? seatsAvailable(dep);
        const isFull = seats <= 0 || dep.status === "FULL" || dep.status === "CLOSED";
        return (
          <li key={dep.id} className="border rounded-md p-3">
            <p className="font-medium">{formatDate(dep.departDate, locale)}</p>
            <p className="text-sm text-muted-foreground">
              {isFull ? t("full") : t("seatsLeft", { n: seats })}
            </p>
            <p className="text-sm font-semibold text-primary">
              {formatCurrency(dep.priceAdult, dep.currency)}
            </p>
            {isFull ? (
              <Button size="sm" className="mt-2 w-full" disabled variant="secondary">
                {t("full")}
              </Button>
            ) : (
              <Button
                size="sm"
                className="mt-2 w-full"
                render={<Link href={`/booking/${dep.id}`} />}
              >
                {t("bookNow")}
              </Button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
