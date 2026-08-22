"use client";

import { useEffect, useState } from "react";
import { fetchAdminReviews, getAdminToken, type ApiReview } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

function stars(rating: number) {
  return "★".repeat(rating) + "☆".repeat(Math.max(5 - rating, 0));
}

export function ReviewsList() {
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadReviews() {
    const token = getAdminToken();
    if (!token) {
      setError("Admin login required.");
      setLoading(false);
      return;
    }

    try {
      const data = await fetchAdminReviews(token);
      setReviews(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unable to load reviews";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadReviews();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <h2 className="font-heading text-lg font-semibold">Reviews</h2>

        {loading ? <p className="text-sm text-[var(--muted-foreground)]">Loading reviews...</p> : null}
        {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
        {!loading && !error && reviews.length === 0 ? <p className="text-sm text-[var(--muted-foreground)]">No reviews yet.</p> : null}

        {!loading && !error ? (
          <div className="space-y-3">
            {reviews.map((review) => (
              <div key={review._id} className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium">{review.userId?.name || "Customer"} · {review.bookingId?.bikeName || "Booking"}</p>
                  <Badge variant={review.bookingId?.status === "paid" ? "success" : "neutral"}>{review.bookingId?.status?.replaceAll("_", " ") || "unknown"}</Badge>
                </div>
                <p className="mt-1 text-sm text-[#f0c778]">{stars(review.rating)} ({review.rating}/5)</p>
                <p className="mt-2 text-sm text-[var(--foreground)]/90">{review.comment}</p>
                <p className="mt-2 text-xs text-[var(--muted-foreground)]">{new Date(review.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
