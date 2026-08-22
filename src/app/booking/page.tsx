"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookingFlow } from "@/components/booking/booking-flow";
import { getUserToken } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function BookingPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const token = getUserToken();

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

  if (isChecking || !isAuthorized) {
    return (
      <div className="mx-auto w-full max-w-6xl space-y-4 px-4 py-8 sm:px-6">
        <Skeleton className="h-10 w-52" />
        <Skeleton className="h-52 w-full" />
        <Skeleton className="h-52 w-full" />
      </div>
    );
  }

  return <BookingFlow />;
}
