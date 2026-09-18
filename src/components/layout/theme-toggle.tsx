"use client";

import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Nut doi sang/toi. Chi render icon sau khi mounted de tranh hydration mismatch
 * (server khong biet theme thuc te dang luu o localStorage).
 */
export function ThemeToggle() {
  const t = useTranslations("nav");
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-9 rounded-full"
      // Truoc khi mounted, resolvedTheme la undefined tren server -> neu doi nhan
      // ngay lap tuc se gay hydration mismatch. Giu nhan trung tinh den khi mounted.
      aria-label={mounted ? (isDark ? t("themeLight") : t("themeDark")) : t("themeDark")}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {/* Giu kich thuoc co dinh ngay ca khi chua mounted de khong gay layout shift. */}
      {mounted ? (
        isDark ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />
      ) : (
        <span className="size-4.5" />
      )}
    </Button>
  );
}
