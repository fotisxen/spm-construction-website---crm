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
import { saveProperty } from "@/app/admin/(dashboard)/properties/actions";
import type { Database } from "@/lib/types/database";

type Property = Database["public"]["Tables"]["properties"]["Row"];

const schema = z.object({
  name: z.string().min(2, "Συμπλήρωσε όνομα"),
  address: z.string().min(2, "Συμπλήρωσε διεύθυνση"),
  power_supply_number: z.string().optional(),
  water_supply_number: z.string().optional(),
  sqm: z.string().optional(),
  map_url: z.string().url("Μη έγκυρο URL").optional().or(z.literal("")),
  acquisition_type: z.enum(["flip", "client_owned"]),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function PropertyForm({
  row,
  onDone,
}: {
  row: Property | null;
  onDone: () => void;
}) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: row?.name ?? "",
      address: row?.address ?? "",
      power_supply_number: row?.power_supply_number ?? "",
      water_supply_number: row?.water_supply_number ?? "",
      sqm: row?.sqm != null ? String(row.sqm) : "",
      map_url: row?.map_url ?? "",
      acquisition_type: row?.acquisition_type ?? "flip",
      notes: row?.notes ?? "",
    },
  });

  async function onSubmit(values: FormValues) {
    const result = await saveProperty({
      ...values,
      sqm: values.sqm ? Number(values.sqm) : undefined,
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Όνομα ακινήτου</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Διεύθυνση</FormLabel>
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
            name="power_supply_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Αρ. παροχής ρεύματος</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="water_supply_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Αρ. παροχής νερού</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="sqm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Τετραγωνικά</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="acquisition_type"
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
                    <SelectItem value="flip">Flip (αγορά/πώληση)</SelectItem>
                    <SelectItem value="client_owned">Ακίνητο πελάτη</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="map_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Σύνδεσμος χάρτη</FormLabel>
              <FormControl>
                <Input placeholder="https://maps.google.com/..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
