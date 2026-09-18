"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import { useEmployees, useCreateStaffAccount } from "@/hooks/use-admin-data";
import type { Employee } from "@/types";
import { ApiClientError } from "@/lib/api-client";
import { UserPlus, Copy } from "lucide-react";

// Vai tro noi bo theo muc 04 ban thiet ke - khong bao gom CUSTOMER (tu dang ky rieng).
const ROLES = [
  { value: "DIRECTOR", label: "Giám đốc" },
  { value: "SECRETARY", label: "Thư ký" },
  { value: "OPS_MANAGER", label: "Trưởng phòng Điều hành" },
  { value: "TOUR_DESIGNER", label: "Nhân viên Thiết kế Tour" },
  { value: "TOUR_GUIDE", label: "Nhân viên Dẫn tour" },
  { value: "MKT_MANAGER", label: "Trưởng phòng Marketing" },
  { value: "MKT_STAFF", label: "Nhân viên Marketing & CSKH" },
] as const;

const DEPARTMENTS = [
  { value: "BGD", label: "Ban Giám đốc" },
  { value: "OPERATIONS", label: "Khối Vận hành & Sản phẩm" },
  { value: "SALES", label: "Khối Kinh doanh & Dịch vụ" },
] as const;

const schema = z.object({
  username: z.string().min(3, "Tối thiểu 3 ký tự").regex(/^[a-z0-9._-]+$/, "Chỉ chữ thường, số, . _ -"),
  fullName: z.string().min(1, "Bắt buộc"),
  role: z.enum(["DIRECTOR", "SECRETARY", "OPS_MANAGER", "TOUR_DESIGNER", "TOUR_GUIDE", "MKT_MANAGER", "MKT_STAFF"]),
  department: z.enum(["BGD", "OPERATIONS", "SALES"]),
  position: z.string().optional(),
  phone: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function AdminEmployeesPage() {
  const { data, isLoading } = useEmployees();
  const employees = data ?? [];
  const createAccount = useCreateStaffAccount();
  const [open, setOpen] = React.useState(false);
  const [result, setResult] = React.useState<{ username: string; tempPassword: string } | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: "", fullName: "", role: "TOUR_GUIDE", department: "OPERATIONS", position: "", phone: "" },
  });

  async function onSubmit(values: FormValues) {
    try {
      const res = await createAccount.mutateAsync(values);
      setResult(res);
      form.reset();
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : "Tạo tài khoản thất bại");
    }
  }

  function copyCredentials() {
    if (!result) return;
    navigator.clipboard.writeText(`Tên đăng nhập: ${result.username}\nMật khẩu tạm: ${result.tempPassword}`);
    toast.success("Đã sao chép");
  }

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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Nhân sự</h1>
        <Dialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (!v) setResult(null);
          }}
        >
          <DialogTrigger render={<Button><UserPlus className="h-4 w-4" /> Tạo tài khoản</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{result ? "Đã tạo tài khoản" : "Tạo tài khoản nhân sự"}</DialogTitle>
            </DialogHeader>

            {result ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Mật khẩu tạm chỉ hiện <b>một lần duy nhất</b> — gửi cho nhân viên ngay, họ sẽ bị bắt đổi mật khẩu ở lần đăng nhập đầu.
                </p>
                <div className="rounded-lg border bg-muted p-3 font-mono text-sm space-y-1">
                  <div>Tên đăng nhập: <b>{result.username}</b></div>
                  <div>Mật khẩu tạm: <b>{result.tempPassword}</b></div>
                </div>
                <Button variant="outline" className="w-full" onClick={copyCredentials}>
                  <Copy className="h-4 w-4" /> Sao chép
                </Button>
              </div>
            ) : (
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                <div>
                  <Label className="mb-1.5">Tên đăng nhập</Label>
                  <Input placeholder="vd. nguyenvana" {...form.register("username")} />
                  {form.formState.errors.username && (
                    <p className="text-xs text-destructive mt-1">{form.formState.errors.username.message}</p>
                  )}
                </div>
                <div>
                  <Label className="mb-1.5">Họ tên</Label>
                  <Input placeholder="Nguyễn Văn A" {...form.register("fullName")} />
                  {form.formState.errors.fullName && (
                    <p className="text-xs text-destructive mt-1">{form.formState.errors.fullName.message}</p>
                  )}
                </div>
                <div>
                  <Label className="mb-1.5">Chức danh</Label>
                  <Select value={form.watch("role")} onValueChange={(v) => form.setValue("role", v as FormValues["role"])}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {ROLES.map((r) => (
                        <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1.5">Phòng ban</Label>
                  <Select value={form.watch("department")} onValueChange={(v) => form.setValue("department", v as FormValues["department"])}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((d) => (
                        <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="mb-1.5">Chức vụ hiển thị (tuỳ chọn)</Label>
                    <Input placeholder="vd. Hướng dẫn viên" {...form.register("position")} />
                  </div>
                  <div>
                    <Label className="mb-1.5">Điện thoại (tuỳ chọn)</Label>
                    <Input {...form.register("phone")} />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full" disabled={createAccount.isPending}>
                    Tạo tài khoản
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <DataTable columns={columns} data={employees} isLoading={isLoading} searchPlaceholder="Tìm nhân sự..." />
    </div>
  );
}
