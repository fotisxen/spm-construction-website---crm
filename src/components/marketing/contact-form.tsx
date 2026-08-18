"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { submitLead } from "@/app/(marketing)/epikoinonia/actions";

const formSchema = z.object({
  name: z.string().min(2, "Συμπλήρωσε το όνομά σου"),
  phone: z.string().optional(),
  email: z.string().email("Μη έγκυρο email").optional().or(z.literal("")),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", phone: "", email: "", message: "" },
  });

  async function onSubmit(values: FormValues) {
    setStatus("idle");
    const result = await submitLead(values);
    if (result.success) {
      setStatus("success");
      form.reset();
    } else {
      setStatus("error");
      setErrorMessage(result.error);
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-ink/10 bg-paper-warm p-8 text-center">
        <p className="font-heading text-xl font-semibold text-ink">
          Ευχαριστούμε!
        </p>
        <p className="mt-2 text-sm text-ink-soft">
          Λάβαμε το μήνυμά σου και θα επικοινωνήσουμε σύντομα.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Όνομα</FormLabel>
              <FormControl>
                <Input placeholder="Το όνομά σου" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Τηλέφωνο</FormLabel>
                <FormControl>
                  <Input placeholder="69XXXXXXXX" {...field} />
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
                  <Input placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Πες μας λίγα λόγια για το ακίνητο</FormLabel>
              <FormControl>
                <Textarea rows={5} placeholder="Τετραγωνικά, τοποθεσία, τι έχεις κατά νου..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {status === "error" && (
          <p className="text-sm text-destructive">{errorMessage}</p>
        )}

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="h-12 w-full rounded-full bg-brand text-brand-foreground hover:opacity-90 sm:w-auto sm:px-8"
        >
          {form.formState.isSubmitting ? "Αποστολή..." : "Αποστολή"}
        </Button>
      </form>
    </Form>
  );
}
