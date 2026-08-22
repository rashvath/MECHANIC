"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { approveAdminBooking, fetchAdminBookings, getAdminToken, updateAdminBookingPayment, type ApiAdminBooking } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const filters = ["all", "pending_approval", "approved", "payment_pending", "paid", "rejected"] as const;

type BookingFilter = (typeof filters)[number];

function statusVariant(status: string): "default" | "success" | "warning" | "neutral" {
  if (status === "paid") return "success";
  if (status === "rejected") return "warning";
  if (status === "pending_approval" || status === "payment_pending") return "neutral";
  return "default";
}

function prettyStatus(status: ApiAdminBooking["status"]) {
  return status.replaceAll("_", " ");
}

function estimatedBookingAmount(booking: ApiAdminBooking) {
  return booking.serviceIds.reduce((sum, service) => {
    const price = typeof service === "object" && service ? Number(service.startingPrice || 0) : 0;
    return sum + price;
  }, 0);
}

export function AdminBookingsTable() {
  const token = getAdminToken();
  const [bookings, setBookings] = useState<ApiAdminBooking[]>([]);
  const [activeFilter, setActiveFilter] = useState<BookingFilter>("all");
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState(token ? "" : "Admin login required.");
  const [approvingId, setApprovingId] = useState("");
  const [payingId, setPayingId] = useState("");

  useEffect(() => {
    if (!token) {
      return;
    }

    fetchAdminBookings(token)
      .then((data) => {
        setBookings(data);
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Unable to load bookings";
        setError(message);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const filteredBookings = useMemo(() => {
    if (activeFilter === "all") return bookings;
    return bookings.filter((booking) => booking.status === activeFilter);
  }, [activeFilter, bookings]);

  function handleApprove(bookingId: string) {
    if (!token) {
      setError("Admin login required.");
      return;
    }

    setApprovingId(bookingId);
    setError("");

    approveAdminBooking(bookingId, token)
      .then((updatedBooking) => {
        setBookings((current) => current.map((booking) => (
          booking._id === bookingId
            ? { ...booking, status: updatedBooking.status }
            : booking
        )));
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Unable to approve booking";
        setError(message);
      })
      .finally(() => {
        setApprovingId("");
      });
  }

  function handleMarkPaid(booking: ApiAdminBooking, method: "cash" | "online") {
    if (!token) {
      setError("Admin login required.");
      return;
    }

    const amount = booking.detailedBill?.finalPayableAmount || booking.payment.amount || estimatedBookingAmount(booking);
    if (amount <= 0) {
      setError("Unable to calculate payment amount for this booking.");
      return;
    }

    setPayingId(booking._id);
    setError("");

    updateAdminBookingPayment(booking._id, token, { amount, method })
      .then((updatedBooking) => {
        setBookings((current) => current.map((item) => (
          item._id === booking._id
            ? { ...item, status: updatedBooking.status, payment: updatedBooking.payment }
            : item
        )));
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Unable to update payment";
        setError(message);
      })
      .finally(() => {
        setPayingId("");
      });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? "default" : "secondary"}
            size="sm"
            onClick={() => setActiveFilter(filter)}
          >
            {filter === "all" ? "All" : prettyStatus(filter)}
          </Button>
        ))}
      </div>

      {loading ? (
        <Card>
          <CardContent className="p-6 text-sm text-[var(--muted-foreground)]">Loading bookings...</CardContent>
        </Card>
      ) : null}

      {!loading && error ? (
        <Card>
          <CardContent className="p-6 text-sm text-[var(--muted-foreground)]">{error}</CardContent>
        </Card>
      ) : null}

      {!loading && !error && filteredBookings.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-[var(--muted-foreground)]">No bookings found for this filter.</CardContent>
        </Card>
      ) : null}

      {!loading && !error && filteredBookings.length > 0 ? (
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Bike</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell className="font-medium">{booking._id.slice(-6).toUpperCase()}</TableCell>
                  <TableCell>{booking.userId?.name || "Unknown user"}</TableCell>
                  <TableCell>{booking.bikeName}</TableCell>
                  <TableCell>{booking.serviceIds.map((service) => service.name).join(", ") || "-"}</TableCell>
                  <TableCell>{booking.scheduledDate} {booking.scheduledTime}</TableCell>
                  <TableCell>
                    {booking.detailedBill?.finalPayableAmount
                      ? `₹${booking.detailedBill.finalPayableAmount}`
                      : booking.payment.amount
                        ? `₹${booking.payment.amount}`
                        : (estimatedBookingAmount(booking) ? `₹${estimatedBookingAmount(booking)}` : "-")}
                  </TableCell>
                  <TableCell><Badge variant={statusVariant(booking.status)}>{prettyStatus(booking.status)}</Badge></TableCell>
                  <TableCell>
                    {booking.status === "pending_approval" ? (
                      <Button
                        size="sm"
                        onClick={() => handleApprove(booking._id)}
                        disabled={approvingId === booking._id}
                      >
                        {approvingId === booking._id ? "Approving..." : "Approve"}
                      </Button>
                    ) : booking.status === "payment_pending" || booking.status === "approved" ? (
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" asChild>
                          <Link href={`/admin/bookings/${booking._id}/bill`}>
                            {booking.detailedBill ? "Edit Detailed Bill" : "Create Detailed Bill"}
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleMarkPaid(booking, "cash")}
                          disabled={payingId === booking._id || !booking.detailedBill}
                        >
                          {payingId === booking._id ? "Saving..." : booking.detailedBill ? "Cash Paid" : "Save Bill First"}
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleMarkPaid(booking, "online")}
                          disabled={payingId === booking._id || !booking.detailedBill}
                        >
                          {payingId === booking._id ? "Saving..." : booking.detailedBill ? "Online Paid" : "Save Bill First"}
                        </Button>
                        {booking.detailedBill ? (
                          <Button size="sm" variant="ghost" asChild>
                            <Link href={`/admin/bookings/${booking._id}/bill`}>View Bill</Link>
                          </Button>
                        ) : null}
                      </div>
                    ) : (
                      booking.detailedBill ? (
                        <Button size="sm" variant="ghost" asChild>
                          <Link href={`/admin/bookings/${booking._id}/bill`}>View Bill</Link>
                        </Button>
                      ) : (
                        <span className="text-xs text-[var(--muted-foreground)]">-</span>
                      )
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      ) : null}
    </div>
  );
}
