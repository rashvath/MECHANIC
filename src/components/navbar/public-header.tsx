"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/#home", label: "Home" },
  { href: "/#services", label: "Services" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#zones", label: "Service Zones" },
  { href: "/admin/login", label: "Admin Login" },
];

export function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-(--border) bg-[rgba(13,15,19,0.94)] backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-heading text-lg font-semibold tracking-tight text-foreground">
          <Image src="/images/logo.png" alt="Royal Mechanic logo" width={50} height={50} className="rounded-md object-contain" priority />
          <span>Royal Mechanic</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-(--muted-foreground) md:flex">
          {links.map((item) => (
            <a key={item.label} href={item.href} className="transition hover:text-foreground">
              {item.label}
            </a>
          ))}
          <Link href="/dashboard/history" className="transition hover:text-foreground">My Services</Link>
        </nav>

        <div className="hidden md:block">
          <Button asChild>
            <Link href="/booking">Book a Service</Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            className="grid h-10 w-10 place-items-center rounded-lg border border-(--border)"
            aria-label="Open menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/dashboard/history" className="grid h-10 w-10 place-items-center rounded-lg border border-(--border)" aria-label="Open profile">
            <UserCircle2 className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-(--border) bg-(--card) px-4 py-3 md:hidden">
          <nav className="space-y-2 text-sm">
            {links.map((item) => (
              <a
                key={`mobile-${item.label}`}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-(--muted-foreground) transition hover:bg-(--muted) hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Link
              href="/dashboard/history"
              className="block rounded-lg px-3 py-2 text-(--muted-foreground) transition hover:bg-(--muted) hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              My Services
            </Link>
          </nav>
          <div className="mt-3">
            <Button asChild className="w-full">
              <Link href="/booking" onClick={() => setMobileOpen(false)}>Book a Service</Link>
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
