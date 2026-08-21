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
import { saveInstallment } from "@/app/admin/(dashboard)/payments/actions";
import type { Database } from "@/lib/types/database";

type Installment = Database["public"]["Tables"]["payment_installments"]["Row"];

const schema = z.object({
  installment_number: z.coerce.number().int().positive(),
  amount: z.coerce.number().positive("Το ποσό πρέπει να είναι θετικό"),
  due_date: z.string().optional(),
  paid_date: z.string().optional(),
  status: z.enum(["pending", "paid"]),
});

type FormValues = z.infer<typeof schema>;

export function InstallmentForm({
  row,
  paymentId,
  nextNumber,
  onDone,
}: {
  row: Installment | null;
  paymentId: string;
  nextNumber: number;
  onDone: () => void;
}) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      installment_number: row?.installment_number ?? nextNumber,
      amount: row?.amount ?? 0,
      due_date: row?.due_date ?? "",
      paid_date: row?.paid_date ?? "",
      status: row?.status ?? "pending",
    },
  });

  async function onSubmit(values: FormValues) {
    const result = await saveInstallment({
      ...values,
      id: row?.id,
      payment_id: paymentId,
    });
    if (result?.error) {
      toast.error(result.error);
      return;
    }
    toast.success(row ? "Ενημερώθηκε" : "Προστέθηκε δόση");
    onDone();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="installment_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Αρ. δόσης</FormLabel>
                <FormControl>
                  <Input type="number" {...field} value={field.value as number} />
                </FormControl>
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
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="due_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Προθεσμία</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paid_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ημ. πληρωμής</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
                  { value: "paid", label: "Πληρώθηκε" },
                ]}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pending">Εκκρεμεί</SelectItem>
                  <SelectItem value="paid">Πληρώθηκε</SelectItem>
                </SelectContent>
              </Select>
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
