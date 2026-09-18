"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "cn";

export type NavItem = { href: string; label: string; emphasis?: boolean };

/**
 * Menu cho man hinh nho. Truoc day nav bi `hidden md:flex` nen nguoi dung
 * mobile khong co bat ky duong dan nao ngoai logo -> day la loi dieu huong
 * nghiem trong nhat cua trang (rule P9 Navigation Patterns).
 *
 * Moi muc cao 48px, vuot nguong cham toi thieu 44x44 (rule P2).
 */
export function MobileNav({
  items,
  footer,
}: {
  items: NavItem[];
  footer?: React.ReactNode;
}) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="size-9 rounded-full md:hidden"
            aria-label={t("openMenu")}
          />
        }
      >
        <Menu className="size-5" />
      </DialogTrigger>

      <DialogContent
        className={cn(
          // Bien dialog mac dinh thanh sheet truot tu phai — quen thuoc hon tren mobile.
          "top-0 right-0 left-auto h-dvh w-[min(20rem,85vw)] max-w-none translate-x-0 translate-y-0",
          "rounded-none rounded-l-2xl p-0 sm:max-w-none",
          "data-open:slide-in-from-right data-closed:slide-out-to-right"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <DialogTitle className="font-[family-name:var(--font-heading)] text-base font-semibold">
              {t("menuTitle")}
            </DialogTitle>
          </div>

          <nav className="flex-1 overflow-y-auto px-2 py-3">
            <ul className="flex flex-col">
              {items.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex min-h-12 items-center rounded-lg px-3 text-[15px] font-medium transition-colors",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/80 hover:bg-muted hover:text-foreground",
                        item.emphasis && !active && "text-primary"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {footer && (
            <div className="border-t px-5 py-4" onClick={() => setOpen(false)}>
              {footer}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
