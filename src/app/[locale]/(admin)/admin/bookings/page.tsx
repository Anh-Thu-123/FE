"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/admin/data-table";
import {
  useAdminBookings,
  useConfirmBooking,
  useCancelBooking,
} from "@/hooks/use-admin-data";
import { toArray, formatCurrency, formatDate } from "@/lib/format";
import type { Booking } from "@/types";
import { ApiClientError } from "@/lib/api-client";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  HELD: "secondary",
  CONFIRMED: "default",
  COMPLETED: "outline",
  CANCELLED: "destructive",
};

export default function AdminBookingsPage() {
  const [status, setStatus] = React.useState<string>("all");
  const { data, isLoading } = useAdminBookings(status === "all" ? {} : { status });
  const confirmBooking = useConfirmBooking();
  const cancelBooking = useCancelBooking();
  const bookings = toArray<Booking>(data);

  async function handleConfirm(id: string) {
    try {
      await confirmBooking.mutateAsync(id);
      toast.success("Đã xác nhận đơn");
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : "Xác nhận thất bại");
    }
  }

  async function handleCancel(id: string) {
    const reason = window.prompt("Nhập lý do huỷ đơn:");
    if (!reason) return;
    try {
      await cancelBooking.mutateAsync({ id, reason });
      toast.success("Đã huỷ đơn");
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : "Huỷ đơn thất bại");
    }
  }

  const columns: ColumnDef<Booking>[] = [
    { accessorKey: "code", header: "Mã đơn" },
    { id: "kind", header: "Loại", accessorFn: (row) => (row.kind === "JOIN" ? "Ghép" : "Riêng") },
    { id: "contact", header: "Khách", accessorFn: (row) => `${row.contact.fullName} (${row.contact.phone})` },
    {
      id: "total",
      header: "Tổng tiền",
      cell: ({ row }) => formatCurrency(row.original.pricing.total, row.original.pricing.currency),
    },
    {
      id: "createdAt",
      header: "Ngày tạo",
      cell: ({ row }) => formatDate(row.original.createdAt, "vi"),
    },
    {
      id: "status",
      header: "Trạng thái",
      cell: ({ row }) => (
        <Badge variant={STATUS_VARIANT[row.original.status] ?? "outline"}>{row.original.status}</Badge>
      ),
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => (
        <div className="flex gap-2">
          {row.original.status === "HELD" && (
            <Button size="sm" onClick={() => handleConfirm(row.original.id)}>
              Xác nhận
            </Button>
          )}
          {(row.original.status === "HELD" || row.original.status === "CONFIRMED") && (
            <Button size="sm" variant="destructive" onClick={() => handleCancel(row.original.id)}>
              Huỷ
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Booking</h1>
        <Select value={status} onValueChange={(v) => setStatus(v ?? "all")}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="HELD">Đang giữ chỗ</SelectItem>
            <SelectItem value="CONFIRMED">Đã xác nhận</SelectItem>
            <SelectItem value="COMPLETED">Hoàn tất</SelectItem>
            <SelectItem value="CANCELLED">Đã huỷ</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DataTable columns={columns} data={bookings} isLoading={isLoading} searchPlaceholder="Tìm theo mã đơn, tên khách..." />
    </div>
  );
}
