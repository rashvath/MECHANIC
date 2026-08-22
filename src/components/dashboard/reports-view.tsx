import { Card, CardContent } from "@/components/ui/card";

export function ReportsView() {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="space-y-2 p-6">
          <h2 className="font-heading text-lg font-semibold">Reports</h2>
          <p className="text-sm text-[var(--muted-foreground)]">No report API is configured yet, so this page intentionally shows no dummy metrics.</p>
        </CardContent>
      </Card>
    </div>
  );
}
