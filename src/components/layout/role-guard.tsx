"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authStorageKeys } from "@/mock/auth";
import { Skeleton } from "@/components/ui/skeleton";

type Role = "admin" | "mechanic";

export function RoleGuard({ role, loginPath, children }: { role: Role; loginPath: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPath = pathname === loginPath;
  const key = role === "admin" ? authStorageKeys.admin : authStorageKeys.mechanic;
  const token = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;

  useEffect(() => {
    if (isLoginPath) {
      return;
    }

    if (!token) {
      router.replace(loginPath);
    }
  }, [isLoginPath, loginPath, router, token]);

  if (isLoginPath) {
    return <>{children}</>;
  }

  if (!token) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-4 px-4 py-8 sm:px-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return <>{children}</>;
}
