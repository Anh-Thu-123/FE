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
      className={cn("relative flex items-center justify-center overflow-hidden bg-gradient-to-br", gradient, className)}
      style={{ backgroundImage: pattern }}
    >
      <Icon className={cn("text-black/20", iconClassName)} strokeWidth={1.25} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
    </div>
  );
}
