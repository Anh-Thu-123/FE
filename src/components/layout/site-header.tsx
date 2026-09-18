"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";

export function SiteHeader() {
  const t = useTranslations("nav");
  const { user, status, logout } = useAuth();
  const pathname = usePathname();

  return (
    <header className="border-b bg-background/80 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto max-w-6xl flex items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="font-bold text-lg tracking-tight text-primary font-[family-name:var(--font-heading)]">
          Nagare Travel
        </Link>
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
          <Link href="/about" className={pathname === "/about" ? "text-primary" : "text-foreground/80 hover:text-primary transition-colors"}>
            {t("about")}
          </Link>
          <Link href="/tours" className={pathname === "/tours" ? "text-primary" : "text-foreground/80 hover:text-primary transition-colors"}>
            {t("tours")}
          </Link>
          <Link href="/tour-requests/new" className="text-foreground/80 hover:text-primary transition-colors">{t("customTour")}</Link>
          {status === "authenticated" && <Link href="/my-bookings" className="text-foreground/80 hover:text-primary transition-colors">{t("myBookings")}</Link>}
          {status === "authenticated" && user && user.role !== "CUSTOMER" && (
            <Link href="/admin" className="text-accent-foreground font-semibold">
              {t("admin")}
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          {status === "authenticated" ? (
            <Button variant="outline" size="sm" onClick={() => logout()}>
              {t("logout")}
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" render={<Link href="/login" />}>
                {t("login")}
              </Button>
              <Button size="sm" render={<Link href="/register" />}>
                {t("register")}
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
