"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { saveProject } from "@/app/admin/(dashboard)/projects/actions";
import type { Database } from "@/lib/types/database";

type Project = Database["public"]["Tables"]["projects"]["Row"];
type Option = { id: string; label: string };

const schema = z.object({
  property_id: z.string().min(1, "Επίλεξε ακίνητο"),
  title: z.string().min(2, "Συμπλήρωσε τίτλο"),
  scope_description: z.string().optional(),
  project_type: z.enum(["flip", "client_owned"]),
  scope_size: z.enum(["full", "partial"]),
  budget: z.coerce.number().nonnegative(),
  start_date: z.string().optional(),
  end_date_planned: z.string().optional(),
  end_date_actual: z.string().optional(),
  status: z.enum(["planning", "in_progress", "completed"]),
  show_on_website: z.boolean(),
  public_summary: z.string().optional(),
  cover_image_url: z.string().url("Μη έγκυρο URL").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

export function ProjectForm({
  row,
  properties,
  onDone,
}: {
  row: Project | null;
  properties: Option[];
  onDone: () => void;
}) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      property_id: row?.property_id ?? "",
      title: row?.title ?? "",
      scope_description: row?.scope_description ?? "",
      project_type: row?.project_type ?? "flip",
      scope_size: row?.scope_size ?? "full",
      budget: row?.budget ?? 0,
      start_date: row?.start_date ?? "",
      end_date_planned: row?.end_date_planned ?? "",
      end_date_actual: row?.end_date_actual ?? "",
      status: row?.status ?? "planning",
      show_on_website: row?.show_on_website ?? false,
      public_summary: row?.public_summary ?? "",
      cover_image_url: row?.cover_image_url ?? "",
    },
  });

  async function onSubmit(values: FormValues) {
    const result = await saveProject({ ...values, id: row?.id });
    if (result?.error) {
      toast.error(result.error);
      return;
    }
    toast.success(row ? "Ενημερώθηκε" : "Δημιουργήθηκε — οι 3 φάσεις προστέθηκαν αυτόματα");
    onDone();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="property_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ακίνητο</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Επίλεξε ακίνητο" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {properties.map((p) => (
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Τίτλος project</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="project_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Τύπος</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="flip">Flip</SelectItem>
                    <SelectItem value="client_owned">Ακίνητο πελάτη</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="scope_size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Έκταση</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="full">Πλήρης</SelectItem>
                    <SelectItem value="partial">Μερική (π.χ. μπάνιο)</SelectItem>
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
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Προϋπολογισμός (€)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} value={field.value as number} />
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
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="planning">Σχεδιασμός</SelectItem>
                    <SelectItem value="in_progress">Σε εξέλιξη</SelectItem>
                    <SelectItem value="completed">Ολοκληρωμένο</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Έναρξη</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="end_date_planned"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Λήξη (προγρ.)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="end_date_actual"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Λήξη (πραγμ.)</FormLabel>
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
          name="scope_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Αντικείμενο έργου</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="rounded-lg border border-ink/10 p-4">
          <FormField
            control={form.control}
            name="show_on_website"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between gap-4">
                <div>
                  <FormLabel>Εμφάνιση στο δημόσιο portfolio</FormLabel>
                  <p className="text-xs text-muted-foreground">
                    Μόνο public_summary/εικόνα γίνονται ορατά — τα οικονομικά
                    στοιχεία παραμένουν ιδιωτικά.
                  </p>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="public_summary"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Δημόσια περιγραφή</FormLabel>
                <FormControl>
                  <Textarea rows={2} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cover_image_url"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Εικόνα εξωφύλλου (URL)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
