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
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

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

  const selectedLocationUrl = useMemo(() => {
    if (!selectedLocation) return null;
    const value = selectedLocation.trim();
    if (!value) return null;
    const httpMatch = value.match(/https?:\/\/[^\s)]+/i);
    if (httpMatch?.[0]) {
      return httpMatch[0].replace(/[.,;:!?]+$/, "");
    }

    const mapsWithoutProtocol = value.match(/(?:^|\s)(maps\.google\.com\/[^\s)]+)/i);
    if (mapsWithoutProtocol?.[1]) {
      return `https://${mapsWithoutProtocol[1].replace(/[.,;:!?]+$/, "")}`;
    }

    const webWithoutProtocol = value.match(/(?:^|\s)(www\.[^\s)]+)/i);
    if (webWithoutProtocol?.[1]) {
      return `https://${webWithoutProtocol[1].replace(/[.,;:!?]+$/, "")}`;
    }

    if (/^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/.test(value)) {
      return `https://maps.google.com/?q=${encodeURIComponent(value)}`;
    }

    return null;
  }, [selectedLocation]);

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
          <CardContent className="p-6 text-sm text-(--muted-foreground)">Loading bookings...</CardContent>
        </Card>
      ) : null}

      {!loading && error ? (
        <Card>
          <CardContent className="p-6 text-sm text-(--muted-foreground)">{error}</CardContent>
        </Card>
      ) : null}

      {!loading && !error && filteredBookings.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-(--muted-foreground)">No bookings found for this filter.</CardContent>
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
                <TableHead>Location</TableHead>
                <TableHead>Mobile Number</TableHead>
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
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setSelectedLocation(booking.serviceAddress || "")}
                    >
                      Location
                    </Button>
                  </TableCell>
                  <TableCell>{booking.mobileNumber || booking.userId?.mobile || "-"}</TableCell>
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
                        <span className="text-xs text-(--muted-foreground)">-</span>
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

      {selectedLocation !== null ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4">
          <Card className="w-full max-w-lg border-[#5b4424] bg-[#121821] p-5 text-[#f5efe4]">
            <h3 className="font-heading text-lg font-semibold text-[#dfae60]">Customer Location</h3>
            <p className="mt-3 break-all text-sm text-[#cabba4]">{selectedLocation || "Location not provided."}</p>
            {selectedLocationUrl ? (
              <div className="mt-4 space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-[#cabba4]">Google Maps</p>
                <a
                  href={selectedLocationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block break-all text-sm font-semibold text-[#f4c778] underline underline-offset-4"
                >
                  {selectedLocationUrl}
                </a>
              </div>
            ) : null}
            <div className="mt-5 flex justify-end">
              <Button size="sm" variant="secondary" onClick={() => setSelectedLocation(null)}>
                Close
              </Button>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
