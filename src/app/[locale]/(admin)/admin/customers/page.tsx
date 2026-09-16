"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/admin/data-table";
import { useCustomers } from "@/hooks/use-admin-data";
import { toArray, formatDate } from "@/lib/format";
import type { Customer } from "@/types";

export default function AdminCustomersPage() {
  const { data, isLoading } = useCustomers();
  const customers = toArray<Customer>(data);

  const columns: ColumnDef<Customer>[] = [
    { accessorKey: "fullName", header: "Họ tên" },
    { accessorKey: "phone", header: "Điện thoại" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "nationality", header: "Quốc tịch" },
    { accessorKey: "source", header: "Nguồn" },
    {
      id: "tags",
      header: "Nhãn",
      cell: ({ row }) => (
        <div className="flex gap-1 flex-wrap">
          {row.original.tags?.map((tag) => (
            <Badge key={tag} variant={tag === "nghi trùng" ? "destructive" : "secondary"}>
              {tag}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      id: "createdAt",
      header: "Ngày tạo",
      cell: ({ row }) => formatDate(row.original.createdAt, "vi"),
    },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Khách hàng / CRM</h1>
      <p className="text-sm text-muted-foreground">
        Hồ sơ khách nghi trùng theo số điện thoại được gắn nhãn tự động và phải
        gộp thủ công qua <code>mergedIntoId</code> - không tự gộp để tránh lộ
        lịch sử đơn của người khác (muc 05).
      </p>
      <DataTable columns={columns} data={customers} isLoading={isLoading} searchPlaceholder="Tìm khách..." />
    </div>
  );
}
