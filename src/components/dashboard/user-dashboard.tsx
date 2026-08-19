import Link from "next/link";
import { bookings, bikes, mechanics, servicePackages } from "@/mock/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const quickActions = [
  { label: "Book Service", href: "/booking" },
  { label: "My Bikes", href: "/booking" },
  { label: "Service History", href: "/dashboard/history" },
  { label: "Support", href: "/dashboard/profile" },
];

export function UserDashboard() {
  const upcoming = bookings[0];
  const upcomingBike = bikes.find((bike) => bike.id === upcoming.bikeId);
  const upcomingService = servicePackages.find((service) => service.id === upcoming.serviceId);
  const upcomingMechanic = mechanics.find((mechanic) => mechanic.id === upcoming.mechanicId);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5 px-4 pb-20 pt-6 sm:px-6 md:pb-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[var(--muted-foreground)]">Good morning, Rahul</p>
          <h1 className="font-heading text-2xl font-semibold">Ready for your next ride?</h1>
          <p className="text-sm text-[var(--muted-foreground)]">HSR Layout, Bengaluru</p>
        </div>
        <Button asChild>
          <Link href="/booking">Book a Service</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Booking</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-semibold">{upcomingBike?.brand} {upcomingBike?.model}</p>
          <p className="text-sm text-[var(--muted-foreground)]">{upcomingService?.name}</p>
          <p className="mt-2 text-sm">Today · {upcoming.time}</p>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">Mechanic: {upcomingMechanic?.name}</p>
          <div className="mt-3 flex items-center gap-2">
            <Badge>{upcoming.status}</Badge>
            <Button asChild size="sm" className="ml-auto">
              <Link href={`/dashboard/bookings/${upcoming.id}`}>Track Service</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <section>
        <h2 className="mb-3 font-heading text-lg font-semibold">My Bikes</h2>
        <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 sm:mx-0">
          {bikes.map((bike) => (
            <Card key={bike.id} className="min-w-[230px]">
              <CardContent className="p-4">
                <p className="font-semibold">{bike.brand} {bike.model}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{bike.registrationNumber}</p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">Last service: {bike.lastServiceDate}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-heading text-lg font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickActions.map((item) => (
            <Button key={item.label} asChild variant="secondary" className="h-16">
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-heading text-lg font-semibold">Recent Services</h2>
        <div className="space-y-3">
          {bookings.filter((booking) => booking.status === "Completed").map((booking) => {
            const bike = bikes.find((b) => b.id === booking.bikeId);
            const service = servicePackages.find((s) => s.id === booking.serviceId);
            return (
              <Card key={booking.id}>
                <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div>
                    <p className="font-semibold">{bike?.brand} {bike?.model}</p>
                    <p className="text-sm text-[var(--muted-foreground)]">{service?.name} · {booking.date}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span>₹{booking.amount}</span>
                    <span>4.8 ★</span>
                    <Button size="sm" variant="secondary">Invoice</Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
