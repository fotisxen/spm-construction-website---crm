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
import { saveContact } from "@/app/admin/(dashboard)/contacts/actions";
import { CONTACT_CATEGORIES } from "@/lib/constants";
import type { Database } from "@/lib/types/database";

type Contact = Database["public"]["Tables"]["contacts"]["Row"];

const schema = z.object({
  name: z.string().min(2, "Συμπλήρωσε όνομα"),
  category: z.enum(CONTACT_CATEGORIES),
  phone: z.string().optional(),
  email: z.string().email("Μη έγκυρο email").optional().or(z.literal("")),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm({
  row,
  onDone,
}: {
  row: Contact | null;
  onDone: () => void;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: row?.name ?? "",
      category: row?.category ?? "προμηθευτής",
      phone: row?.phone ?? "",
      email: row?.email ?? "",
      notes: row?.notes ?? "",
    },
  });

  async function onSubmit(values: FormValues) {
    const result = await saveContact({ ...values, id: row?.id });
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Όνομα</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ειδικότητα</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                items={CONTACT_CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CONTACT_CATEGORIES.map((cat) => (
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
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Τηλέφωνο</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
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
