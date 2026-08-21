"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { saveSupply } from "@/app/admin/(dashboard)/supplies/actions";
import type { Database } from "@/lib/types/database";

type Supply = Database["public"]["Tables"]["supply_quantities"]["Row"];
type Option = { id: string; label: string };

const NONE = "none";

const schema = z.object({
  project_id: z.string().min(1, "Επίλεξε project"),
  contact_id: z.string(),
  item_name: z.string().min(2, "Συμπλήρωσε το υλικό"),
  quantity: z.coerce.number().positive("Η ποσότητα πρέπει να είναι θετική"),
  unit: z.string().min(1, "Συμπλήρωσε μονάδα"),
  unit_cost: z.string().optional(),
  date: z.string().min(1, "Συμπλήρωσε ημερομηνία"),
});

type FormValues = z.infer<typeof schema>;

export function SupplyForm({
  row,
  projects,
  contacts,
  onDone,
}: {
  row: Supply | null;
  projects: Option[];
  contacts: Option[];
  onDone: () => void;
}) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      project_id: row?.project_id ?? "",
      contact_id: row?.contact_id ?? NONE,
      item_name: row?.item_name ?? "",
      quantity: row?.quantity ?? 1,
      unit: row?.unit ?? "τεμ",
      unit_cost: row?.unit_cost != null ? String(row.unit_cost) : "",
      date: row?.date ?? new Date().toISOString().slice(0, 10),
    },
  });

  async function onSubmit(values: FormValues) {
    const result = await saveSupply({
      ...values,
      contact_id: values.contact_id === NONE ? "" : values.contact_id,
      unit_cost: values.unit_cost ? Number(values.unit_cost) : undefined,
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
                items={projects.map((p) => ({ value: p.id, label: p.label }))}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Επίλεξε project" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.label}
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
          name="contact_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Προμηθευτής (προαιρετικό)</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                items={[
                  { value: NONE, label: "—" },
                  ...contacts.map((c) => ({ value: c.id, label: c.label })),
                ]}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={NONE}>—</SelectItem>
                  {contacts.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.label}
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
          name="item_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Υλικό</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ποσότητα</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} value={field.value as number} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Μονάδα</FormLabel>
                <FormControl>
                  <Input placeholder="τεμ / m² / kg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="unit_cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Κόστος/μονάδα (€)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
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
