"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { useVisaCases, useUpdateVisaCaseStatus } from "@/hooks/use-admin-data";
import { formatDate } from "@/lib/format";
import type { VisaCase } from "@/types";
import { ApiClientError } from "@/lib/api-client";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  COLLECTING: "secondary",
  SUBMITTED: "outline",
  EXTRA_REQUIRED: "destructive",
  APPROVED: "default",
  REJECTED: "destructive",
};

function daysLeft(deadline: string) {
  const diff = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return diff;
}

export default function AdminVisaCasesPage() {
  const { data, isLoading } = useVisaCases();
  const updateStatus = useUpdateVisaCaseStatus();
  const cases = (data ?? []).slice().sort((a, b) => a.deadline.localeCompare(b.deadline));

  async function approve(id: string) {
    try {
      await updateStatus.mutateAsync({ id, status: "APPROVED" });
      toast.success("Đã duyệt hồ sơ");
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : "Cập nhật thất bại");
    }
  }

  const columns: ColumnDef<VisaCase>[] = [
    { accessorKey: "customerName", header: "Khách" },
    { accessorKey: "caseType", header: "Loại hồ sơ" },
    {
      id: "deadline",
      header: "Hạn nộp",
      cell: ({ row }) => {
        const left = daysLeft(row.original.deadline);
        return (
          <span className={left <= 3 ? "text-destructive font-semibold" : ""}>
            {formatDate(row.original.deadline, "vi")} ({left} ngày)
          </span>
        );
      },
    },
    {
      id: "documents",
      header: "Giấy tờ",
      cell: ({ row }) => `${row.original.documents.length} tệp`,
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
      cell: ({ row }) =>
        row.original.status === "SUBMITTED" ? (
          <Button size="sm" onClick={() => approve(row.original.id)}>
            Duyệt
          </Button>
        ) : null,
    },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Hồ sơ visa</h1>
      <p className="text-sm text-muted-foreground">
        Hạn nộp = mốc sớm hơn giữa &ldquo;30 ngày trước khởi hành&rdquo; và &ldquo;7 ngày kể từ
        hôm nay&rdquo; (muc 06 luồng 4). Sắp xếp theo hạn gần nhất lên đầu.
      </p>
      <DataTable columns={columns} data={cases} isLoading={isLoading} searchPlaceholder="Tìm hồ sơ..." />
    </div>
  );
}
