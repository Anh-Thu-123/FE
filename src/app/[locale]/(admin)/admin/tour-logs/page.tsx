"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api, ApiClientError } from "@/lib/api-client";

const schema = z.object({
  departureId: z.string().min(1, "Bắt buộc"),
  type: z.enum(["DAILY_LOG", "INCIDENT", "FINAL_REPORT"]),
  day: z.coerce.number().optional(),
  content: z.string().min(1, "Bắt buộc"),
});
type FormValues = z.infer<typeof schema>;

/**
 * HDV writes daily logs / incident reports / a final report per departure.
 * guideScore is intentionally NOT collected here - muc 05 moved satisfaction
 * scoring to the tourFeedback collection (submitted by the customer) so a
 * guide can no longer grade their own performance.
 */
export default function AdminTourLogsPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { departureId: "", type: "DAILY_LOG", content: "" },
  });

  const submitLog = useMutation({
    mutationFn: (values: FormValues) =>
      api.post(`/api/departures/${values.departureId}/logs`, {
        type: values.type,
        day: values.day,
        content: values.content,
      }),
  });

  async function onSubmit(values: FormValues) {
    try {
      await submitLog.mutateAsync(values);
      toast.success("Đã ghi nhật ký");
      form.reset({ departureId: values.departureId, type: "DAILY_LOG", content: "" });
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : "Ghi nhật ký thất bại");
    }
  }

  return (
    <div className="space-y-4 max-w-xl">
      <h1 className="text-2xl font-bold">Nhật ký tour</h1>
      <Card>
        <CardHeader>
          <CardTitle>Ghi nhật ký / báo cáo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <Input placeholder="Mã đoàn (departureId)" {...form.register("departureId")} />
            <Select
              value={form.watch("type")}
              onValueChange={(v) => form.setValue("type", v as FormValues["type"])}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="DAILY_LOG">Nhật ký ngày</SelectItem>
                <SelectItem value="INCIDENT">Sự cố</SelectItem>
                <SelectItem value="FINAL_REPORT">Báo cáo tổng kết</SelectItem>
              </SelectContent>
            </Select>
            <Input type="number" placeholder="Ngày thứ mấy (tuỳ chọn)" {...form.register("day")} />
            <Textarea rows={5} placeholder="Nội dung" {...form.register("content")} />
            <Button type="submit" className="w-full" disabled={submitLog.isPending}>
              Ghi lại
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
