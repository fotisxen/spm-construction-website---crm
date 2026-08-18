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
import type { ProjectBudgetPoint } from "@/lib/data/financial-summary";

const eur = new Intl.NumberFormat("el-GR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

export function BudgetActualChart({ data }: { data: ProjectBudgetPoint[] }) {
  if (data.length === 0) {
    return (
      <p className="flex h-70 items-center justify-center text-sm text-muted-foreground">
        Δεν υπάρχουν ακόμα projects.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={Math.max(280, data.length * 46)}>
      <BarChart data={data} layout="vertical" barGap={2} margin={{ left: 8 }}>
        <CartesianGrid horizontal={false} stroke="var(--chart-grid)" />
        <XAxis
          type="number"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--chart-muted)", fontSize: 12 }}
          tickFormatter={(v) => eur.format(v)}
        />
        <YAxis
          type="category"
          dataKey="title"
          axisLine={false}
          tickLine={false}
          width={140}
          tick={{ fill: "var(--chart-muted)", fontSize: 12 }}
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
        <Bar dataKey="budget" name="Προϋπολογισμός" fill="var(--chart-1)" radius={[0, 4, 4, 0]} maxBarSize={16} />
        <Bar dataKey="actual" name="Πραγματικό" fill="var(--chart-2)" radius={[0, 4, 4, 0]} maxBarSize={16} />
      </BarChart>
    </ResponsiveContainer>
  );
}
