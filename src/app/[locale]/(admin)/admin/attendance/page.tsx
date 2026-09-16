"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/admin/data-table";
import { useAttendance } from "@/hooks/use-admin-data";
import { formatDate } from "@/lib/format";
import type { Attendance } from "@/types";

const SOURCE_LABEL: Record<string, string> = {
  WEB: "Chấm công tay",
  ON_TOUR: "Đang dẫn đoàn",
  LEAVE: "Nghỉ phép",
};

export default function AdminAttendancePage() {
  const [month, setMonth] = React.useState(() => new Date().toISOString().slice(0, 7));
  const { data, isLoading } = useAttendance(month);
  const records = data ?? [];

  const columns: ColumnDef<Attendance>[] = [
    { accessorKey: "employeeId", header: "Nhân viên" },
    {
      id: "date",
      header: "Ngày",
      cell: ({ row }) => formatDate(row.original.date, "vi"),
    },
    {
      id: "source",
      header: "Nguồn",
      cell: ({ row }) => <Badge variant="outline">{SOURCE_LABEL[row.original.source]}</Badge>,
    },
    { accessorKey: "checkInAt", header: "Giờ vào" },
    { accessorKey: "checkOutAt", header: "Giờ ra" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Chấm công</h1>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border rounded-md px-3 py-1.5 text-sm"
        />
      </div>
      <p className="text-sm text-muted-foreground">
        Ngày HDV đang dẫn đoàn được đánh dấu tự động từ <code>assignments</code>.
        Thứ tự ưu tiên khi trùng: ON_TOUR thắng LEAVE thắng WEB (muc 05).
      </p>
      <DataTable columns={columns} data={records} isLoading={isLoading} searchPlaceholder="Tìm nhân viên..." />
    </div>
  );
}
