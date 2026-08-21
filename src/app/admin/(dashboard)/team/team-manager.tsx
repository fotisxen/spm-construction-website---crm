"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EntityManager, type Column } from "@/components/admin/entity-manager";
import { MemberForm, type MemberRow } from "@/app/admin/(dashboard)/team/member-form";
import { removeMember } from "@/app/admin/(dashboard)/team/actions";
import { MODULE_LABELS, MODULES } from "@/lib/constants";

export function TeamManager({
  owner,
  members,
}: {
  owner: { fullName: string; email: string };
  members: MemberRow[];
}) {
  const columns: Column<MemberRow>[] = [
    { header: "Όνομα", cell: (row) => row.fullName },
    { header: "Email", cell: (row) => row.email },
    {
      header: "Πρόσβαση",
      cell: (row) => (
        <div className="flex flex-wrap gap-1">
          {MODULES.filter((m) => row.permissions[m] !== "none").map((m) => (
            <Badge key={m} variant={row.permissions[m] === "manage" ? "default" : "secondary"}>
              {MODULE_LABELS[m]}
              {row.permissions[m] === "view" ? " (προβολή)" : ""}
            </Badge>
          ))}
          {MODULES.every((m) => row.permissions[m] === "none") && (
            <span className="text-xs text-muted-foreground">Καμία πρόσβαση</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ιδιοκτήτης</CardTitle>
          <CardDescription>Πλήρης πρόσβαση σε όλα, πάντα.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-medium">{owner.fullName}</p>
          <p className="text-sm text-muted-foreground">{owner.email}</p>
        </CardContent>
      </Card>

      <EntityManager
        title="Μέλη ομάδας"
        description="Άτομα που έχεις προσκαλέσει, με τα δικαιώματά τους ανά ενότητα."
        rows={members}
        columns={columns}
        getRowId={(row) => row.profileId}
        onDelete={(row) => removeMember(row.profileId)}
        renderForm={({ row, onDone }) => <MemberForm row={row} onDone={onDone} />}
        emptyLabel="Δεν έχεις προσκαλέσει ακόμα κανέναν."
      />
    </div>
  );
}
