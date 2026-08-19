"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authStorageKeys } from "@/mock/auth";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { RoleGuard } from "@/components/layout/role-guard";
import { Button } from "@/components/ui/button";

export function MechanicRouteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/mechanic/login") {
    return <>{children}</>;
  }

  function handleLogout() {
    window.localStorage.removeItem(authStorageKeys.mechanic);
    router.push("/mechanic/login");
  }

  return (
    <RoleGuard role="mechanic" loginPath="/mechanic/login">
      <div className="min-h-screen bg-[var(--muted)]/40">
        <header className="border-b border-[var(--border)] bg-white">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="font-heading font-semibold">Royal mechanics Mechanic</Link>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" onClick={handleLogout}>Logout</Button>
            </div>
          </div>
        </header>
        <div className="enter-fade-up">{children}</div>
        <MobileBottomNav role="mechanic" />
      </div>
    </RoleGuard>
  );
}
