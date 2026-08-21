import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { requireModuleAccess } from "@/lib/auth/access";
import { PhasesEditor } from "@/app/admin/(dashboard)/projects/[id]/phases-editor";

const eur = new Intl.NumberFormat("el-GR", { style: "currency", currency: "EUR" });

const STATUS_LABEL = {
  planning: "Σχεδιασμός",
  in_progress: "Σε εξέλιξη",
  completed: "Ολοκληρωμένο",
} as const;

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = { title: "Project" };

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const access = await requireModuleAccess("projects");
  const supabase = await createClient();

  const [{ data: project }, { data: phases }, { data: payments }, { data: expenses }] =
    await Promise.all([
      supabase.from("projects").select("*").eq("id", id).maybeSingle(),
      supabase.from("project_phases").select("*").eq("project_id", id),
      supabase.from("payments").select("total_amount").eq("project_id", id),
      supabase.from("expenses").select("amount").eq("project_id", id),
    ]);

  if (!project) notFound();

  const { data: propertyInfo } = await supabase
    .from("properties")
    .select("name, address")
    .eq("id", project.property_id)
    .maybeSingle();

  const paymentsTotal = (payments ?? []).reduce((sum, p) => sum + p.total_amount, 0);
  const expensesTotal = (expenses ?? []).reduce((sum, e) => sum + e.amount, 0);
  const actualCost = paymentsTotal + expensesTotal;

  return (
    <div className="space-y-6">
      <Link
        href="/admin/projects"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Όλα τα projects
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{project.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {propertyInfo?.name} — {propertyInfo?.address}
          </p>
        </div>
        <Badge variant="secondary">{STATUS_LABEL[project.status]}</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Προϋπολογισμός
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {eur.format(project.budget)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Πραγματικό κόστος
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {eur.format(actualCost)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Διαφορά
            </CardTitle>
          </CardHeader>
          <CardContent
            className={`text-2xl font-semibold ${
              actualCost > project.budget ? "text-destructive" : ""
            }`}
          >
            {eur.format(project.budget - actualCost)}
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Φάσεις & χρονοδιάγραμμα</h2>
        <PhasesEditor phases={phases ?? []} canManage={access.permissions.projects === "manage"} />
      </div>
    </div>
  );
}
