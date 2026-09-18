"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Clock } from "lucide-react";
import type { Tour } from "@/types";
import { bi, formatCurrency } from "@/lib/format";
import { TourCoverArt } from "@/components/public/tour-cover-art";

export function TourCard({
  tour,
  locale,
  index = 0,
  priority = false,
}: {
  tour: Tour;
  locale: string;
  index?: number;
  /** Dat true cho vai the dau tien trong viewport de cai thien LCP. */
  priority?: boolean;
}) {
  const slug = bi(tour.slug, locale) || tour.slug.vi;
  const t = useTranslations("tours");
  const tType = useTranslations("tourType");
  const tTheme = useTranslations("tourTheme");
  const title = bi(tour.title, locale);
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.45,
        delay: reduceMotion ? 0 : Math.min(index, 6) * 0.06,
        ease: "easeOut",
      }}
      whileHover={reduceMotion ? undefined : { y: -6 }}
      className="h-full"
    >
      <Link
        href={`/tours/${slug}`}
        // P1: vong focus ro rang cho ca khoi the, khong chi rieng chu.
        className="group block h-full rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        <Card className="h-full gap-0 overflow-hidden py-0 transition-shadow duration-300 group-hover:ring-brand">
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            {tour.coverImage ? (
              <Image
                src={tour.coverImage}
                alt={title}
                fill
                // P3 Performance: bao truoc kich thuoc thuc te de Vercel tra ve
                // dung bien the WebP/AVIF, tranh tai anh 2000px cho o 380px.
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                priority={priority}
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
            ) : (
              <TourCoverArt theme={tour.theme} className="h-full w-full" iconClassName="h-16 w-16" />
            )}

            {/* Lop phu giup chu tren anh luon du tuong phan 4.5:1 (rule P1). */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/35 to-transparent"
              aria-hidden
            />
            <span className="surface-glass absolute top-3 left-3 rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold tracking-wide text-foreground shadow-sm">
              {tour.code}
            </span>
          </div>

          <CardContent className="flex h-full flex-col p-4">
            <div className="mb-2 flex flex-wrap gap-2">
              {/* Truoc day hien thi enum tho (OUTBOUND/HEALING) thay vi ban dich. */}
              <Badge variant="secondary">{tType(tour.type)}</Badge>
              <Badge variant="outline">{tTheme(tour.theme)}</Badge>
            </div>

            <h3 className="line-clamp-2 font-[family-name:var(--font-heading)] font-semibold leading-snug transition-colors group-hover:text-primary">
              {title}
            </h3>

            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="size-3.5" aria-hidden />
              {t("durationLabel", { days: tour.durationDays, nights: tour.durationNights })}
            </p>

            <div className="mt-auto flex items-end justify-between gap-2 pt-3">
              <p>
                <span className="block text-[11px] uppercase tracking-wide text-muted-foreground">
                  {t("fromPrice")}
                </span>
                <span className="text-lg font-semibold text-primary">
                  {formatCurrency(tour.basePriceAdult, tour.currency)}
                </span>
              </p>
              <span className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <ArrowUpRight className="size-4" aria-hidden />
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
