"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, CheckCircle2, Clock3, MapPin, Plus, WalletCards } from "lucide-react";
import { bikes, bookings, mechanics, servicePackages } from "@/mock/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ConfirmationModal } from "@/components/modals/confirmation-modal";

const steps = ["Bike", "Service", "Location", "Schedule", "Review", "Confirmation"];

const dates = ["Today", "Tomorrow", "Friday", "Saturday"];
const slots = [
  { time: "9:00 AM", available: true },
  { time: "10:30 AM", available: true },
  { time: "12:00 PM", available: false },
  { time: "2:00 PM", available: true },
  { time: "4:00 PM", available: true },
  { time: "5:30 PM", available: false },
];

export function BookingFlow() {
  const [step, setStep] = useState(1);
  const [selectedBikeId, setSelectedBikeId] = useState(bikes[0].id);
  const [selectedServices, setSelectedServices] = useState<string[]>([servicePackages[1].id]);
  const [selectedAddress, setSelectedAddress] = useState("Home");
  const [selectedDate, setSelectedDate] = useState("Tomorrow");
  const [selectedTime, setSelectedTime] = useState("4:00 PM");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const selectedBike = bikes.find((bike) => bike.id === selectedBikeId) ?? bikes[0];
  const selectedMechanic = mechanics[0];
  const selectedServiceObjects = servicePackages.filter((pkg) => selectedServices.includes(pkg.id));
  const total = selectedServiceObjects.reduce((sum, item) => sum + item.price, 0);

  const selectedServiceName = useMemo(() => {
    if (!selectedServiceObjects.length) return "No service selected";
    if (selectedServiceObjects.length === 1) return selectedServiceObjects[0].name;
    return `${selectedServiceObjects.length} services selected`;
  }, [selectedServiceObjects]);

  function onServiceToggle(serviceId: string) {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId],
    );
  }

  const canContinue =
    (step === 1 && Boolean(selectedBikeId)) ||
    (step === 2 && selectedServices.length > 0) ||
    (step === 3 && Boolean(selectedAddress)) ||
    (step === 4 && Boolean(selectedDate && selectedTime)) ||
    step > 4;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-7 sm:px-6 lg:px-8 lg:pb-8">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {steps.map((item, i) => (
          <div key={item} className="flex items-center gap-2">
            <div
              className={`grid h-8 w-8 place-items-center rounded-full text-xs font-semibold ${
                step >= i + 1 ? "bg-[var(--primary)] text-white" : "bg-[var(--muted)] text-[var(--muted-foreground)]"
              }`}
            >
              {i + 1}
            </div>
            <span className="text-xs sm:text-sm">{item}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardContent className="p-5 sm:p-6">
            {step === 1 ? (
              <div>
                <h2 className="font-heading text-xl font-semibold">Select Bike</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {bikes.map((bike) => (
                    <button
                      key={bike.id}
                      onClick={() => setSelectedBikeId(bike.id)}
                      className={`rounded-xl border p-4 text-left transition ${
                        selectedBikeId === bike.id ? "border-[var(--primary)] bg-[var(--primary-soft)]" : "border-[var(--border)]"
                      }`}
                    >
                      <p className="font-semibold">{bike.brand} {bike.model}</p>
                      <p className="mt-1 text-sm text-[var(--muted-foreground)]">{bike.registrationNumber}</p>
                      <p className="mt-1 text-xs text-[var(--muted-foreground)]">Last service: {bike.lastServiceDate}</p>
                    </button>
                  ))}
                  <button className="grid min-h-[122px] place-items-center rounded-xl border border-dashed border-[var(--border)] text-sm text-[var(--muted-foreground)]">
                    <span className="inline-flex items-center gap-1"><Plus className="h-4 w-4" /> Add New Bike</span>
                  </button>
                </div>

                <h3 className="mt-8 font-heading text-lg font-semibold">Add Bike</h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Input placeholder="Bike brand" />
                  <Input placeholder="Model" />
                  <Input placeholder="Variant" />
                  <Input placeholder="Registration number" />
                  <Input placeholder="Manufacturing year" />
                  <Input placeholder="Current KM" />
                  <Input placeholder="Fuel type" />
                </div>
                <Button className="mt-3" variant="secondary">Save Bike</Button>
              </div>
            ) : null}

            {step === 2 ? (
              <div>
                <h2 className="font-heading text-xl font-semibold">Select Service</h2>
                <div className="mt-4 space-y-3">
                  {servicePackages.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => onServiceToggle(service.id)}
                      className={`w-full rounded-xl border p-4 text-left transition ${
                        selectedServices.includes(service.id)
                          ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                          : "border-[var(--border)]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold">{service.name}</p>
                        <Badge>{service.duration}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-[var(--muted-foreground)]">₹{service.price} onwards</p>
                      <p className="mt-2 text-xs text-[var(--muted-foreground)]">Includes: {service.includes.join(", ")}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div>
                <h2 className="font-heading text-xl font-semibold">Choose Location</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {["Use Current Location", "Home", "Work", "Add New Address"].map((item) => (
                    <button
                      key={item}
                      onClick={() => setSelectedAddress(item)}
                      className={`rounded-xl border p-4 text-left ${
                        selectedAddress === item ? "border-[var(--primary)] bg-[var(--primary-soft)]" : "border-[var(--border)]"
                      }`}
                    >
                      <p className="font-semibold">{item}</p>
                      <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                        Rahul · +91 98450 12345 · HSR Layout Sector 2, Bengaluru · 560102
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {step === 4 ? (
              <div>
                <h2 className="font-heading text-xl font-semibold">Date & Time</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {dates.map((date) => (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`rounded-full px-4 py-2 text-sm ${
                        selectedDate === date ? "bg-[var(--primary)] text-white" : "bg-[var(--muted)]"
                      }`}
                    >
                      {date}
                    </button>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {slots.map((slot) => (
                    <button
                      key={slot.time}
                      disabled={!slot.available}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`rounded-xl border px-4 py-3 text-sm ${
                        !slot.available
                          ? "cursor-not-allowed border-[var(--border)] bg-[var(--muted)] text-[var(--muted-foreground)]"
                          : selectedTime === slot.time
                            ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                            : "border-[var(--border)]"
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {step === 5 ? (
              <div className="space-y-4">
                <h2 className="font-heading text-xl font-semibold">Booking Review</h2>
                <Card className="border-dashed">
                  <CardContent className="space-y-2 p-4 text-sm">
                    <p><strong>Bike:</strong> {selectedBike.brand} {selectedBike.model}</p>
                    <p><strong>Service:</strong> {selectedServiceName}</p>
                    <p><strong>Mechanic:</strong> {selectedMechanic.name}</p>
                    <p><strong>Date:</strong> 20 Aug 2026</p>
                    <p><strong>Time:</strong> {selectedTime}</p>
                    <p><strong>Location:</strong> Customer address</p>
                    <p><strong>Estimated cost:</strong> ₹{total}</p>
                    <p><strong>Payment:</strong> Pay Mechanic</p>
                  </CardContent>
                </Card>
                <Button onClick={() => setConfirmOpen(true)}>Confirm Booking</Button>
              </div>
            ) : null}

            {step === 6 ? (
              <div className="text-center">
                <CheckCircle2 className="mx-auto h-16 w-16 text-[var(--success)]" />
                <h2 className="mt-4 font-heading text-2xl font-semibold">Your Service is Booked!</h2>
                <div className="mx-auto mt-4 max-w-md space-y-2 text-sm text-[var(--muted-foreground)]">
                  <p>Booking ID: BK-20260820-1024</p>
                  <p>Mechanic: Rajesh Kumar</p>
                  <p>Date: 20 Aug 2026</p>
                  <p>Time: 4:00 PM</p>
                  <p>Address: Customer location</p>
                </div>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Button asChild><Link href="/dashboard/bookings/BK-20260820-1024">Track Booking</Link></Button>
                  <Button variant="secondary">View Booking</Button>
                  <Button variant="ghost" asChild><Link href="/">Back to Home</Link></Button>
                </div>
              </div>
            ) : null}

            {step <= 5 ? (
              <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-5">
                <Button variant="secondary" onClick={() => setStep((curr) => Math.max(1, curr - 1))} disabled={step === 1}>
                  Back
                </Button>
                <Button onClick={() => setStep((curr) => Math.min(6, curr + 1))} disabled={!canContinue}>
                  Continue
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="h-fit lg:sticky lg:top-24">
          <CardContent className="p-5">
            <h3 className="font-heading text-lg font-semibold">Booking Summary</h3>
            <div className="mt-4 space-y-3 text-sm">
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {selectedAddress}</p>
              <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> {selectedDate}</p>
              <p className="flex items-center gap-2"><Clock3 className="h-4 w-4" /> {selectedTime}</p>
              <p className="flex items-center gap-2"><WalletCards className="h-4 w-4" /> ₹{total}</p>
            </div>
            {bookings.length === 0 ? <p className="mt-4 text-sm text-[var(--muted-foreground)]">No bookings yet</p> : null}
          </CardContent>
        </Card>
      </div>

      <ConfirmationModal
        open={confirmOpen}
        title="Confirm service booking"
        description="This will create your booking request and assign the nearest available mechanic."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          setStep(6);
        }}
      />
    </div>
  );
}
