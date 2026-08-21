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
import { savePayment } from "@/app/admin/(dashboard)/payments/actions";
import type { Database } from "@/lib/types/database";

type Payment = Database["public"]["Tables"]["payments"]["Row"];
type Option = { id: string; label: string };

const NONE = "none";

const schema = z.object({
  project_id: z.string().min(1, "Επίλεξε project"),
  contact_id: z.string(),
  category: z.string().min(2, "Συμπλήρωσε κατηγορία"),
  total_amount: z.coerce.number().positive("Το ποσό πρέπει να είναι θετικό"),
  payment_type: z.enum(["lump_sum", "installments"]),
  date_agreed: z.string().optional(),
  status: z.enum(["pending", "partial", "paid"]),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function PaymentForm({
  row,
  projects,
  contacts,
  onDone,
}: {
  row: Payment | null;
  projects: Option[];
  contacts: Option[];
  onDone: () => void;
}) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      project_id: row?.project_id ?? "",
      contact_id: row?.contact_id ?? NONE,
      category: row?.category ?? "",
      total_amount: row?.total_amount ?? 0,
      payment_type: row?.payment_type ?? "lump_sum",
      date_agreed: row?.date_agreed ?? "",
      status: row?.status ?? "pending",
      notes: row?.notes ?? "",
    },
  });

  async function onSubmit(values: FormValues) {
    const result = await savePayment({
      ...values,
      contact_id: values.contact_id === NONE ? "" : values.contact_id,
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
        <div className="grid grid-cols-2 gap-4">
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
                      <SelectValue placeholder="Επίλεξε" />
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
                <FormLabel>Συνεργάτης</FormLabel>
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
        </div>
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Κατηγορία εργασίας</FormLabel>
              <FormControl>
                <Input placeholder="π.χ. υδραυλικός, πλακάκια..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="total_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Συνολικό ποσό (€)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} value={field.value as number} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="payment_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Τρόπος πληρωμής</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  items={[
                    { value: "lump_sum", label: "Με αποκοπή (εφάπαξ)" },
                    { value: "installments", label: "Με δόσεις" },
                  ]}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="lump_sum">Με αποκοπή (εφάπαξ)</SelectItem>
                    <SelectItem value="installments">Με δόσεις</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date_agreed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ημερομηνία συμφωνίας</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Κατάσταση</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  items={[
                    { value: "pending", label: "Εκκρεμεί" },
                    { value: "partial", label: "Μερική" },
                    { value: "paid", label: "Εξοφλήθηκε" },
                  ]}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pending">Εκκρεμεί</SelectItem>
                    <SelectItem value="partial">Μερική</SelectItem>
                    <SelectItem value="paid">Εξοφλήθηκε</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
