"use client";

import { useState } from "react";
import Link from "next/link";
import { bookings } from "@/mock/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export function MechanicDashboard() {
  const [available, setAvailable] = useState(true);
  const todayJobs = bookings.filter((item) => item.status === "Mechanic Assigned");

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 px-4 pb-20 pt-6 sm:px-6 md:pb-8">
      <Card>
        <CardContent className="flex items-center justify-between p-5">
          <div>
            <p className="font-heading text-xl font-semibold">Rajesh Kumar</p>
            <p className="text-sm text-[var(--muted-foreground)]">Profile · Mechanic</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Available for Jobs</span>
            <Switch checked={available} onCheckedChange={setAvailable} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ["Today Jobs", "6"],
          ["Completed Jobs", "520"],
          ["Earnings", "₹32,600"],
        ].map((item) => (
          <Card key={item[0]}>
            <CardContent className="p-4">
              <p className="text-sm text-[var(--muted-foreground)]">{item[0]}</p>
              <p className="mt-1 text-2xl font-semibold">{item[1]}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <section>
        <h2 className="mb-3 font-heading text-lg font-semibold">Today Jobs</h2>
        <div className="space-y-3">
          {todayJobs.map((job) => (
            <Card key={job.id}>
              <CardContent className="space-y-2 p-4 text-sm">
                <p><strong>Customer:</strong> Rahul Shetty</p>
                <p><strong>Bike:</strong> Honda Activa 6G</p>
                <p><strong>Service:</strong> Premium Service</p>
                <p><strong>Location:</strong> HSR Layout</p>
                <p><strong>Time:</strong> {job.time}</p>
                <p><strong>Distance:</strong> 2.4 km</p>
                <Badge>Pending</Badge>
                <div className="flex gap-2">
                  <Button size="sm">Accept</Button>
                  <Button size="sm" variant="secondary" asChild>
                    <Link href={`/mechanic/jobs/${job.id}`}>Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
