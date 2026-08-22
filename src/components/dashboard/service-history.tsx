"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import { createReview, downloadInvoiceHtml, fetchMyBookings, fetchMyReviews, getUserToken, type ApiReview, type ApiUserBooking } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

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

export function ServiceHistory() {
  const token = getUserToken();
  const [bookings, setBookings] = useState<ApiUserBooking[]>([]);
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState(token ? "" : "Please login to view your services.");
  const [downloadingId, setDownloadingId] = useState("");
  const [submittingReviewFor, setSubmittingReviewFor] = useState("");
  const [reviewDrafts, setReviewDrafts] = useState<Record<string, { rating: number; comment: string }>>({});

  useEffect(() => {
    if (!token) {
      return;
    }

    Promise.all([fetchMyBookings(token), fetchMyReviews(token)])
      .then(([bookingsData, reviewsData]) => {
        setBookings(bookingsData);
        setReviews(reviewsData);
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Unable to load your services";
        setError(message);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const myServices = useMemo(() => bookings, [bookings]);
  const reviewMap = useMemo(() => {
    return new Map(reviews.map((review) => [review.bookingId?._id, review]));
  }, [reviews]);

  function getReviewDraft(bookingId: string) {
    return reviewDrafts[bookingId] || { rating: 5, comment: "" };
  }

  function updateReviewDraft(bookingId: string, patch: Partial<{ rating: number; comment: string }>) {
    setReviewDrafts((current) => ({
      ...current,
      [bookingId]: {
        ...getReviewDraft(bookingId),
        ...patch
      }
    }));
  }

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

  async function handleSubmitReview(bookingId: string) {
    if (!token) {
      setError("Please login to add a review.");
      return;
    }

    const draft = getReviewDraft(bookingId);
    const comment = draft.comment.trim();
    if (!comment) {
      setError("Review comment is required.");
      return;
    }

    try {
      setSubmittingReviewFor(bookingId);
      setError("");
      const created = await createReview({ bookingId, rating: draft.rating, comment }, token);
      setReviews((current) => [created, ...current]);
      setReviewDrafts((current) => ({ ...current, [bookingId]: { rating: 5, comment: "" } }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unable to submit review";
      setError(message);
    } finally {
      setSubmittingReviewFor("");
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5 px-4 pb-20 pt-6 sm:px-6 md:pb-8">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-semibold">My Services</h1>
        <Button asChild variant="secondary" size="sm">
          <Link href="/dashboard" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      {loading ? (
        <Card><CardContent className="p-6 text-sm text-[var(--muted-foreground)]">Loading your services...</CardContent></Card>
      ) : null}

      {!loading && error ? (
        <Card><CardContent className="p-6 text-sm text-[var(--muted-foreground)]">{error}</CardContent></Card>
      ) : null}

      {!loading && !error && myServices.length === 0 ? (
        <Card><CardContent className="p-6 text-sm text-[var(--muted-foreground)]">No services yet.</CardContent></Card>
      ) : null}

      {!loading && !error && myServices.length > 0 ? (
        <div className="space-y-4">
          {myServices.map((booking) => (
            <Card key={booking._id}>
              <CardContent className="space-y-3 p-5 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">{booking.bikeName}</p>
                  <Badge variant={statusVariant(booking.status)}>{statusLabel(booking.status)}</Badge>
                </div>
                <p className="text-[var(--muted-foreground)]">Services: {booking.serviceIds.map((service) => service.name).join(", ")}</p>
                <p>Scheduled: {booking.scheduledDate} {booking.scheduledTime}</p>
                <p>Amount: {booking.payment.amount > 0 ? `₹${booking.payment.amount}` : "Pending admin update"}</p>
                <p>Payment Method: {booking.payment.method === "none" ? "Not updated" : booking.payment.method}</p>
                {booking.detailedBill ? (
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-xs">
                    <p className="font-semibold">Original Service: ₹{booking.detailedBill.baseServiceCharge}</p>
                    <p className="mt-1">Additional Work: ₹{booking.detailedBill.additionalTotal}</p>
                    <p className="mt-1">Final Amount: ₹{booking.detailedBill.finalPayableAmount}</p>
                  </div>
                ) : (
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-xs text-[var(--muted-foreground)]">
                    Bill not prepared yet.
                  </div>
                )}
                <div>
                  <Button
                    variant="secondary"
                    onClick={() => handleInvoiceDownload(booking._id)}
                    disabled={downloadingId === booking._id || booking.status !== "paid"}
                  >
                    {downloadingId === booking._id ? "Downloading..." : booking.status === "paid" ? "Download Invoice" : "Invoice after completion"}
                  </Button>
                </div>

                {booking.status === "paid" ? (
                  reviewMap.has(booking._id) ? (
                    <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-xs">
                      <p className="font-semibold">Your Review</p>
                      <p className="mt-1">Rating: {reviewMap.get(booking._id)?.rating}/5</p>
                      <p className="mt-1">{reviewMap.get(booking._id)?.comment}</p>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)] p-4 text-xs">
                      <p className="text-sm font-semibold">Add Your Review</p>

                      <div className="mt-2 flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((value) => {
                          const isActive = value <= getReviewDraft(booking._id).rating;
                          return (
                            <button
                              key={`${booking._id}-star-${value}`}
                              type="button"
                              onClick={() => updateReviewDraft(booking._id, { rating: value })}
                              className="rounded-md p-1 transition hover:bg-[var(--card)]"
                              aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
                            >
                              <Star className={`h-5 w-5 ${isActive ? "fill-[#e0b768] text-[#e0b768]" : "text-[var(--muted-foreground)]"}`} />
                            </button>
                          );
                        })}
                      </div>

                      <Textarea
                        className="mt-3 min-h-[130px] bg-[var(--card)]"
                        placeholder="Share your service experience"
                        value={getReviewDraft(booking._id).comment}
                        onChange={(event) => updateReviewDraft(booking._id, { comment: event.target.value })}
                      />

                      <div className="mt-2">
                        <Button
                          size="sm"
                          onClick={() => handleSubmitReview(booking._id)}
                          disabled={submittingReviewFor === booking._id}
                        >
                          {submittingReviewFor === booking._id ? "Submitting..." : "Submit Review"}
                        </Button>
                      </div>
                    </div>
                  )
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}
