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
 * Sac do da duoc ha xuong bac 50-200: bang mau nen cua Nagare la giay am, nen
 * gradient bac 200-300 truoc day doc ra "keo ngot" thay vi thanh lich.
 *
 * Chua co anh that cho tung tour (chua tich hop upload), nen dung mot bo nhan dien
 * theo chu de: gradient + hoa van + icon - render bang CSS/SVG thuan, khong ton
 * bang thong hay phu thuoc dich vu anh ngoai (phu hop Vercel free tier).
 */
export const THEME_VISUALS: Record<
  Tour["theme"],
  { gradient: string; icon: LucideIcon; pattern: string }
> = {
  HEALING: {
    gradient: "from-rose-100 via-orange-50 to-amber-50",
    icon: Flower2,
    pattern: "radial-gradient(circle at 20% 20%, rgba(255,255,255,.6), transparent 40%)",
  },
  YOUTH: {
    gradient: "from-violet-100 via-indigo-50 to-slate-50",
    icon: Music4,
    pattern: "radial-gradient(circle at 80% 10%, rgba(255,255,255,.5), transparent 45%)",
  },
  ACADEMIC: {
    gradient: "from-sky-100 via-slate-50 to-stone-50",
    icon: GraduationCap,
    pattern: "radial-gradient(circle at 15% 85%, rgba(255,255,255,.55), transparent 45%)",
  },
  CLASSIC: {
    gradient: "from-amber-100 via-stone-100 to-orange-50",
    icon: Landmark,
    pattern: "radial-gradient(circle at 85% 85%, rgba(255,255,255,.5), transparent 45%)",
  },
  NATURE: {
    gradient: "from-emerald-100 via-teal-50 to-stone-50",
    icon: Trees,
    pattern: "radial-gradient(circle at 25% 75%, rgba(255,255,255,.55), transparent 45%)",
  },
  ADVENTURE: {
    gradient: "from-orange-200 via-amber-100 to-stone-50",
    icon: Compass,
    pattern: "radial-gradient(circle at 75% 25%, rgba(255,255,255,.5), transparent 45%)",
  },
  HERITAGE: {
    gradient: "from-stone-200 via-stone-100 to-amber-50",
    icon: Mountain,
    pattern: "radial-gradient(circle at 50% 15%, rgba(255,255,255,.5), transparent 45%)",
  },
};

export function themeVisual(theme: Tour["theme"]) {
  return THEME_VISUALS[theme] ?? THEME_VISUALS.CLASSIC;
}
