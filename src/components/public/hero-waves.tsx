"use client";

import { motion } from "framer-motion";

/**
 * Hoa tiet song lay cam hung tu "Nagare" (dong chay). SVG thuan + CSS animation,
 * khong anh huong SEO/LCP vi la lop trang tri o duoi noi dung, khong tai anh ngoai.
 */
export function HeroWaves() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <svg className="absolute -bottom-1 left-0 w-full h-40 md:h-56" viewBox="0 0 1440 200" preserveAspectRatio="none">
        <motion.path
          fill="var(--primary)"
          fillOpacity="0.06"
          initial={{ d: "M0,120 C320,180 720,60 1440,140 L1440,200 L0,200 Z" }}
          animate={{
            d: [
              "M0,120 C320,180 720,60 1440,140 L1440,200 L0,200 Z",
              "M0,140 C320,80 720,180 1440,100 L1440,200 L0,200 Z",
              "M0,120 C320,180 720,60 1440,140 L1440,200 L0,200 Z",
            ],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          fill="var(--brand)"
          fillOpacity="0.08"
          initial={{ d: "M0,150 C400,90 900,190 1440,120 L1440,200 L0,200 Z" }}
          animate={{
            d: [
              "M0,150 C400,90 900,190 1440,120 L1440,200 L0,200 Z",
              "M0,110 C400,170 900,80 1440,160 L1440,200 L0,200 Z",
              "M0,150 C400,90 900,190 1440,120 L1440,200 L0,200 Z",
            ],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </svg>
    </div>
  );
}
