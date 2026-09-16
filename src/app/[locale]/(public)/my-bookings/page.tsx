"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMyBookings } from "@/hooks/use-booking";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate } from "@/lib/format";

export default function MyBookingsPage() {
  const t = useTranslations("myBookings");
  const tStatus = useTranslations("bookingStatus");
  const params = useParams<{ locale: string }>();
  const locale = params.locale ?? "vi";
  const { data, isLoading } = useMyBookings();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>
      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      )}
      {!isLoading && (data ?? []).length === 0 && (
        <p className="text-muted-foreground">{t("empty")}</p>
      )}
      <div className="space-y-4">
        {(data ?? []).map((booking) => {
          const paid =
            booking.paidAmount ??
            booking.payments.reduce(
              (sum, p) => sum + (p.direction === "RECEIPT" ? p.amount : -p.amount),
              0
            );
          const balance = booking.balance ?? booking.pricing.total - paid;
          return (
            <Card key={booking.id}>
              <CardContent className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">
                    {t("code")}: {booking.code}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(booking.createdAt, locale)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge>{tStatus(booking.status)}</Badge>
                  <div className="text-sm text-right">
                    <p>
                      {t("total")}: {formatCurrency(booking.pricing.total, booking.pricing.currency)}
                    </p>
                    <p className="text-muted-foreground">
                      {t("balance")}: {formatCurrency(balance, booking.pricing.currency)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
