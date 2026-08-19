"use client";

import Link from "next/link";
import { Menu, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { href: "#services", label: "Services" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#find-service", label: "Find Service" },
  { href: "/mechanic/login", label: "Become a Mechanic" },
  { href: "/admin/login", label: "Admin Login" },
];

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-heading text-lg font-semibold tracking-tight">Royal mechanics</Link>

        <nav className="hidden items-center gap-6 text-sm text-[var(--muted-foreground)] md:flex">
          {links.map((item) => (
            <a key={item.label} href={item.href} className="transition hover:text-[var(--foreground)]">
              {item.label}
            </a>
          ))}
          <Link href="/mechanic/login" className="transition hover:text-[var(--foreground)]">
            Login
          </Link>
        </nav>

        <div className="hidden md:block">
          <Button asChild>
            <Link href="/booking">Book a Service</Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--border)]" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <button className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--border)]" aria-label="Open profile">
            <UserCircle2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
