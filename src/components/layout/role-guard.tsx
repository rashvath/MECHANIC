"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authStorageKeys } from "@/mock/auth";
import { Skeleton } from "@/components/ui/skeleton";

export function RoleGuard({ loginPath, children }: { loginPath: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPath = pathname === loginPath;
  const key = authStorageKeys.admin;
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (isLoginPath) {
      return;
    }

    const timer = window.setTimeout(() => {
      const token = window.localStorage.getItem(key);

      if (token) {
        setIsAuthorized(true);
        setIsCheckingAuth(false);
        return;
      }

      setIsAuthorized(false);
      setIsCheckingAuth(false);
      router.replace(loginPath);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isLoginPath, key, loginPath, router]);

  if (isLoginPath) {
    return <>{children}</>;
  }

  if (isCheckingAuth || !isAuthorized) {
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
