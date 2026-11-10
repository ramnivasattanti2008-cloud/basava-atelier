"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Boxes,
  ClipboardList,
  Eye,
  FileSpreadsheet,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  Sparkles,
} from "lucide-react";
import { cx } from "@/lib/format";
import { useDemoStore } from "@/lib/store";

const navItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Inventory", href: "/admin/inventory", icon: Boxes },
  { label: "Orders", href: "/admin/orders", icon: ClipboardList },
  { label: "Custom Requests", href: "/admin/custom-requests", icon: Sparkles },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const settings = useDemoStore((s) => s.settings);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Authenticate on client mount
  useEffect(() => {
    fetch("/api/admin/check")
      .then((r) => r.json())
      .then((data) => {
        if (!data.authenticated) {
          router.replace("/admin/login");
        } else {
          setCheckingAuth(false);
        }
      })
      .catch(() => {
        router.replace("/admin/login");
      });
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <p className="font-display text-xl text-espresso">Verifying admin session…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper text-charcoal flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-espresso/15 bg-ivory flex flex-col justify-between shrink-0">
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-espresso/12">
            <span className="eyebrow text-saddle-deep">Studio Admin</span>
            <h2 className="font-display text-xl text-espresso mt-1">{settings.makerName}</h2>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
              <span className="text-[0.6875rem] text-walnut/80">Local Demo Store Active</span>
            </div>
          </div>

          {/* Nav List */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cx(
                    "flex items-center gap-3 px-3 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors",
                    active
                      ? "bg-espresso text-ivory font-bold shadow-xs"
                      : "text-charcoal/80 hover:bg-linen hover:text-espresso"
                  )}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-espresso/12 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-walnut hover:text-espresso transition-colors"
          >
            <Eye size={15} />
            <span>Open Storefront ↗</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#8e2f2a] hover:bg-linen/50 transition-colors"
          >
            <LogOut size={15} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden p-6 sm:p-10">
        {children}
      </main>
    </div>
  );
}
