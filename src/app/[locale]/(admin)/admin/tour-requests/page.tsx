"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/admin/data-table";
import { useTourRequests } from "@/hooks/use-admin-data";
import { formatDate } from "@/lib/format";
import type { TourRequest } from "@/types";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  NEW: "secondary",
  ASSIGNED: "outline",
  QUOTING: "outline",
  QUOTED: "default",
  WON: "default",
  LOST: "destructive",
};

export default function AdminTourRequestsPage() {
  const { data, isLoading } = useTourRequests();
  const requests = data ?? [];

  const columns: ColumnDef<TourRequest>[] = [
    { id: "contact", header: "Khách", accessorFn: (row) => `${row.contact.fullName} (${row.contact.phone})` },
    { accessorKey: "direction", header: "Hướng" },
    { id: "pax", header: "Số khách", accessorFn: (row) => `${row.paxAdult} NL + ${row.paxChild} TE` },
    {
      id: "latestQuote",
      header: "Báo giá mới nhất",
      cell: ({ row }) => {
        const latest = row.original.quotes?.[row.original.quotes.length - 1];
        return latest ? `v${latest.version} — ${latest.total.toLocaleString()}` : "—";
      },
    },
    {
      id: "createdAt",
      header: "Ngày gửi",
      cell: ({ row }) => formatDate(row.original.createdAt, "vi"),
    },
    {
      id: "status",
      header: "Trạng thái",
      cell: ({ row }) => (
        <Badge variant={STATUS_VARIANT[row.original.status] ?? "outline"}>{row.original.status}</Badge>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Yêu cầu tour riêng & báo giá</h1>
      <p className="text-sm text-muted-foreground">
        Mỗi lần sửa giá tạo một phiên bản mới trong <code>quotes[]</code>, không
        ghi đè - khi khách khiếu nại &ldquo;lần trước báo giá khác&rdquo; thì có bằng chứng
        đối chiếu (muc 06, luồng 2).
      </p>
      <DataTable columns={columns} data={requests} isLoading={isLoading} searchPlaceholder="Tìm yêu cầu..." />
    </div>
  );
}
