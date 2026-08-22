"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  ["Dashboard", "/admin"],
  ["Users", "/admin/users"],
  ["Bookings", "/admin/bookings"],
  ["Services", "/admin/services"],
  ["Service Areas", "/admin/areas"],
  ["Reviews", "/admin/reviews"],
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-64 border-r border-[var(--border)] bg-[var(--card)]/95 p-4 backdrop-blur lg:block">
      <p className="font-heading text-xl font-semibold tracking-tight text-[var(--foreground)]">Royal Mechanic Admin</p>
      <nav className="mt-5 space-y-1">
        {links.map(([label, href]) => (
          <Link
            key={label}
            href={href}
            className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
              pathname === href
                ? "bg-[var(--primary-soft)] text-[var(--primary)] ring-1 ring-[var(--border)]"
                : "text-[var(--foreground)]/80 hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
