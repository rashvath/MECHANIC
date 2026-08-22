"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DetailedBillEditor, type DetailedBillPayload } from "@/components/billing/detailed-bill-editor";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAdminBookingById, getAdminToken, saveDetailedBill, type ApiAdminBooking } from "@/lib/api";

export default function AdminBookingBillPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const bookingId = params?.id;
  const hasBookingId = Boolean(bookingId);

  const [booking, setBooking] = useState<ApiAdminBooking | null>(null);
  const [loading, setLoading] = useState(hasBookingId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(hasBookingId ? "" : "Invalid booking id");

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    if (!hasBookingId) {
      return;
    }

    fetchAdminBookingById(bookingId, token)
      .then((data) => {
        setBooking(data);
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Unable to load booking";
        setError(message);
      })
      .finally(() => setLoading(false));
  }, [bookingId, hasBookingId, router]);

  async function handleSave(payload: DetailedBillPayload) {
    const token = getAdminToken();
    if (!token || !bookingId) {
      throw new Error("Admin login required");
    }

    try {
      setSaving(true);
      const updated = await saveDetailedBill(bookingId, token, payload);
      setBooking(updated);
      setError("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unable to save detailed bill";
      setError(message);
      throw new Error(message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl space-y-4 p-4 sm:p-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="mx-auto w-full max-w-4xl p-4 sm:p-6">
        <Card>
          <CardContent className="p-6 text-sm text-[var(--muted-foreground)]">{error}</CardContent>
        </Card>
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-6xl p-4 sm:p-6">
      {error ? (
        <Card className="mb-4">
          <CardContent className="p-4 text-sm text-[var(--danger)]">{error}</CardContent>
        </Card>
      ) : null}
      <DetailedBillEditor
        booking={booking}
        saving={saving}
        onBack={() => router.push("/admin/bookings")}
        onSave={handleSave}
      />
    </div>
  );
}
