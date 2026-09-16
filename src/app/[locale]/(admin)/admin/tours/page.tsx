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
import { useTours, useCreateTour } from "@/hooks/use-admin-data";
import { can } from "@/lib/permissions";
import { useAuth } from "@/components/providers/auth-provider";
import { toArray, formatCurrency, bi } from "@/lib/format";
import type { Tour } from "@/types";
import { ApiClientError } from "@/lib/api-client";

const schema = z.object({
  code: z.string().min(1),
  type: z.enum(["OUTBOUND", "INBOUND", "DOMESTIC"]),
  theme: z.enum(["HEALING", "YOUTH", "ACADEMIC", "CLASSIC", "NATURE", "ADVENTURE", "HERITAGE"]),
  titleVi: z.string().min(1),
  titleJa: z.string().optional(),
  summaryVi: z.string().optional(),
  durationDays: z.coerce.number().min(1),
  durationNights: z.coerce.number().min(0),
  basePriceAdult: z.coerce.number().min(0),
  currency: z.enum(["VND", "JPY"]),
});

type FormValues = z.infer<typeof schema>;

function StatusBadge({ status }: { status: string }) {
  const variant = status === "PUBLISHED" ? "default" : status === "DRAFT" ? "secondary" : "outline";
  return <Badge variant={variant}>{status}</Badge>;
}

export default function AdminToursPage() {
  const { user } = useAuth();
  const { data, isLoading } = useTours();
  const createTour = useCreateTour();
  const [open, setOpen] = React.useState(false);
  const tours = toArray<Tour>(data);
  const canEditTours = can(user?.role, "tours") && user?.role === "TOUR_DESIGNER";

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: "",
      type: "OUTBOUND",
      theme: "HEALING",
      titleVi: "",
      titleJa: "",
      summaryVi: "",
      durationDays: 3,
      durationNights: 2,
      basePriceAdult: 0,
      currency: "VND",
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      await createTour.mutateAsync({
        code: values.code,
        type: values.type,
        theme: values.theme,
        title: { vi: values.titleVi, ja: values.titleJa || "" },
        summary: { vi: values.summaryVi || "", ja: "" },
        durationDays: values.durationDays,
        durationNights: values.durationNights,
        basePriceAdult: values.basePriceAdult,
        currency: values.currency,
      });
      toast.success("Đã tạo tour (trạng thái DRAFT)");
      setOpen(false);
      form.reset();
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : "Tạo tour thất bại");
    }
  }

  const columns: ColumnDef<Tour>[] = [
    { accessorKey: "code", header: "Mã tour" },
    {
      id: "title",
      header: "Tên tour",
      accessorFn: (row) => bi(row.title, "vi"),
    },
    { accessorKey: "type", header: "Loại" },
    { accessorKey: "theme", header: "Chủ đề" },
    {
      id: "priceAdult",
      header: "Giá NL",
      cell: ({ row }) => formatCurrency(row.original.basePriceAdult, row.original.currency),
    },
    {
      id: "pubVi",
      header: "VI",
      cell: ({ row }) => <StatusBadge status={row.original.publication?.vi?.status ?? "DRAFT"} />,
    },
    {
      id: "pubJa",
      header: "JA",
      cell: ({ row }) => <StatusBadge status={row.original.publication?.ja?.status ?? "DRAFT"} />,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý tour</h1>
        {canEditTours && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button>+ Tạo tour mới</Button>} />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tạo tour mới</DialogTitle>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Mã tour (VD: KYK-01)" {...form.register("code")} />
                  <Select
                    value={form.watch("type")}
                    onValueChange={(v) => form.setValue("type", v as FormValues["type"])}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OUTBOUND">Outbound</SelectItem>
                      <SelectItem value="INBOUND">Inbound</SelectItem>
                      <SelectItem value="DOMESTIC">Domestic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Select
                  value={form.watch("theme")}
                  onValueChange={(v) => form.setValue("theme", v as FormValues["theme"])}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["HEALING", "YOUTH", "ACADEMIC", "CLASSIC", "NATURE", "ADVENTURE", "HERITAGE"].map((th) => (
                      <SelectItem key={th} value={th}>{th}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input placeholder="Tên tour (Tiếng Việt)" {...form.register("titleVi")} />
                <Input placeholder="Tên tour (Tiếng Nhật) - tuỳ chọn" {...form.register("titleJa")} />
                <Textarea placeholder="Tóm tắt" rows={3} {...form.register("summaryVi")} />
                <div className="grid grid-cols-3 gap-3">
                  <Input type="number" placeholder="Số ngày" {...form.register("durationDays")} />
                  <Input type="number" placeholder="Số đêm" {...form.register("durationNights")} />
                  <Select
                    value={form.watch("currency")}
                    onValueChange={(v) => form.setValue("currency", v as FormValues["currency"])}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VND">VND</SelectItem>
                      <SelectItem value="JPY">JPY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Input type="number" placeholder="Giá người lớn" {...form.register("basePriceAdult")} />
                <Button type="submit" className="w-full" disabled={createTour.isPending}>
                  Tạo tour (DRAFT)
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <DataTable columns={columns} data={tours} isLoading={isLoading} searchPlaceholder="Tìm tour..." />
    </div>
  );
}
