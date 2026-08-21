"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { updateOwnProfile, changeOwnPassword } from "@/app/admin/(dashboard)/profile/actions";

const nameSchema = z.object({ full_name: z.string().min(2, "Συμπλήρωσε όνομα") });
type NameValues = z.infer<typeof nameSchema>;

function NameForm({ fullName }: { fullName: string }) {
  const form = useForm<NameValues>({
    resolver: zodResolver(nameSchema),
    defaultValues: { full_name: fullName },
  });

  async function onSubmit(values: NameValues) {
    const result = await updateOwnProfile(values);
    if (result?.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Ενημερώθηκε");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="full_name"
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
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Αποθήκευση
        </Button>
      </form>
    </Form>
  );
}

const passwordSchema = z
  .object({
    password: z.string().min(8, "Τουλάχιστον 8 χαρακτήρες"),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Οι κωδικοί δεν ταιριάζουν",
    path: ["confirm"],
  });
type PasswordValues = z.infer<typeof passwordSchema>;

function PasswordForm() {
  const form = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", confirm: "" },
  });

  async function onSubmit(values: PasswordValues) {
    const result = await changeOwnPassword({ password: values.password });
    if (result?.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Ο κωδικός άλλαξε");
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Νέος κωδικός</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Επιβεβαίωση κωδικού</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Αλλαγή κωδικού
        </Button>
      </form>
    </Form>
  );
}

export function ProfileForm({ fullName, email }: { fullName: string; email: string }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Στοιχεία</CardTitle>
          <CardDescription>{email}</CardDescription>
        </CardHeader>
        <CardContent>
          <NameForm fullName={fullName} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Κωδικός πρόσβασης</CardTitle>
        </CardHeader>
        <CardContent>
          <PasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
