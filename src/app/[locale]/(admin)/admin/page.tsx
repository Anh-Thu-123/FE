"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/providers/auth-provider";
import { useAdminBookings, useBelowMinimumDepartures, useVisaCases } from "@/hooks/use-admin-data";
import { toArray } from "@/lib/format";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboardPage() {
  const t = useTranslations("admin");
  const { user } = useAuth();
  const { data: heldBookings } = useAdminBookings({ status: "HELD" });
  const { data: belowMinimum } = useBelowMinimumDepartures();
  const { data: visaCases } = useVisaCases({ status: "COLLECTING" });

  const held = toArray(heldBookings);
  const lowDepartures = belowMinimum ?? [];
  const urgentVisas = toArray(visaCases);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {t("welcomeBack", { name: user?.fullName ?? user?.username ?? "" })}
      </h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Đơn đang giữ chỗ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{held.length}</p>
            <Link href="/admin/bookings" className="text-sm text-teal-700">
              Xem chi tiết
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Đoàn chưa đủ khách tối thiểu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{lowDepartures.length}</p>
            <Link href="/admin/departures" className="text-sm text-teal-700">
              Xem lịch khởi hành
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Hồ sơ visa đang thu thập
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{urgentVisas.length}</p>
            <Link href="/admin/visa-cases" className="text-sm text-teal-700">
              Xem hồ sơ
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Vai trò hiện tại
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="text-sm">
              {user?.role}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <p className="text-sm text-muted-foreground">
        Menu bên trái tự ẩn/hiện theo quyền của tài khoản đang đăng nhập (xem
        src/lib/permissions.ts). Đây là ràng buộc UX; mọi kiểm tra quyền thật
        đều nằm ở backend.
      </p>
    </div>
  );
}
