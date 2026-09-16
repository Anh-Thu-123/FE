"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateAssignment, useEmployees } from "@/hooks/use-admin-data";
import { ApiClientError } from "@/lib/api-client";

const schema = z.object({
  employeeId: z.string().min(1, "Chọn HDV"),
  departureId: z.string().min(1, "Nhập mã đoàn"),
  role: z.enum(["LEAD_GUIDE", "ASSISTANT_GUIDE", "OPERATOR"]),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

/**
 * Per muc 06 luong 3: before saving, the backend runs a single overlap query
 * (startDate <= endDate_new && endDate >= startDate_new) across assignments
 * AND approved leaveRequests, and returns 409 with the name of the conflicting
 * departure instead of silently overwriting. We surface that 409 payload here.
 */
export default function AdminAssignmentsPage() {
  const { data: employees } = useEmployees();
  const createAssignment = useCreateAssignment();
  const [conflict, setConflict] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { employeeId: "", departureId: "", role: "LEAD_GUIDE", startDate: "", endDate: "" },
  });

  const guides = (employees ?? []).filter((e) => e.position?.toLowerCase().includes("dẫn") || e.guideProfile);

  async function onSubmit(values: FormValues) {
    setConflict(null);
    try {
      await createAssignment.mutateAsync(values);
      toast.success("Đã phân công");
      form.reset();
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 409) {
        setConflict(err.payload?.message ?? "Trùng lịch với một đoàn khác");
      } else {
        toast.error(err instanceof ApiClientError ? err.message : "Phân công thất bại");
      }
    }
  }

  return (
    <div className="space-y-4 max-w-xl">
      <h1 className="text-2xl font-bold">Phân công hướng dẫn viên</h1>
      <Card>
        <CardHeader>
          <CardTitle>Phân công mới</CardTitle>
        </CardHeader>
        <CardContent>
          {conflict && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Trùng lịch (409)</AlertTitle>
              <AlertDescription>{conflict}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <Select
              value={form.watch("employeeId")}
              onValueChange={(v) => form.setValue("employeeId", v ?? "")}
            >
              <SelectTrigger><SelectValue placeholder="Chọn hướng dẫn viên" /></SelectTrigger>
              <SelectContent>
                {guides.length === 0 && (
                  <SelectItem value="_none" disabled>
                    (Chưa tải được danh sách HDV)
                  </SelectItem>
                )}
                {guides.map((g) => (
                  <SelectItem key={g.id} value={g.id}>{g.fullName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input placeholder="Mã đoàn (departureId)" {...form.register("departureId")} />
            <Select
              value={form.watch("role")}
              onValueChange={(v) => form.setValue("role", v as FormValues["role"])}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="LEAD_GUIDE">Trưởng đoàn</SelectItem>
                <SelectItem value="ASSISTANT_GUIDE">Phụ tá</SelectItem>
                <SelectItem value="OPERATOR">Điều hành viên</SelectItem>
              </SelectContent>
            </Select>
            <div className="grid grid-cols-2 gap-3">
              <Input type="date" {...form.register("startDate")} />
              <Input type="date" {...form.register("endDate")} />
            </div>
            <Button type="submit" className="w-full" disabled={createAssignment.isPending}>
              Phân công
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
