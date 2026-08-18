"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { EXPENSE_CATEGORIES } from "@/lib/constants";

const expenseSchema = z.object({
  id: z.string().uuid().optional(),
  project_id: z.string().uuid().optional().or(z.literal("")),
  category: z.enum(EXPENSE_CATEGORIES),
  amount: z.coerce.number().positive("Το ποσό πρέπει να είναι θετικό"),
  date: z.string().min(1, "Συμπλήρωσε ημερομηνία"),
  notes: z.string().optional(),
});

export type ExpenseInput = z.infer<typeof expenseSchema>;

export async function saveExpense(input: ExpenseInput) {
  const parsed = expenseSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Μη έγκυρα στοιχεία" };
  }
  const { id, ...values } = parsed.data;
  const supabase = await createClient();

  const payload = {
    ...values,
    project_id: values.project_id || null,
    notes: values.notes || null,
  };

  const { error } = id
    ? await supabase.from("expenses").update(payload).eq("id", id)
    : await supabase.from("expenses").insert(payload);

  if (error) return { error: error.message };
  revalidatePath("/admin/expenses");
  revalidatePath("/admin/reports");
  return {};
}

export async function deleteExpense(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("expenses").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/expenses");
  revalidatePath("/admin/reports");
  return {};
}
