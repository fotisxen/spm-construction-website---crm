"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { saveIncome } from "@/app/admin/(dashboard)/income/actions";
import { INCOME_CATEGORIES } from "@/lib/constants";
import type { Database } from "@/lib/types/database";

type Income = Database["public"]["Tables"]["income"]["Row"];
type ProjectOption = { id: string; title: string };

const NO_PROJECT = "none";

const schema = z.object({
  project_id: z.string(),
  category: z.enum(INCOME_CATEGORIES),
  amount: z.coerce.number().positive("Το ποσό πρέπει να είναι θετικό"),
  date: z.string().min(1, "Συμπλήρωσε ημερομηνία"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function IncomeForm({
  row,
  projects,
  onDone,
}: {
  row: Income | null;
  projects: ProjectOption[];
  onDone: () => void;
}) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      project_id: row?.project_id ?? NO_PROJECT,
      category: row?.category ?? "άλλο",
      amount: row?.amount ?? 0,
      date: row?.date ?? new Date().toISOString().slice(0, 10),
      notes: row?.notes ?? "",
    },
  });

  async function onSubmit(values: FormValues) {
    const result = await saveIncome({
      ...values,
      project_id: values.project_id === NO_PROJECT ? "" : values.project_id,
      id: row?.id,
    });
    if (result?.error) {
      toast.error(result.error);
      return;
    }
    toast.success(row ? "Ενημερώθηκε" : "Δημιουργήθηκε");
    onDone();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="project_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                items={[
                  { value: NO_PROJECT, label: "Γενικό (κανένα project)" },
                  ...projects.map((p) => ({ value: p.id, label: p.title })),
                ]}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={NO_PROJECT}>Γενικό (κανένα project)</SelectItem>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Κατηγορία</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  items={INCOME_CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {INCOME_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ποσό (€)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} value={field.value as number} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ημερομηνία</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Σημειώσεις</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          Αποθήκευση
        </Button>
      </form>
    </Form>
  );
}
