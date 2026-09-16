"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useRevenueReport,
  useOccupancyReport,
  useGuidePerformanceReport,
} from "@/hooks/use-admin-data";

export default function AdminReportsPage() {
  const [basis, setBasis] = React.useState<"RECEIVED" | "CONFIRMED">("RECEIVED");
  const { data: revenue } = useRevenueReport({ groupBy: "month", basis });
  const { data: occupancy } = useOccupancyReport();
  const { data: guidePerf } = useGuidePerformanceReport();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Báo cáo doanh thu</h1>
        <Select value={basis} onValueChange={(v) => setBasis(v as typeof basis)}>
          <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="RECEIVED">Tiền thực thu</SelectItem>
            <SelectItem value="CONFIRMED">Giá trị đơn đã xác nhận</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader><CardTitle>Doanh thu theo thời gian</CardTitle></CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenue ?? []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip formatter={(value) => Number(value).toLocaleString()} />
              <Line type="monotone" dataKey="revenue" stroke="#0f766e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
          {(revenue ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground text-center mt-[-200px]">
              Chưa có dữ liệu (hoặc backend chưa sẵn sàng)
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Tỷ lệ lấp đầy theo đoàn</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancy ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tourTitle" hide />
                <YAxis unit="%" />
                <Tooltip />
                <Bar dataKey="occupancyRate" fill="#0d9488" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Hiệu suất hướng dẫn viên</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={guidePerf ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fullName" hide />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Bar dataKey="averageScore" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground mt-2">
              Điểm lấy từ <code>tourFeedback</code> do khách chấm, không phải HDV tự chấm.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
