"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bike, BriefcaseBusiness, ChartColumn, ClipboardList, History, Home, UserCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const userNav = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/bookings/BK-20260820-1024", label: "Bookings", icon: ClipboardList },
  { href: "/booking", label: "My Bikes", icon: Bike },
  { href: "/dashboard/history", label: "History", icon: History },
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle2 },
];

const mechanicNav = [
  { href: "/mechanic", label: "Home", icon: Home },
  { href: "/mechanic/jobs/BK-20260820-1024", label: "Jobs", icon: BriefcaseBusiness },
  { href: "/mechanic/earnings", label: "Earnings", icon: ChartColumn },
  { href: "/mechanic/history", label: "History", icon: History },
  { href: "/mechanic/profile", label: "Profile", icon: UserCircle2 },
];

export function MobileBottomNav({ role }: { role: "user" | "mechanic" }) {
  const pathname = usePathname();
  const nav = role === "user" ? userNav : mechanicNav;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border)] bg-white md:hidden">
      <div className="mx-auto grid h-16 max-w-xl grid-cols-5">
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
