import { Bike } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

export function BikeCard({ bike }: { bike: Bike }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="font-semibold">{bike.brand} {bike.model}</p>
        <p className="text-sm text-[var(--muted-foreground)]">{bike.registrationNumber}</p>
      </CardContent>
    </Card>
  );
}
