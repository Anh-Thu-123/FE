"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { MobileNav, type NavItem } from "@/components/layout/mobile-nav";
import { cn } from "cn";

export function SiteHeader() {
  const t = useTranslations("nav");
  const { user, status, logout } = useAuth();
  const pathname = usePathname();

  const isStaff = status === "authenticated" && user && user.role !== "CUSTOMER";

  const items: NavItem[] = [
    { href: "/about", label: t("about") },
    { href: "/tours", label: t("tours") },
    { href: "/tour-requests/new", label: t("customTour") },
    ...(status === "authenticated" ? [{ href: "/my-bookings", label: t("myBookings") }] : []),
    ...(isStaff ? [{ href: "/admin", label: t("admin"), emphasis: true }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 surface-glass">
      {/* P1 Accessibility: duong tat bo qua nav, chi hien khi dung ban phim. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        {t("skipToContent")}
      </a>

      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/"
          className="font-[family-name:var(--font-heading)] text-lg font-bold tracking-tight text-primary"
        >
          Nagare<span className="text-accent">.</span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
          {items.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-full px-3 py-2 transition-colors",
                  active
                    ? "text-primary"
                    : "text-foreground/75 hover:bg-muted/70 hover:text-foreground",
                  item.emphasis && !active && "text-primary"
                )}
              >
                {item.label}
                {/* Chi bao trang hien tai khong chi dua vao mau (rule P1). */}
                {active && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <LocaleSwitcher />

          <div className="hidden items-center gap-2 md:flex">
            {status === "authenticated" ? (
              <Button variant="outline" size="sm" className="rounded-full" onClick={() => logout()}>
                {t("logout")}
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="rounded-full" render={<Link href="/login" />}>
                  {t("login")}
                </Button>
                <Button size="sm" className="rounded-full" render={<Link href="/register" />}>
                  {t("register")}
                </Button>
              </>
            )}
          </div>

          <MobileNav
            items={items}
            footer={
              status === "authenticated" ? (
                <Button variant="outline" className="h-11 w-full rounded-full" onClick={() => logout()}>
                  {t("logout")}
                </Button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button className="h-11 w-full rounded-full" render={<Link href="/register" />}>
                    {t("register")}
                  </Button>
                  <Button variant="outline" className="h-11 w-full rounded-full" render={<Link href="/login" />}>
                    {t("login")}
                  </Button>
                </div>
              )
            }
          />
        </div>
      </div>
    </header>
  );
}
