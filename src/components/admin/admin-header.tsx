"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { Link } from "@/i18n/navigation";

export function AdminHeader() {
  const t = useTranslations("nav");
  const { user, logout } = useAuth();

  return (
    <header className="border-b flex items-center justify-between px-6 py-3 bg-white">
      <div className="text-sm text-muted-foreground">
        {user?.role} {user?.fullName ? `· ${user.fullName}` : ""}
      </div>
      <div className="flex items-center gap-2">
        <LocaleSwitcher />
        <Button variant="ghost" size="sm" render={<Link href="/" />}>
          Trang công khai
        </Button>
        <Button variant="outline" size="sm" onClick={() => logout()}>
          {t("logout")}
        </Button>
      </div>
    </header>
  );
}
