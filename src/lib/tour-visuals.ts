import type { Tour } from "@/types";
import {
  Flower2,
  Music4,
  GraduationCap,
  Mountain,
  Trees,
  Compass,
  Landmark,
  type LucideIcon,
} from "lucide-react";

/**
 * Chua co anh that cho tung tour (chua tich hop upload), nen dung mot bo nhan dien
 * theo chu de: gradient + hoa van + icon - render bang CSS/SVG thuan, khong ton
 * bang thong hay phu thuoc dich vu anh ngoai (phu hop Vercel free tier).
 */
export const THEME_VISUALS: Record<
  Tour["theme"],
  { gradient: string; icon: LucideIcon; pattern: string }
> = {
  HEALING: {
    gradient: "from-rose-200 via-rose-100 to-amber-50",
    icon: Flower2,
    pattern: "radial-gradient(circle at 20% 20%, rgba(255,255,255,.6), transparent 40%)",
  },
  YOUTH: {
    gradient: "from-fuchsia-300 via-violet-200 to-indigo-100",
    icon: Music4,
    pattern: "radial-gradient(circle at 80% 10%, rgba(255,255,255,.5), transparent 45%)",
  },
  ACADEMIC: {
    gradient: "from-sky-200 via-blue-100 to-slate-50",
    icon: GraduationCap,
    pattern: "radial-gradient(circle at 15% 85%, rgba(255,255,255,.55), transparent 45%)",
  },
  CLASSIC: {
    gradient: "from-amber-200 via-orange-100 to-rose-50",
    icon: Landmark,
    pattern: "radial-gradient(circle at 85% 85%, rgba(255,255,255,.5), transparent 45%)",
  },
  NATURE: {
    gradient: "from-emerald-200 via-teal-100 to-cyan-50",
    icon: Trees,
    pattern: "radial-gradient(circle at 25% 75%, rgba(255,255,255,.55), transparent 45%)",
  },
  ADVENTURE: {
    gradient: "from-orange-300 via-amber-200 to-yellow-100",
    icon: Compass,
    pattern: "radial-gradient(circle at 75% 25%, rgba(255,255,255,.5), transparent 45%)",
  },
  HERITAGE: {
    gradient: "from-stone-300 via-amber-100 to-orange-50",
    icon: Mountain,
    pattern: "radial-gradient(circle at 50% 15%, rgba(255,255,255,.5), transparent 45%)",
  },
};

export function themeVisual(theme: Tour["theme"]) {
  return THEME_VISUALS[theme] ?? THEME_VISUALS.CLASSIC;
}
