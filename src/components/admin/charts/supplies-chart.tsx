"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SupplyPoint } from "@/lib/data/financial-summary";

const eur = new Intl.NumberFormat("el-GR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

export function SuppliesChart({ data }: { data: SupplyPoint[] }) {
  if (data.length === 0) {
    return (
      <p className="flex h-70 items-center justify-center text-sm text-muted-foreground">
        Δεν υπάρχουν ακόμα καταχωρημένες προμήθειες.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={Math.max(280, data.length * 40)}>
      <BarChart data={data} layout="vertical" margin={{ left: 8 }}>
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
          dataKey="item"
          axisLine={false}
          tickLine={false}
          width={130}
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
        <Bar dataKey="cost" name="Κόστος" fill="var(--chart-4)" radius={[0, 4, 4, 0]} maxBarSize={18} />
      </BarChart>
    </ResponsiveContainer>
  );
}
