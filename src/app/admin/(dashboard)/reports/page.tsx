import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getFinancialOverview } from "@/lib/data/financial-summary";
import { MonthlyPlChart } from "@/components/admin/charts/monthly-pl-chart";
import { CategoryPieChart } from "@/components/admin/charts/category-pie-chart";
import { BudgetActualChart } from "@/components/admin/charts/budget-actual-chart";
import { SuppliesChart } from "@/components/admin/charts/supplies-chart";

export const metadata: Metadata = { title: "Αναφορές" };

export default async function ReportsPage() {
  const overview = await getFinancialOverview();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Αναφορές</h1>
        <p className="text-sm text-muted-foreground">
          Οικονομική εικόνα της επιχείρησης — τελευταίοι 12 μήνες.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Έσοδα vs Έξοδα ανά μήνα</CardTitle>
          <CardDescription>Τελευταίοι 12 μήνες</CardDescription>
        </CardHeader>
        <CardContent>
          <MonthlyPlChart data={overview.monthly} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Έξοδα ανά κατηγορία</CardTitle>
            <CardDescription>Πάγια, μεσιτικά, υλικά κ.λπ.</CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryPieChart data={overview.expensesByCategory} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Πληρωμές ανά κατηγορία</CardTitle>
            <CardDescription>Μάστορες, προμηθευτές, καθαρισμός</CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryPieChart data={overview.paymentsByCategory} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Προϋπολογισμός vs Πραγματικό κόστος</CardTitle>
          <CardDescription>Ανά project (top 8 σε κόστος)</CardDescription>
        </CardHeader>
        <CardContent>
          <BudgetActualChart data={overview.budgetVsActual} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Κόστος προμηθειών ανά υλικό</CardTitle>
          <CardDescription>Top 8 σε συνολικό κόστος</CardDescription>
        </CardHeader>
        <CardContent>
          <SuppliesChart data={overview.suppliesByItem} />
        </CardContent>
      </Card>
    </div>
  );
}
