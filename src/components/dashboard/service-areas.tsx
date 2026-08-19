import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const areas = [
  { name: "HSR Layout", pin: "560102", mechanics: 18 },
  { name: "Koramangala", pin: "560095", mechanics: 15 },
  { name: "Indiranagar", pin: "560038", mechanics: 13 },
  { name: "Whitefield", pin: "560066", mechanics: 21 },
  { name: "Marathahalli", pin: "560037", mechanics: 11 },
];

export function ServiceAreas() {
  return (
    <Card>
      <CardContent className="p-5">
        <h2 className="font-heading text-lg font-semibold">Service Area Management</h2>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">Bengaluru</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => (
            <div key={area.name} className="rounded-xl border border-[var(--border)] p-4">
              <p className="font-semibold">{area.name}</p>
              <p className="text-sm text-[var(--muted-foreground)]">PIN: {area.pin}</p>
              <p className="text-sm text-[var(--muted-foreground)]">Mechanics: {area.mechanics}</p>
              <div className="mt-3 flex items-center justify-between">
                <Badge variant="success">Enabled</Badge>
                <Button size="sm" variant="secondary">Disable</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
