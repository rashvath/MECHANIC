import { chartSeries } from "@/mock/data";
import { SimpleBarChart } from "@/components/charts/simple-bar-chart";
import { Card, CardContent } from "@/components/ui/card";

export function MechanicEarnings() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-5 px-4 pb-20 pt-6 sm:px-6 md:pb-8">
      <h1 className="font-heading text-2xl font-semibold">Earnings</h1>
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["Today", "₹1,850"],
          ["This Week", "₹8,450"],
          ["This Month", "₹32,600"],
        ].map((item) => (
          <Card key={item[0]}><CardContent className="p-4"><p className="text-sm text-[var(--muted-foreground)]">{item[0]}</p><p className="mt-1 text-2xl font-semibold">{item[1]}</p></CardContent></Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <h2 className="font-heading text-lg font-semibold">Earnings History</h2>
          <SimpleBarChart data={chartSeries} keyName="revenue" color="#0E3A5D" />
        </CardContent>
      </Card>
    </div>
  );
}
