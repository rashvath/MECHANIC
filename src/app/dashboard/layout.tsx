"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authStorageKeys } from "@/mock/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const token = window.localStorage.getItem(authStorageKeys.user);

      if (!token) {
        setIsAuthorized(false);
        setIsChecking(false);
        router.replace("/login");
        return;
      }

      setIsAuthorized(true);
      setIsChecking(false);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [router]);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/history", label: "My Services" },
    { href: "/dashboard/profile", label: "Profile" },
  ];

  function handleLogout() {
    window.localStorage.removeItem(authStorageKeys.user);
    router.push("/login");
  }

  if (isChecking || !isAuthorized) {
    return (
      <div className="mx-auto w-full max-w-6xl space-y-4 px-4 py-8 sm:px-6">
        <Skeleton className="h-10 w-52" />
        <Skeleton className="h-52 w-full" />
        <Skeleton className="h-52 w-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--muted)/40">
      <header className="sticky top-0 z-30 border-b border-(--border) bg-(--card)/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-heading font-semibold text-foreground">
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
                    isActive ? "text-foreground" : "text-(--muted-foreground) hover:text-foreground"
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
