"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/admin/data-table";
import { useEmployees } from "@/hooks/use-admin-data";
import type { Employee } from "@/types";

export default function AdminEmployeesPage() {
  const { data, isLoading } = useEmployees();
  const employees = data ?? [];

  const columns: ColumnDef<Employee>[] = [
    { accessorKey: "code", header: "Mã NV" },
    { accessorKey: "fullName", header: "Họ tên" },
    { accessorKey: "position", header: "Chức danh" },
    { accessorKey: "department", header: "Phòng ban" },
    { accessorKey: "phone", header: "Điện thoại" },
    {
      id: "languages",
      header: "Ngôn ngữ",
      cell: ({ row }) => row.original.languages?.join(", "),
    },
    {
      id: "status",
      header: "Trạng thái",
      cell: ({ row }) => (
        <Badge variant={row.original.status === "ACTIVE" ? "default" : "destructive"}>
          {row.original.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Nhân sự</h1>
      <DataTable columns={columns} data={employees} isLoading={isLoading} searchPlaceholder="Tìm nhân sự..." />
    </div>
  );
}
