import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { InstallmentsManager } from "@/app/admin/(dashboard)/payments/[id]/installments-manager";

const eur = new Intl.NumberFormat("el-GR", { style: "currency", currency: "EUR" });

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = { title: "Δόσεις πληρωμής" };

export default async function PaymentDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: payment }, { data: installments }] = await Promise.all([
    supabase.from("payments").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("payment_installments")
      .select("*")
      .eq("payment_id", id)
      .order("installment_number"),
  ]);

  if (!payment) notFound();

  const paidSoFar = (installments ?? [])
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-6">
      <Link
        href="/admin/payments"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Όλες οι πληρωμές
      </Link>

      <div>
        <h1 className="text-2xl font-semibold">{payment.category}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Σύνολο {eur.format(payment.total_amount)} · Πληρώθηκαν {eur.format(paidSoFar)}
        </p>
      </div>

      <InstallmentsManager paymentId={payment.id} rows={installments ?? []} />
    </div>
  );
}
