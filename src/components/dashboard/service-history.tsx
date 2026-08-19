import { bookings, mechanics, servicePackages } from "@/mock/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ServiceHistory() {
  const completedBookings = bookings.filter((booking) => booking.status === "Completed");

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5 px-4 pb-20 pt-6 sm:px-6 md:pb-8">
      <h1 className="font-heading text-2xl font-semibold">Service History</h1>
      {completedBookings.length === 0 ? (
        <Card><CardContent className="p-6 text-sm text-[var(--muted-foreground)]">No bookings yet</CardContent></Card>
      ) : (
        <div className="space-y-4">
          {completedBookings.map((booking) => {
            const service = servicePackages.find((item) => item.id === booking.serviceId);
            const mechanic = mechanics.find((item) => item.id === booking.mechanicId);
            return (
              <Card key={booking.id}>
                <CardHeader>
                  <CardTitle className="text-base">{service?.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>Service date: {booking.date}</p>
                  <p>Mechanic: {mechanic?.name}</p>
                  <p>Amount: ₹{booking.amount}</p>
                  <Badge variant="success">Completed</Badge>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Card className="border-dashed"><CardContent className="p-4">Before image placeholder</CardContent></Card>
                    <Card className="border-dashed"><CardContent className="p-4">After image placeholder</CardContent></Card>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Card className="border-dashed"><CardContent className="p-4">Services performed and parts used</CardContent></Card>
                    <Card className="border-dashed"><CardContent className="p-4">Inspection checklist, notes, invoice, warranty</CardContent></Card>
                  </div>
                  <Button variant="secondary">View Details</Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
