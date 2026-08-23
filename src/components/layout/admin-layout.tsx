"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { AdminSidebar } from "@/components/sidebar/admin-sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const mobileAdminLinks = [
  ["Dashboard", "/admin"],
  ["Users", "/admin/users"],
  ["Bookings", "/admin/bookings"],
  ["Services", "/admin/services"],
  ["Service Areas", "/admin/areas"],
  ["Reviews", "/admin/reviews"],
] as const;

export function AdminLayout({ children, onLogout }: { children: React.ReactNode; onLogout: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-(--muted)/40 lg:flex">
      <AdminSidebar />
      <div className="flex-1">
        <header className="sticky top-0 z-30 border-b border-(--border) bg-(--card)/95 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-325 items-center gap-3 px-4 sm:px-6">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-lg border border-(--border) bg-(--muted) text-foreground lg:hidden"
              aria-label="Toggle admin menu"
              onClick={() => setMobileMenuOpen((value) => !value)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-(--muted-foreground)" />
              <Input className="pl-9" placeholder="Search" />
            </div>
            <div className="rounded-lg border border-(--border) bg-(--muted) px-3 py-2 text-sm text-foreground">Admin</div>
            <Button size="sm" variant="secondary" onClick={onLogout}>Logout</Button>
          </div>
          {mobileMenuOpen ? (
            <nav className="border-t border-(--border) bg-(--card) px-4 py-3 lg:hidden">
              <div className="grid gap-2">
                {mobileAdminLinks.map(([label, href]) => (
                  <Link
                    key={href}
                    href={href}
                    className="rounded-lg border border-(--border) bg-(--muted) px-3 py-2 text-sm text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </nav>
          ) : null}
        </header>
        <main className="enter-fade-up mx-auto w-full max-w-325 px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
