import { themeVisual } from "@/lib/tour-visuals";
import type { Tour } from "@/types";
import { cn } from "@/lib/utils";

export function TourCoverArt({
  theme,
  className,
  iconClassName,
}: {
  theme: Tour["theme"];
  className?: string;
  iconClassName?: string;
}) {
  const { gradient, icon: Icon, pattern } = themeVisual(theme);
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br",
        gradient,
        className
      )}
    >
      {/*
        Truoc day `pattern` duoc gan bang style={{ backgroundImage }} ngay tren
        the nay. Ca gradient cua Tailwind lan pattern deu la background-image,
        nen inline style ghi de gradient -> moi chu de deu ra cung mot mau xam.
        Tach pattern thanh mot lop phu rieng thi ca hai cung hien thi.
      */}
      <div
        className="absolute inset-0"
        style={{ backgroundImage: pattern }}
        aria-hidden
      />
      <Icon className={cn("relative text-black/20", iconClassName)} strokeWidth={1.25} />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"
        aria-hidden
      />
    </div>
  );
}
