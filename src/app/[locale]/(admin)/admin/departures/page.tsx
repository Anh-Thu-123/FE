"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/admin/data-table";
import { useDepartures, useBelowMinimumDepartures } from "@/hooks/use-admin-data";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Departure } from "@/types";
import { seatsAvailable } from "@/hooks/use-departures";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  OPEN: "default",
  GUARANTEED: "default",
  FULL: "secondary",
  CLOSED: "outline",
  CANCELLED: "destructive",
  COMPLETED: "outline",
};

export default function AdminDeparturesPage() {
  const { data, isLoading } = useDepartures();
  const { data: belowMin } = useBelowMinimumDepartures();
  const departures = data ?? [];

  const columns: ColumnDef<Departure>[] = [
    { accessorKey: "code", header: "Mã đoàn" },
    {
      id: "departDate",
      header: "Ngày đi",
      cell: ({ row }) => formatDate(row.original.departDate, "vi"),
    },
    {
      id: "seats",
      header: "Chỗ trống / sức chứa",
      cell: ({ row }) => `${seatsAvailable(row.original)} / ${row.original.capacity}`,
    },
    { accessorKey: "minPax", header: "Tối thiểu" },
    {
      id: "price",
      header: "Giá NL",
      cell: ({ row }) => formatCurrency(row.original.priceAdult, row.original.currency),
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Lịch khởi hành</h1>

      {(belowMin ?? []).length > 0 && (
        <Card className="border-amber-300 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-800 text-base">
              {belowMin!.length} đoàn chưa đủ khách tối thiểu (mốc 15 ngày trước khởi hành)
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-amber-800">
            Điều hành cần quyết định huỷ hay gộp đoàn. Xem danh sách bên dưới.
          </CardContent>
        </Card>
      )}

      <DataTable columns={columns} data={departures} isLoading={isLoading} searchPlaceholder="Tìm mã đoàn..." />
    </div>
  );
}
