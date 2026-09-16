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
    <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto max-w-6xl flex items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="font-bold text-lg tracking-tight text-teal-700">
          Nagare Travel
        </Link>
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
          <Link href="/tours" className={pathname === "/tours" ? "text-teal-700" : ""}>
            {t("tours")}
          </Link>
          <Link href="/tour-requests/new">{t("customTour")}</Link>
          {status === "authenticated" && <Link href="/my-bookings">{t("myBookings")}</Link>}
          {status === "authenticated" && user && user.role !== "CUSTOMER" && (
            <Link href="/admin" className="text-teal-700 font-semibold">
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
