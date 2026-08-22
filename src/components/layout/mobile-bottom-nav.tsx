"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bike, ClipboardList, Home, UserCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const userNav = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/booking", label: "Book Service", icon: Bike },
  { href: "/dashboard/history", label: "My Services", icon: ClipboardList },
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle2 },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const nav = userNav;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border)] bg-white md:hidden">
      <div className="mx-auto grid h-16 max-w-xl grid-cols-4">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={cn("grid place-items-center text-xs", active ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]")}>
              <Icon className="mb-1 h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
