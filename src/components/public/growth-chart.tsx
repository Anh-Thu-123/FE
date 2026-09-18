"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// So lieu tu Ho_So_Nang_Luc_Nagare_V2.docx, muc "5. Hanh trinh Tang truong".
const data = [
  { year: "Năm 1", jp: 32, vn: 47 },
  { year: "Năm 2", jp: 39, vn: 58 },
  { year: "Năm 3", jp: 51, vn: 76 },
];

export function GrowthChart() {
  return (
    <div className="h-72 w-full rounded-xl border bg-card p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={6}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} width={30} />
          <Tooltip
            contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="jp" name="Tour Nhật Bản" fill="var(--primary)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="vn" name="Tour Việt Nam" fill="var(--accent)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
