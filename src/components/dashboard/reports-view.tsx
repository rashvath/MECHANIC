import { chartSeries } from "@/mock/data";
import { SimpleBarChart } from "@/components/charts/simple-bar-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function ReportsView() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Input type="date" className="max-w-[220px]" />
        <Input type="date" className="max-w-[220px]" />
        <Button variant="secondary">Export</Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ["Booking report", "124 today"],
          ["Revenue report", "₹1,24,500"],
          ["Mechanic performance", "86 active"],
          ["Service popularity", "Premium leads"],
          ["Customer growth", "+8.4%"],
          ["Cancellation report", "4.2%"],
        ].map((item) => (
          <Card key={item[0]}><CardContent className="p-4"><p className="text-sm text-[var(--muted-foreground)]">{item[0]}</p><p className="mt-1 text-xl font-semibold">{item[1]}</p></CardContent></Card>
        ))}
      </div>
      <Card>
        <CardContent className="p-4">
          <SimpleBarChart data={chartSeries} keyName="bookings" color="#0E3A5D" />
        </CardContent>
      </Card>
    </div>
  );
}
