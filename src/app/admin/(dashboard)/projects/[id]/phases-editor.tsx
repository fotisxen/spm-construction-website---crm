"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { savePhase } from "@/app/admin/(dashboard)/projects/actions";
import type { Database } from "@/lib/types/database";

type Phase = Database["public"]["Tables"]["project_phases"]["Row"];

type PhaseFormValues = {
  planned_start: string;
  planned_end: string;
  actual_start: string;
  actual_end: string;
  notes: string;
};

function PhaseCard({ phase, canManage }: { phase: Phase; canManage: boolean }) {
  const form = useForm<PhaseFormValues>({
    defaultValues: {
      planned_start: phase.planned_start ?? "",
      planned_end: phase.planned_end ?? "",
      actual_start: phase.actual_start ?? "",
      actual_end: phase.actual_end ?? "",
      notes: phase.notes ?? "",
    },
  });

  async function onSubmit(values: PhaseFormValues) {
    const result = await savePhase({ id: phase.id, ...values });
    if (result?.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Η φάση ενημερώθηκε");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Φάση {phase.phase_number} — {phase.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="space-y-1.5">
              <Label>Έναρξη (προγρ.)</Label>
              <Input type="date" disabled={!canManage} {...form.register("planned_start")} />
            </div>
            <div className="space-y-1.5">
              <Label>Λήξη (προγρ.)</Label>
              <Input type="date" disabled={!canManage} {...form.register("planned_end")} />
            </div>
            <div className="space-y-1.5">
              <Label>Έναρξη (πραγμ.)</Label>
              <Input type="date" disabled={!canManage} {...form.register("actual_start")} />
            </div>
            <div className="space-y-1.5">
              <Label>Λήξη (πραγμ.)</Label>
              <Input type="date" disabled={!canManage} {...form.register("actual_end")} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Σημειώσεις</Label>
            <Textarea rows={2} disabled={!canManage} {...form.register("notes")} />
          </div>
          {canManage && (
            <Button type="submit" size="sm" disabled={form.formState.isSubmitting}>
              Αποθήκευση φάσης
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

export function PhasesEditor({ phases, canManage }: { phases: Phase[]; canManage: boolean }) {
  if (phases.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Δεν υπάρχουν φάσεις — δημιουργήθηκαν αυτόματα κατά τη δημιουργία του
        project.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {phases
        .slice()
        .sort((a, b) => a.phase_number - b.phase_number)
        .map((phase) => (
          <PhaseCard key={phase.id} phase={phase} canManage={canManage} />
        ))}
    </div>
  );
}
