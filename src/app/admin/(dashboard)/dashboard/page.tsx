import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getFinancialOverview } from "@/lib/data/financial-summary";
import { MonthlyPlChart } from "@/components/admin/charts/monthly-pl-chart";

export const metadata: Metadata = { title: "Επισκόπηση" };

const eur = new Intl.NumberFormat("el-GR", { style: "currency", currency: "EUR" });

export default async function AdminDashboardPage() {
  const overview = await getFinancialOverview();

  const kpis = [
    { label: "Σύνολο εσόδων", value: eur.format(overview.totalIncome) },
    { label: "Σύνολο εξόδων", value: eur.format(overview.totalExpenses) },
    {
      label: "Καθαρό αποτέλεσμα",
      value: eur.format(overview.netProfit),
      accent: overview.netProfit >= 0 ? "text-[var(--chart-good)]" : "text-[var(--chart-critical)]",
    },
    { label: "Ενεργά projects", value: String(overview.activeProjectsCount) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Επισκόπηση</h1>
        <p className="text-sm text-muted-foreground">
          Γρήγορη εικόνα της επιχείρησης.{" "}
          <Link href="/admin/reports" className="underline underline-offset-2">
            Δες αναλυτικές αναφορές
          </Link>
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.label}
              </CardTitle>
            </CardHeader>
            <CardContent className={`text-2xl font-semibold ${kpi.accent ?? ""}`}>
              {kpi.value}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Έσοδα vs Έξοδα</CardTitle>
          <CardDescription>Τελευταίοι 12 μήνες</CardDescription>
        </CardHeader>
        <CardContent>
          <MonthlyPlChart data={overview.monthly} />
        </CardContent>
      </Card>
    </div>
  );
}
