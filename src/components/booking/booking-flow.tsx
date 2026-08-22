"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, CheckCircle2, Clock3, MapPin, WalletCards } from "lucide-react";
import { createBooking, fetchServices, fetchServiceZones, getUserToken, type ApiService, type ApiServiceZone } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  const [bikeBrand, setBikeBrand] = useState("");
  const [bikeModel, setBikeModel] = useState("");
  const [services, setServices] = useState<ApiService[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [serviceZones, setServiceZones] = useState<ApiServiceZone[]>([]);
  const [serviceAddress, setServiceAddress] = useState("");
  const [selectedDate, setSelectedDate] = useState("Tomorrow");
  const [selectedTime, setSelectedTime] = useState("4:00 PM");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [servicesError, setServicesError] = useState("");
  const [zonesError, setZonesError] = useState("");
  const [bookingId, setBookingId] = useState("BK-PENDING");
  const [submitting, setSubmitting] = useState(false);

  const selectedServiceObjects = services.filter((service) => selectedServices.includes(service._id));

  useEffect(() => {
    fetchServices()
      .then((apiServices) => {
        setServices(apiServices);
        if (apiServices.length > 0) {
          setSelectedServices([apiServices[0]._id]);
        }
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "Unable to load services";
        setServicesError(message);
      });
  }, []);

  useEffect(() => {
    fetchServiceZones()
      .then((zones) => setServiceZones(zones))
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "Unable to load service zones";
        setZonesError(message);
      });
  }, []);

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
    (step === 1 && Boolean(bikeBrand.trim() && bikeModel.trim())) ||
    (step === 2 && selectedServices.length > 0) ||
    (step === 3 && Boolean(serviceAddress.trim())) ||
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
                <h2 className="font-heading text-xl font-semibold">Bike Details</h2>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">Required: bike brand and bike model.</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Input placeholder="Bike brand" value={bikeBrand} onChange={(event) => setBikeBrand(event.target.value)} />
                  <Input placeholder="Bike model" value={bikeModel} onChange={(event) => setBikeModel(event.target.value)} />
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div>
                <h2 className="font-heading text-xl font-semibold">Select Service</h2>
                <div className="mt-4 space-y-3">
                  {services.map((service) => (
                    <button
                      key={service._id}
                      onClick={() => onServiceToggle(service._id)}
                      className={`w-full rounded-xl border p-4 text-left transition ${
                        selectedServices.includes(service._id)
                          ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                          : "border-[var(--border)]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold">{service.name}</p>
                        <Badge>Doorstep</Badge>
                      </div>
                      <p className="mt-2 text-xs text-[var(--muted-foreground)]">{service.description}</p>
                    </button>
                  ))}
                  {servicesError ? <p className="text-sm text-[var(--danger)]">{servicesError}</p> : null}
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div>
                <h2 className="font-heading text-xl font-semibold">Service Address</h2>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">Pick your service zone, then add full address details.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {serviceZones.map((zone) => (
                    <button
                      key={zone._id}
                      onClick={() => setServiceAddress((current) => (current.trim() ? current : `${zone.name}, `))}
                      className="rounded-full border border-[var(--border)] bg-[var(--muted)] px-3 py-1 text-xs hover:border-[var(--primary)]"
                    >
                      {zone.name}
                    </button>
                  ))}
                </div>
                <div className="mt-4">
                  <Textarea
                    placeholder="Enter full address with area and PIN code"
                    value={serviceAddress}
                    onChange={(event) => setServiceAddress(event.target.value)}
                  />
                </div>
                {zonesError ? <p className="mt-2 text-sm text-[var(--danger)]">{zonesError}</p> : null}
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
                    <p><strong>Bike:</strong> {bikeBrand} {bikeModel}</p>
                    <p><strong>Service:</strong> {selectedServiceName}</p>
                    <p><strong>Date:</strong> {selectedDate}</p>
                    <p><strong>Time:</strong> {selectedTime}</p>
                    <p><strong>Address:</strong> {serviceAddress}</p>
                    <p><strong>Payment:</strong> Final amount is added by admin after service.</p>
                  </CardContent>
                </Card>
                <Button onClick={() => setConfirmOpen(true)}>Confirm Booking</Button>
                {submitError ? <p className="text-sm text-[var(--danger)]">{submitError}</p> : null}
              </div>
            ) : null}

            {step === 6 ? (
              <div className="text-center">
                <CheckCircle2 className="mx-auto h-16 w-16 text-[var(--success)]" />
                <h2 className="mt-4 font-heading text-2xl font-semibold">Your Service is Booked!</h2>
                <div className="mx-auto mt-4 max-w-md space-y-2 text-sm text-[var(--muted-foreground)]">
                  <p>Booking ID: {bookingId}</p>
                  <p>Bike: {bikeBrand} {bikeModel}</p>
                  <p>Date: {selectedDate}</p>
                  <p>Time: {selectedTime}</p>
                  <p>Address: {serviceAddress}</p>
                </div>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Button asChild><Link href="/dashboard/history">My Services</Link></Button>
                  <Button variant="secondary" asChild><Link href="/booking">Book Another</Link></Button>
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
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {serviceAddress || "No address added"}</p>
              <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> {selectedDate}</p>
              <p className="flex items-center gap-2"><Clock3 className="h-4 w-4" /> {selectedTime}</p>
              <p className="flex items-center gap-2"><WalletCards className="h-4 w-4" /> {bikeBrand || "Bike brand"} {bikeModel || "Bike model"}</p>
              <p className="flex items-center gap-2"><WalletCards className="h-4 w-4" /> Amount will be finalized by admin</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmationModal
        open={confirmOpen}
        title="Confirm service booking"
        description="This will create your booking request and assign the nearest available service partner."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={async () => {
          setSubmitError("");
          const token = getUserToken();
          if (!token) {
            setConfirmOpen(false);
            setSubmitError("Please login as customer first.");
            return;
          }

          try {
            setSubmitting(true);
            const result = await createBooking(
              {
                bikeName: `${bikeBrand} ${bikeModel}`.trim(),
                serviceAddress: serviceAddress.trim(),
                serviceIds: selectedServices,
                scheduledDate: selectedDate,
                scheduledTime: selectedTime,
              },
              token,
            );
            setBookingId(result._id);
            setConfirmOpen(false);
            setStep(6);
          } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Unable to create booking";
            setSubmitError(message);
            setConfirmOpen(false);
          } finally {
            setSubmitting(false);
          }
        }}
      />
      {submitting ? <p className="mt-3 text-center text-sm text-[var(--muted-foreground)]">Submitting booking...</p> : null}
    </div>
  );
}
