"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { can, type Module } from "@/lib/permissions";
import { cn } from "@/lib/utils";

const ITEMS: { href: string; labelKey: string; module: Module }[] = [
  { href: "/admin", labelKey: "dashboard", module: "tours" },
  { href: "/admin/tours", labelKey: "tours", module: "tours" },
  { href: "/admin/departures", labelKey: "departures", module: "departures" },
  { href: "/admin/bookings", labelKey: "bookings", module: "bookings" },
  { href: "/admin/customers", labelKey: "customers", module: "bookings" },
  { href: "/admin/tour-requests", labelKey: "tourRequests", module: "tourRequests" },
  { href: "/admin/assignments", labelKey: "assignments", module: "assignments" },
  { href: "/admin/tour-logs", labelKey: "tourLogs", module: "tourLogs" },
  { href: "/admin/visa-cases", labelKey: "visaCases", module: "visaCases" },
  { href: "/admin/employees", labelKey: "employees", module: "employees" },
  { href: "/admin/attendance", labelKey: "attendance", module: "attendance" },
  { href: "/admin/leave-requests", labelKey: "leaveRequests", module: "leaveRequests" },
  { href: "/admin/reports", labelKey: "reports", module: "revenueReports" },
];

export function AdminSidebar() {
  const t = useTranslations("admin");
  const { user } = useAuth();
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 border-r min-h-screen p-4 hidden md:block">
      <Link href="/admin" className="block font-bold text-teal-700 mb-6">
        Nagare Admin
      </Link>
      <nav className="space-y-1 text-sm">
        {ITEMS.filter((item) => can(user?.role, item.module)).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block rounded-md px-3 py-2 hover:bg-teal-50",
              pathname === item.href && "bg-teal-100 text-teal-800 font-medium"
            )}
          >
            {t(item.labelKey)}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
