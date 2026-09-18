"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import type { Tour } from "@/types";
import { bi, formatCurrency } from "@/lib/format";
import { TourCoverArt } from "@/components/public/tour-cover-art";

export function TourCard({ tour, locale, index = 0 }: { tour: Tour; locale: string; index?: number }) {
  const slug = bi(tour.slug, locale) || tour.slug.vi;
  const t = useTranslations("tours");
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index, 6) * 0.06, ease: "easeOut" }}
      whileHover={{ y: -6 }}
    >
      <Link href={`/tours/${slug}`}>
        <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 py-0 gap-0 h-full">
          <div className="aspect-[4/3] relative">
            {tour.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={tour.coverImage}
                alt={bi(tour.title, locale)}
                className="h-full w-full object-cover"
              />
            ) : (
              <TourCoverArt theme={tour.theme} className="h-full w-full" iconClassName="h-16 w-16" />
            )}
            <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text-[11px] font-mono font-semibold tracking-wide text-foreground/70 shadow-sm">
              {tour.code}
            </span>
          </div>
          <CardContent className="p-4 flex flex-col h-full">
            <div className="flex gap-2 mb-2">
              <Badge variant="secondary">{tour.type}</Badge>
              <Badge variant="outline">{tour.theme}</Badge>
            </div>
            <h3 className="font-semibold leading-snug line-clamp-2 font-[family-name:var(--font-heading)]">
              {bi(tour.title, locale)}
            </h3>
            <p className="text-sm text-muted-foreground mt-1.5 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {t("durationLabel", { days: tour.durationDays, nights: tour.durationNights })}
            </p>
            <p className="mt-auto pt-3 font-semibold text-lg text-primary">
              {formatCurrency(tour.basePriceAdult, tour.currency)}
            </p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
