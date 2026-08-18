"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const paymentSchema = z.object({
  id: z.string().uuid().optional(),
  project_id: z.string().uuid("Επίλεξε project"),
  contact_id: z.string().uuid().optional().or(z.literal("")),
  category: z.string().min(2, "Συμπλήρωσε κατηγορία"),
  total_amount: z.coerce.number().positive("Το ποσό πρέπει να είναι θετικό"),
  payment_type: z.enum(["lump_sum", "installments"]),
  date_agreed: z.string().optional().or(z.literal("")),
  status: z.enum(["pending", "partial", "paid"]),
  notes: z.string().optional(),
});

export type PaymentInput = z.infer<typeof paymentSchema>;

export async function savePayment(input: PaymentInput) {
  const parsed = paymentSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Μη έγκυρα στοιχεία" };
  }
  const { id, ...values } = parsed.data;
  const supabase = await createClient();

  const payload = {
    ...values,
    contact_id: values.contact_id || null,
    date_agreed: values.date_agreed || null,
    notes: values.notes || null,
  };

  const { error } = id
    ? await supabase.from("payments").update(payload).eq("id", id)
    : await supabase.from("payments").insert(payload);

  if (error) return { error: error.message };
  revalidatePath("/admin/payments");
  revalidatePath("/admin/reports");
  return {};
}

export async function deletePayment(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("payments").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/payments");
  revalidatePath("/admin/reports");
  return {};
}

const installmentSchema = z.object({
  id: z.string().uuid().optional(),
  payment_id: z.string().uuid(),
  installment_number: z.coerce.number().int().positive(),
  amount: z.coerce.number().positive("Το ποσό πρέπει να είναι θετικό"),
  due_date: z.string().optional().or(z.literal("")),
  paid_date: z.string().optional().or(z.literal("")),
  status: z.enum(["pending", "paid"]),
});

export type InstallmentInput = z.infer<typeof installmentSchema>;

export async function saveInstallment(input: InstallmentInput) {
  const parsed = installmentSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Μη έγκυρα στοιχεία" };
  }
  const { id, ...values } = parsed.data;
  const supabase = await createClient();

  const payload = {
    ...values,
    due_date: values.due_date || null,
    paid_date: values.paid_date || null,
  };

  const { error } = id
    ? await supabase.from("payment_installments").update(payload).eq("id", id)
    : await supabase.from("payment_installments").insert(payload);

  if (error) return { error: error.message };
  revalidatePath(`/admin/payments/${values.payment_id}`);
  return {};
}

export async function deleteInstallment(id: string, paymentId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("payment_installments").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath(`/admin/payments/${paymentId}`);
  return {};
}
