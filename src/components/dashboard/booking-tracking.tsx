import { Phone, Star } from "lucide-react";
import { bookings, mechanics } from "@/mock/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPlaceholder } from "@/components/maps/map-placeholder";

const trackingSteps = [
  "Booking Confirmed",
  "Mechanic Assigned",
  "Mechanic Accepted",
  "Mechanic On the Way",
  "Service Started",
  "Service Completed",
];

export function BookingTracking({ bookingId }: { bookingId: string }) {
  const booking = bookings.find((item) => item.id === bookingId) ?? bookings[0];
  const mechanic = mechanics.find((item) => item.id === booking.mechanicId) ?? mechanics[0];
  const currentStep = trackingSteps.indexOf(booking.status);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 px-4 pb-20 pt-6 sm:px-6 md:pb-8">
      <h1 className="font-heading text-2xl font-semibold">Booking Tracking</h1>
      <Card>
        <CardContent className="p-5">
          <p className="text-sm text-[var(--muted-foreground)]">Booking ID: {booking.id}</p>
          <div className="mt-4 space-y-4">
            {trackingSteps.map((step, index) => (
              <div key={step} className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${index <= currentStep ? "bg-[var(--success)]" : "bg-[var(--muted)]"}`} />
                <p className={index <= currentStep ? "font-semibold" : "text-[var(--muted-foreground)]"}>{step}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <p className="font-semibold">{mechanic.name}</p>
            <p className="text-sm text-[var(--muted-foreground)]">ETA: 18 minutes</p>
            <div className="mt-2 flex items-center gap-2 text-sm"><Star className="h-4 w-4" /> {mechanic.rating}</div>
          </div>
          <div className="flex items-center gap-2">
            <Badge>Mechanic Assigned</Badge>
            <Button variant="secondary" size="sm"><Phone className="mr-1 h-4 w-4" /> Phone</Button>
          </div>
        </CardContent>
      </Card>

      <MapPlaceholder />
    </div>
  );
}
