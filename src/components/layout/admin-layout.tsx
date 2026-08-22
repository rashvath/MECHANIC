"use client";

import { Search } from "lucide-react";
import { AdminSidebar } from "@/components/sidebar/admin-sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AdminLayout({ children, onLogout }: { children: React.ReactNode; onLogout: () => void }) {
  return (
    <div className="min-h-screen bg-[var(--muted)]/40 lg:flex">
      <AdminSidebar />
      <div className="flex-1">
        <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--card)]/95 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-[1300px] items-center gap-3 px-4 sm:px-6">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-[var(--muted-foreground)]" />
              <Input className="pl-9" placeholder="Search" />
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm text-[var(--foreground)]">Admin</div>
            <Button size="sm" variant="secondary" onClick={onLogout}>Logout</Button>
          </div>
        </header>
        <main className="enter-fade-up mx-auto w-full max-w-[1300px] px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
