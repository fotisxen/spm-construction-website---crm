import { createClient } from "@/lib/supabase/server";

export type MonthlyPoint = { month: string; income: number; expenses: number };
export type CategoryPoint = { category: string; amount: number };
export type ProjectBudgetPoint = { title: string; budget: number; actual: number };
export type SupplyPoint = { item: string; cost: number };

export type FinancialOverview = {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  activeProjectsCount: number;
  monthly: MonthlyPoint[];
  expensesByCategory: CategoryPoint[];
  paymentsByCategory: CategoryPoint[];
  budgetVsActual: ProjectBudgetPoint[];
  suppliesByItem: SupplyPoint[];
};

function monthKey(date: string) {
  return date.slice(0, 7); // YYYY-MM
}

function lastNMonths(n: number): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return months;
}

export async function getFinancialOverview(): Promise<FinancialOverview> {
  const supabase = await createClient();

  const [
    { data: income },
    { data: expenses },
    { data: payments },
    { data: projects },
    { data: supplies },
  ] = await Promise.all([
    supabase.from("income").select("amount, date, category"),
    supabase.from("expenses").select("amount, date, category, project_id"),
    supabase.from("payments").select("total_amount, category, project_id"),
    supabase.from("projects").select("id, title, budget, status"),
    supabase.from("supply_quantities").select("item_name, total_cost"),
  ]);

  const incomeRows = income ?? [];
  const expenseRows = expenses ?? [];
  const paymentRows = payments ?? [];
  const projectRows = projects ?? [];
  const supplyRows = supplies ?? [];

  const totalIncome = incomeRows.reduce((sum, r) => sum + r.amount, 0);
  const totalExpenses =
    expenseRows.reduce((sum, r) => sum + r.amount, 0) +
    paymentRows.reduce((sum, r) => sum + r.total_amount, 0);

  const months = lastNMonths(12);
  const monthly: MonthlyPoint[] = months.map((m) => ({ month: m, income: 0, expenses: 0 }));
  const monthIndex = new Map(months.map((m, i) => [m, i]));

  for (const row of incomeRows) {
    const idx = monthIndex.get(monthKey(row.date));
    if (idx !== undefined) monthly[idx].income += row.amount;
  }
  for (const row of expenseRows) {
    const idx = monthIndex.get(monthKey(row.date));
    if (idx !== undefined) monthly[idx].expenses += row.amount;
  }

  const expensesByCategoryMap = new Map<string, number>();
  for (const row of expenseRows) {
    expensesByCategoryMap.set(
      row.category,
      (expensesByCategoryMap.get(row.category) ?? 0) + row.amount
    );
  }
  const expensesByCategory = Array.from(expensesByCategoryMap, ([category, amount]) => ({
    category,
    amount,
  })).sort((a, b) => b.amount - a.amount);

  const paymentsByCategoryMap = new Map<string, number>();
  for (const row of paymentRows) {
    paymentsByCategoryMap.set(
      row.category,
      (paymentsByCategoryMap.get(row.category) ?? 0) + row.total_amount
    );
  }
  const paymentsByCategory = Array.from(paymentsByCategoryMap, ([category, amount]) => ({
    category,
    amount,
  })).sort((a, b) => b.amount - a.amount);

  const actualByProject = new Map<string, number>();
  for (const row of expenseRows) {
    if (!row.project_id) continue;
    actualByProject.set(row.project_id, (actualByProject.get(row.project_id) ?? 0) + row.amount);
  }
  for (const row of paymentRows) {
    actualByProject.set(
      row.project_id,
      (actualByProject.get(row.project_id) ?? 0) + row.total_amount
    );
  }
  const budgetVsActual: ProjectBudgetPoint[] = projectRows
    .map((p) => ({
      title: p.title,
      budget: p.budget,
      actual: actualByProject.get(p.id) ?? 0,
    }))
    .sort((a, b) => b.actual - a.actual)
    .slice(0, 8);

  const suppliesByItemMap = new Map<string, number>();
  for (const row of supplyRows) {
    suppliesByItemMap.set(
      row.item_name,
      (suppliesByItemMap.get(row.item_name) ?? 0) + (row.total_cost ?? 0)
    );
  }
  const suppliesByItem: SupplyPoint[] = Array.from(suppliesByItemMap, ([item, cost]) => ({
    item,
    cost,
  }))
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 8);

  return {
    totalIncome,
    totalExpenses,
    netProfit: totalIncome - totalExpenses,
    activeProjectsCount: projectRows.filter((p) => p.status === "in_progress").length,
    monthly,
    expensesByCategory,
    paymentsByCategory,
    budgetVsActual,
    suppliesByItem,
  };
}
