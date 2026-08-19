"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const inspectionItems = ["Engine", "Brake", "Tyres", "Battery", "Chain", "Lights", "Suspension"];

export function MechanicJobDetail() {
  const [accepted, setAccepted] = useState(false);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 px-4 pb-20 pt-6 sm:px-6 md:pb-8">
      <h1 className="font-heading text-2xl font-semibold">Mechanic Job Detail</h1>
      <Card>
        <CardContent className="space-y-2 p-5 text-sm">
          <p><strong>Customer:</strong> Rahul Shetty</p>
          <p><strong>Bike:</strong> Honda Activa 6G</p>
          <p><strong>Service requested:</strong> Premium Service</p>
          <p><strong>Address:</strong> HSR Layout, Bengaluru</p>
          <p><strong>Scheduled time:</strong> 4:00 PM</p>
          <p><strong>Estimated amount:</strong> ₹799</p>
          <div className="flex flex-wrap gap-2 pt-1">
            <Button onClick={() => setAccepted(true)} disabled={accepted}>Accept Job</Button>
            <Button onClick={() => setStarted(true)} disabled={!accepted || started}>Start Service</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Inspection Checklist</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {inspectionItems.map((item) => (
            <div key={item} className="grid gap-2 rounded-xl border border-[var(--border)] p-3 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center">
              <p className="font-medium">{item}</p>
              <Button size="sm" variant="secondary">Pass</Button>
              <Button size="sm" variant="secondary">Needs Attention</Button>
              <Button size="sm" variant="destructive">Critical</Button>
            </div>
          ))}
          <Textarea placeholder="Mechanic notes" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Complete Service</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Work completed" />
          <Input placeholder="Parts replaced" />
          <Textarea placeholder="Mechanic notes" />
          <Input placeholder="Final amount" />
          <Button onClick={() => setCompleted(true)}>Complete Service</Button>
          {completed ? <p className="text-sm font-semibold text-[var(--success)]">Service Completed Successfully</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
