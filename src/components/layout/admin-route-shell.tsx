"use client";

import { usePathname, useRouter } from "next/navigation";
import { authStorageKeys } from "@/mock/auth";
import { AdminLayout } from "@/components/layout/admin-layout";
import { RoleGuard } from "@/components/layout/role-guard";

export function AdminRouteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  function handleLogout() {
    window.localStorage.removeItem(authStorageKeys.admin);
    router.push("/admin/login");
  }

  return (
    <RoleGuard role="admin" loginPath="/admin/login">
      <AdminLayout onLogout={handleLogout}>{children}</AdminLayout>
    </RoleGuard>
  );
}
