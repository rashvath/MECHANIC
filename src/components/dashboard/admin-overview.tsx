import { adminStats, chartSeries, serviceDistribution } from "@/mock/data";
import { SimpleBarChart } from "@/components/charts/simple-bar-chart";
import { SimpleDonutChart } from "@/components/charts/simple-donut-chart";
import { Card, CardContent } from "@/components/ui/card";

export function AdminOverview() {
  const topStats = adminStats.slice(0, 4);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {topStats.map((stat) => (
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
            <SimpleDonutChart data={serviceDistribution} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
