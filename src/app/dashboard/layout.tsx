"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { authStorageKeys } from "@/mock/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/history", label: "My Services" },
    { href: "/dashboard/profile", label: "Profile" },
  ];

  function handleLogout() {
    window.localStorage.removeItem(authStorageKeys.user);
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-[var(--muted)]/40">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--card)]/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-heading font-semibold text-[var(--foreground)]">
            <Image src="/images/logo.png" alt="Royal Mechanic logo" width={46} height={46} className="rounded-md object-contain" priority />
            <span>Royal Mechanic</span>
          </Link>

          <nav className="hidden items-center gap-4 text-sm md:flex">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "transition",
                    isActive ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="secondary" className="hidden sm:inline-flex">
              <Link href="/">Home</Link>
            </Button>
            <Button asChild size="sm" variant="secondary" className="hidden sm:inline-flex">
              <Link href="/booking">Book Service</Link>
            </Button>
            <Button size="sm" variant="secondary" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </header>
      {children}
      <MobileBottomNav />
    </div>
  );
}
