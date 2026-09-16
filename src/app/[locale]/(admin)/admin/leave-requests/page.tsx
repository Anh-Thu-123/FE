"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/admin/data-table";
import {
  useLeaveRequests,
  useSubmitLeaveRequest,
  useDecideLeaveRequest,
} from "@/hooks/use-admin-data";
import { useAuth } from "@/components/providers/auth-provider";
import { formatDate } from "@/lib/format";
import type { LeaveRequest } from "@/types";
import { ApiClientError } from "@/lib/api-client";

const schema = z.object({
  type: z.enum(["ANNUAL", "SICK", "UNPAID", "BUSINESS_TRIP"]),
  fromDate: z.string().min(1),
  toDate: z.string().min(1),
  reason: z.string().min(1, "Bắt buộc"),
});
type FormValues = z.infer<typeof schema>;

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive"> = {
  PENDING: "secondary",
  APPROVED: "default",
  REJECTED: "destructive",
};

export default function AdminLeaveRequestsPage() {
  const { user } = useAuth();
  const { data, isLoading } = useLeaveRequests();
  const submitLeave = useSubmitLeaveRequest();
  const decideLeave = useDecideLeaveRequest();
  const [open, setOpen] = React.useState(false);
  const requests = data ?? [];

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { type: "ANNUAL", fromDate: "", toDate: "", reason: "" },
  });

  async function onSubmit(values: FormValues) {
    try {
      await submitLeave.mutateAsync(values);
      toast.success("Đã nộp đơn nghỉ phép");
      setOpen(false);
      form.reset();
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : "Nộp đơn thất bại");
    }
  }

  async function decide(id: string, status: "APPROVED" | "REJECTED", ownerId: string) {
    // Absolute rule from muc 04: nobody approves their own leave request, not
    // even the Director - their leave is only recorded, never routed for approval.
    if (ownerId === user?.employeeId) {
      toast.error("Không thể tự duyệt đơn của chính mình");
      return;
    }
    try {
      await decideLeave.mutateAsync({ id, status });
      toast.success(status === "APPROVED" ? "Đã duyệt" : "Đã từ chối");
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : "Thao tác thất bại");
    }
  }

  const columns: ColumnDef<LeaveRequest>[] = [
    { accessorKey: "employeeId", header: "Nhân viên" },
    { accessorKey: "type", header: "Loại" },
    {
      id: "range",
      header: "Thời gian",
      cell: ({ row }) => `${formatDate(row.original.fromDate, "vi")} - ${formatDate(row.original.toDate, "vi")}`,
    },
    { accessorKey: "reason", header: "Lý do" },
    {
      id: "status",
      header: "Trạng thái",
      cell: ({ row }) => (
        <Badge variant={STATUS_VARIANT[row.original.status]}>{row.original.status}</Badge>
      ),
    },
    {
      id: "actions",
      header: "Duyệt",
      cell: ({ row }) =>
        row.original.status === "PENDING" ? (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => decide(row.original.id, "APPROVED", row.original.employeeId)}>
              Duyệt
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => decide(row.original.id, "REJECTED", row.original.employeeId)}
            >
              Từ chối
            </Button>
          </div>
        ) : null,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Nghỉ phép</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button>+ Nộp đơn nghỉ phép</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nộp đơn nghỉ phép</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <Select
                value={form.watch("type")}
                onValueChange={(v) => form.setValue("type", v as FormValues["type"])}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ANNUAL">Nghỉ phép năm</SelectItem>
                  <SelectItem value="SICK">Nghỉ ốm</SelectItem>
                  <SelectItem value="UNPAID">Nghỉ không lương</SelectItem>
                  <SelectItem value="BUSINESS_TRIP">Công tác</SelectItem>
                </SelectContent>
              </Select>
              <div className="grid grid-cols-2 gap-3">
                <Input type="date" {...form.register("fromDate")} />
                <Input type="date" {...form.register("toDate")} />
              </div>
              <Textarea placeholder="Lý do" {...form.register("reason")} />
              <Button type="submit" className="w-full" disabled={submitLeave.isPending}>
                Nộp đơn
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Alert>
        <AlertTitle>Chuỗi duyệt cố định</AlertTitle>
        <AlertDescription>
          Vận hành → Trưởng phòng Điều hành; Kinh doanh → Trưởng phòng Marketing;
          2 trưởng phòng và Thư ký → Giám đốc; Giám đốc không cần duyệt. Không ai
          duyệt được đơn của chính mình. Màn hình duyệt cũng phải cảnh báo nếu
          người nộp đơn đang có lịch dẫn đoàn trùng ngày (muc 06 luồng 3).
        </AlertDescription>
      </Alert>

      <DataTable columns={columns} data={requests} isLoading={isLoading} searchPlaceholder="Tìm đơn..." />
    </div>
  );
}
