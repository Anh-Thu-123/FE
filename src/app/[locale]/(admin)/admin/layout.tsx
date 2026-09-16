"use client";

import * as React from "react";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

/**
 * Client-side gate for the whole /admin area. This is UX only (see the
 * comment in src/middleware.ts) - it just avoids rendering the dashboard
 * shell for a logged-out or customer session. The backend independently
 * enforces every permission with @PreAuthorize and scoped Mongo queries.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, status } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?next=/admin");
    } else if (status === "authenticated" && user?.role === "CUSTOMER") {
      router.replace("/");
    } else if (status === "authenticated" && user?.mustChangePassword) {
      router.replace("/change-password");
    }
  }, [status, user, router]);

  if (status !== "authenticated" || !user || user.role === "CUSTOMER") {
    return <div className="p-10 text-center text-muted-foreground">Đang tải...</div>;
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <AdminHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
