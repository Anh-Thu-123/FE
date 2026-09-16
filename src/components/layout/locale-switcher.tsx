"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const other = locale === "vi" ? "ja" : "vi";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => router.replace(pathname, { locale: other })}
      aria-label="switch language"
    >
      {locale === "vi" ? "日本語" : "Tiếng Việt"}
    </Button>
  );
}
