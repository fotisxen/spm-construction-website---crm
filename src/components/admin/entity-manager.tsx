"use client";

import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";

export type Column<T> = {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
};

type EntityManagerProps<T> = {
  title: string;
  description?: string;
  rows: T[];
  columns: Column<T>[];
  getRowId: (row: T) => string;
  renderForm: (props: { row: T | null; onDone: () => void }) => ReactNode;
  onDelete: (row: T) => Promise<{ error?: string } | void>;
  emptyLabel?: string;
  /** false = read-only view (no create/edit/delete). Defaults to true. */
  canManage?: boolean;
};

export function EntityManager<T>({
  title,
  description,
  rows,
  columns,
  getRowId,
  renderForm,
  onDelete,
  emptyLabel = "Δεν υπάρχουν ακόμα εγγραφές.",
  canManage = true,
}: EntityManagerProps<T>) {
  const [open, setOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<T | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function openCreate() {
    setEditingRow(null);
    setOpen(true);
  }

  function openEdit(row: T) {
    setEditingRow(row);
    setOpen(true);
  }

  async function handleDelete(row: T) {
    setDeletingId(getRowId(row));
    const result = await onDelete(row);
    setDeletingId(null);
    if (result && "error" in result && result.error) {
      toast.error(result.error);
    } else {
      toast.success("Διαγράφηκε");
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {canManage && (
          <Button size="sm" onClick={openCreate}>
            <Plus className="size-4" />
            Νέα εγγραφή
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {emptyLabel}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((col) => (
                    <TableHead key={col.header} className={col.className}>
                      {col.header}
                    </TableHead>
                  ))}
                  {canManage && <TableHead className="w-20 text-right">Ενέργειες</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={getRowId(row)}>
                    {columns.map((col) => (
                      <TableCell key={col.header} className={col.className}>
                        {col.cell(row)}
                      </TableCell>
                    ))}
                    {canManage && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEdit(row)}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger render={<Button variant="ghost" size="icon" />}>
                              <Trash2 className="size-4" />
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Διαγραφή εγγραφής;</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Η ενέργεια δεν αναιρείται.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Άκυρο</AlertDialogCancel>
                                <AlertDialogAction
                                  disabled={deletingId === getRowId(row)}
                                  onClick={() => handleDelete(row)}
                                >
                                  Διαγραφή
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingRow ? "Επεξεργασία" : "Νέα εγγραφή"}
            </DialogTitle>
          </DialogHeader>
          {renderForm({ row: editingRow, onDone: () => setOpen(false) })}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
