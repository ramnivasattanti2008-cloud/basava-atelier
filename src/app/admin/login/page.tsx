"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, ShieldCheck } from "lucide-react";
import { BasavaLogo } from "@/components/brand/BasavaLogo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Incorrect passcode.");
        setLoading(false);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md border border-espresso/15 bg-ivory p-8 sm:p-10 rounded-xs shadow-md space-y-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-1">
            <BasavaLogo symbolSize={38} showWordmark={true} showSubtitle={true} orientation="vertical" />
          </div>
          <span className="eyebrow text-saddle-deep">Atelier Administration</span>
          <h1 className="font-display text-2xl sm:text-3xl text-espresso">Management Portal</h1>
          <p className="text-xs text-charcoal/70">
            Enter the studio passcode to manage product inventory, bespoke commissions, and atelier options.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="adm-pass" className="field-label">Studio Passcode</label>
            <input
              id="adm-pass"
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="••••••••"
              className="field-input font-mono text-center tracking-widest"
              autoFocus
              required
            />
          </div>

          {error && (
            <p className="text-xs text-[#8e2f2a] text-center font-medium bg-linen/50 py-2 border border-[#8e2f2a]/20">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-solid w-full h-11 text-xs"
          >
            {loading ? "Verifying…" : "Access Dashboard"}
          </button>
        </form>

        <div className="border-t border-espresso/12 pt-4 text-center">
          <p className="text-xs text-walnut/70">
            Demo passcode: <code className="font-mono bg-paper px-1.5 py-0.5 border border-espresso/20 text-espresso">basava2026</code>
          </p>
          <div className="mt-4">
            <Link href="/" className="text-xs font-semibold text-espresso hover:underline inline-flex items-center gap-1">
              <ArrowLeft size={12} /> Back to Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

