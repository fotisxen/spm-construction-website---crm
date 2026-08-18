"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MonthlyPoint } from "@/lib/data/financial-summary";

const eur = new Intl.NumberFormat("el-GR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

function monthLabel(key: string) {
  const [year, month] = key.split("-");
  return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString("el-GR", {
    month: "short",
  });
}

export function MonthlyPlChart({ data }: { data: MonthlyPoint[] }) {
  const formatted = data.map((d) => ({ ...d, label: monthLabel(d.month) }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={formatted} barGap={2}>
        <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
        <XAxis
          dataKey="label"
          axisLine={{ stroke: "var(--chart-axis)" }}
          tickLine={false}
          tick={{ fill: "var(--chart-muted)", fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--chart-muted)", fontSize: 12 }}
          tickFormatter={(v) => eur.format(v)}
          width={70}
        />
        <Tooltip
          formatter={(value) => eur.format(Number(value))}
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 13,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 13 }} />
        <Bar dataKey="income" name="Έσοδα" fill="var(--chart-3)" radius={[4, 4, 0, 0]} maxBarSize={22} />
        <Bar dataKey="expenses" name="Έξοδα" fill="var(--chart-2)" radius={[4, 4, 0, 0]} maxBarSize={22} />
      </BarChart>
    </ResponsiveContainer>
  );
}
