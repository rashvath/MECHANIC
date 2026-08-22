"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchAdminBookings, fetchServices, getAdminToken, type ApiAdminBooking, type ApiService } from "@/lib/api";
import { SimpleBarChart } from "@/components/charts/simple-bar-chart";
import { SimpleDonutChart } from "@/components/charts/simple-donut-chart";
import { Card, CardContent } from "@/components/ui/card";

export function AdminOverview() {
  const token = getAdminToken();
  const [bookings, setBookings] = useState<ApiAdminBooking[]>([]);
  const [services, setServices] = useState<ApiService[]>([]);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState(token ? "" : "Admin login required.");

  useEffect(() => {
    if (!token) {
      return;
    }

    Promise.all([fetchAdminBookings(token), fetchServices()])
      .then(([bookingData, servicesData]) => {
        setBookings(bookingData);
        setServices(servicesData);
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Unable to load dashboard data";
        setError(message);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const stats = useMemo(() => {
    const revenue = bookings.reduce((sum, booking) => sum + (booking.payment?.amount || 0), 0);
    return [
      { label: "Total bookings", value: String(bookings.length) },
      { label: "Pending approval", value: String(bookings.filter((booking) => booking.status === "pending_approval").length) },
      { label: "Paid bookings", value: String(bookings.filter((booking) => booking.status === "paid").length) },
      { label: "Revenue recorded", value: `₹${revenue}` },
      { label: "Active services", value: String(services.filter((service) => service.isActive).length) },
    ];
  }, [bookings, services]);

  const chartSeries = useMemo(() => {
    const now = new Date();
    const labels: string[] = [];
    const counts = new Map<string, number>();

    for (let day = 6; day >= 0; day -= 1) {
      const date = new Date(now);
      date.setDate(now.getDate() - day);
      const key = date.toISOString().slice(0, 10);
      labels.push(key);
      counts.set(key, 0);
    }

    bookings.forEach((booking) => {
      const key = new Date(booking.createdAt).toISOString().slice(0, 10);
      if (counts.has(key)) {
        counts.set(key, (counts.get(key) || 0) + 1);
      }
    });

    return labels.map((key) => ({
      name: new Date(key).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      bookings: counts.get(key) || 0
    }));
  }, [bookings]);

  const serviceDistribution = useMemo(() => {
    const totals = new Map<string, number>();

    bookings.forEach((booking) => {
      booking.serviceIds.forEach((service) => {
        totals.set(service.name, (totals.get(service.name) || 0) + 1);
      });
    });

    return Array.from(totals.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [bookings]);

  return (
    <div className="space-y-5">
      {loading ? (
        <Card>
          <CardContent className="p-6 text-sm text-[var(--muted-foreground)]">Loading dashboard data...</CardContent>
        </Card>
      ) : null}

      {!loading && error ? (
        <Card>
          <CardContent className="p-6 text-sm text-[var(--muted-foreground)]">{error}</CardContent>
        </Card>
      ) : null}

      {!loading && !error ? (
      <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className="text-sm text-[var(--muted-foreground)]">{stat.label}</p>
              <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-heading text-lg font-semibold">Bookings Over Time</h3>
            <SimpleBarChart data={chartSeries} keyName="bookings" color="#0E3A5D" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-heading text-lg font-semibold">Service Category Distribution</h3>
            {serviceDistribution.length > 0 ? (
              <SimpleDonutChart data={serviceDistribution} />
            ) : (
              <p className="mt-3 text-sm text-[var(--muted-foreground)]">No booking data available yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
      </>
      ) : null}
    </div>
  );
}
