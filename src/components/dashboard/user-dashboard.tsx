"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { downloadInvoiceHtml, fetchMyBookings, getUserToken, type ApiUserBooking } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const quickActions = [
  { label: "Book Service", href: "/booking" },
  { label: "My Services", href: "/dashboard/history" },
  { label: "Support", href: "/dashboard/profile" },
];

function statusLabel(status: ApiUserBooking["status"]) {
  if (status === "paid") return "completed";
  return status.replaceAll("_", " ");
}

function statusVariant(status: ApiUserBooking["status"]): "default" | "success" | "warning" | "neutral" {
  if (status === "paid") return "success";
  if (status === "rejected") return "warning";
  if (status === "pending_approval" || status === "payment_pending") return "neutral";
  return "default";
}

export function UserDashboard() {
  const token = getUserToken();
  const [bookings, setBookings] = useState<ApiUserBooking[]>([]);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState(token ? "" : "Please login as customer.");
  const [downloadingId, setDownloadingId] = useState("");

  useEffect(() => {
    if (!token) {
      return;
    }

    fetchMyBookings(token)
      .then((data) => setBookings(data))
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Unable to load dashboard data";
        setError(message);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const upcoming = useMemo(
    () => bookings.find((booking) => booking.status !== "paid" && booking.status !== "rejected") || null,
    [bookings]
  );

  const recentServices = useMemo(() => bookings.slice(0, 8), [bookings]);

  async function handleInvoiceDownload(bookingId: string) {
    if (!token) {
      setError("Please login to download invoices.");
      return;
    }

    try {
      setDownloadingId(bookingId);
      await downloadInvoiceHtml(bookingId, token);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unable to download invoice";
      setError(message);
    } finally {
      setDownloadingId("");
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5 px-4 pb-20 pt-6 sm:px-6 md:pb-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[var(--muted-foreground)]">Customer Dashboard</p>
          <h1 className="font-heading text-2xl font-semibold">Ready for your next ride?</h1>
          <p className="text-sm text-[var(--muted-foreground)]">Track bookings, paid amount, and invoices.</p>
        </div>
        <Button asChild>
          <Link href="/booking">Book a Service</Link>
        </Button>
      </div>

      {loading ? (
        <Card><CardContent className="p-6 text-sm text-[var(--muted-foreground)]">Loading dashboard...</CardContent></Card>
      ) : null}

      {!loading && error ? (
        <Card><CardContent className="p-6 text-sm text-[var(--muted-foreground)]">{error}</CardContent></Card>
      ) : null}

      {!loading && !error ? (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Booking</CardTitle>
          </CardHeader>
          <CardContent>
            {upcoming ? (
              <>
                <p className="font-semibold">{upcoming.bikeName}</p>
                <p className="text-sm text-[var(--muted-foreground)]">{upcoming.serviceIds.map((service) => service.name).join(", ")}</p>
                <p className="mt-2 text-sm">{upcoming.scheduledDate} · {upcoming.scheduledTime}</p>
                <div className="mt-3 flex items-center gap-2">
                  <Badge variant={statusVariant(upcoming.status)}>{statusLabel(upcoming.status)}</Badge>
                </div>
              </>
            ) : (
              <p className="text-sm text-[var(--muted-foreground)]">No upcoming bookings.</p>
            )}
          </CardContent>
        </Card>
      ) : null}

      <section>
        <h2 className="mb-3 font-heading text-lg font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {quickActions.map((item) => (
            <Button key={item.label} asChild variant="secondary" className="h-16">
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-heading text-lg font-semibold">My Services</h2>
        {!loading && !error && recentServices.length === 0 ? (
          <Card><CardContent className="p-6 text-sm text-[var(--muted-foreground)]">No services yet.</CardContent></Card>
        ) : null}

        <div className="space-y-3">
          {recentServices.map((booking) => (
            <Card key={booking._id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-semibold">{booking.bikeName}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">{booking.serviceIds.map((service) => service.name).join(", ")} · {booking.scheduledDate}</p>
                  <div className="mt-2">
                    <Badge variant={statusVariant(booking.status)}>{statusLabel(booking.status)}</Badge>
                  </div>
                  {booking.detailedBill ? (
                    <p className="text-xs text-[var(--muted-foreground)]">
                      Base ₹{booking.detailedBill.baseServiceCharge} + Additional ₹{booking.detailedBill.additionalTotal} = Final ₹{booking.detailedBill.finalPayableAmount}
                    </p>
                  ) : (
                    <p className="text-xs text-[var(--muted-foreground)]">Bill not prepared yet.</p>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span>{booking.payment.amount > 0 ? `₹${booking.payment.amount}` : "Pending admin update"}</span>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleInvoiceDownload(booking._id)}
                    disabled={downloadingId === booking._id || booking.status !== "paid"}
                  >
                    {downloadingId === booking._id ? "Downloading..." : booking.status === "paid" ? "Invoice" : "After completion"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
