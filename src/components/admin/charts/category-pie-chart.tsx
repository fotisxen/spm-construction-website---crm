"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { CategoryPoint } from "@/lib/data/financial-summary";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const eur = new Intl.NumberFormat("el-GR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

export function CategoryPieChart({ data }: { data: CategoryPoint[] }) {
  if (data.length === 0) {
    return (
      <p className="flex h-70 items-center justify-center text-sm text-muted-foreground">
        Δεν υπάρχουν ακόμα δεδομένα.
      </p>
    );
  }

  const top = data.slice(0, 5);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={top}
          dataKey="amount"
          nameKey="category"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={2}
          stroke="var(--card)"
          strokeWidth={2}
        >
          {top.map((entry, index) => (
            <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => eur.format(Number(value))}
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 13,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
