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
import { inviteMember, updateMember } from "@/app/admin/(dashboard)/team/actions";
import { MODULES, MODULE_LABELS, ACCESS_LEVELS, ACCESS_LEVEL_LABELS } from "@/lib/constants";
import type { AccessLevel, ModuleName } from "@/lib/types/database";

export type MemberRow = {
  profileId: string;
  fullName: string;
  email: string;
  permissions: Record<ModuleName, AccessLevel>;
};

const DEFAULT_PERMISSIONS = Object.fromEntries(
  MODULES.map((m) => [m, "view" as AccessLevel])
) as Record<ModuleName, AccessLevel>;

const schema = z.object({
  email: z.string().email("Μη έγκυρο email").optional(),
  full_name: z.string().min(2, "Συμπλήρωσε όνομα"),
  permissions: z.record(z.enum(MODULES), z.enum(ACCESS_LEVELS)),
});

type FormValues = z.infer<typeof schema>;

export function MemberForm({
  row,
  onDone,
}: {
  row: MemberRow | null;
  onDone: () => void;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: row?.email ?? "",
      full_name: row?.fullName ?? "",
      permissions: row?.permissions ?? DEFAULT_PERMISSIONS,
    },
  });

  async function onSubmit(values: FormValues) {
    const result = row
      ? await updateMember({
          profileId: row.profileId,
          full_name: values.full_name,
          permissions: values.permissions,
        })
      : await inviteMember({
          email: values.email ?? "",
          full_name: values.full_name,
          permissions: values.permissions,
        });

    if (result?.error) {
      toast.error(result.error);
      return;
    }
    toast.success(row ? "Ενημερώθηκε" : "Στάλθηκε πρόσκληση με email");
    onDone();
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
        {!row && (
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="member@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="space-y-2">
          <p className="text-sm font-medium">Δικαιώματα ανά ενότητα</p>
          <div className="rounded-lg border divide-y">
            {MODULES.map((module) => (
              <FormField
                key={module}
                control={form.control}
                name={`permissions.${module}`}
                render={({ field }) => (
                  <div className="flex items-center justify-between gap-4 px-3 py-2">
                    <span className="text-sm">{MODULE_LABELS[module]}</span>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      items={ACCESS_LEVELS.map((lvl) => ({
                        value: lvl,
                        label: ACCESS_LEVEL_LABELS[lvl],
                      }))}
                    >
                      <SelectTrigger size="sm" className="w-44">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ACCESS_LEVELS.map((lvl) => (
                          <SelectItem key={lvl} value={lvl}>
                            {ACCESS_LEVEL_LABELS[lvl]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
            ))}
          </div>
        </div>

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          {row ? "Αποθήκευση" : "Αποστολή πρόσκλησης"}
        </Button>
      </form>
    </Form>
  );
}
