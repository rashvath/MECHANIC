import { AlertTriangle, CircleCheck, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function StateExamples() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Card><CardContent className="flex items-center gap-2 p-4 text-sm"><Loader2 className="h-4 w-4 animate-spin" /> Loading</CardContent></Card>
      <Card><CardContent className="p-4 text-sm text-[var(--muted-foreground)]">No service partners available in this area</CardContent></Card>
      <Card><CardContent className="flex items-center gap-2 p-4 text-sm text-[var(--danger)]"><AlertTriangle className="h-4 w-4" /> Unable to load bookings</CardContent></Card>
      <Card><CardContent className="flex items-center gap-2 p-4 text-sm text-[var(--success)]"><CircleCheck className="h-4 w-4" /> Service successfully booked</CardContent></Card>
    </div>
  );
}
