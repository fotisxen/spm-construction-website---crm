import type { Metadata } from "next";
import { LoginForm } from "@/app/admin/login/login-form";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Σύνδεση",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper-warm px-6">
      <div className="w-full max-w-sm rounded-2xl border border-ink/10 bg-paper p-8 shadow-sm">
        <p className="font-heading text-lg font-semibold text-ink">
          {siteConfig.shortName} — Διαχειριστικό
        </p>
        <p className="mt-1 text-sm text-ink-soft">Σύνδεση για διαχειριστές</p>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
