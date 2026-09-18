"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Tren Vercel, console.error o runtime duoc gom vao Runtime Logs (goi mien phi).
    console.error(error);
  }, [error]);

  const t = useTranslations("error");

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-28 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="size-6" aria-hidden />
      </div>
      <h1 className="mt-6 font-[family-name:var(--font-heading)] text-2xl font-bold">
        {t("title")}
      </h1>
      <p className="mt-2 text-muted-foreground">{t("desc")}</p>
      {error.digest && (
        <p className="mt-3 font-mono text-xs text-muted-foreground/70">#{error.digest}</p>
      )}
      <Button className="mt-7 rounded-full" onClick={reset}>
        {t("retry")}
      </Button>
    </div>
  );
}
