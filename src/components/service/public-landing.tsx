"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Battery,
  Circle,
  Cog,
  Disc,
  Droplets,
  Link2,
  MapPin,
  Plug,
  Shield,
  ShieldCheck,
  Snowflake,
  Star,
  Timer,
  Wrench,
  Zap,
} from "lucide-react";
import { fetchServices, fetchServiceZones, type ApiService, type ApiServiceZone } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Section } from "@/components/layout/section";
import { PublicHeader } from "@/components/navbar/public-header";

const serviceIcons = [Wrench, Droplets, Disc, Battery, Circle, Link2, Cog, Zap, Snowflake, Plug];

const whyChooseUs = [
  { title: "Transparent Pricing", icon: Star, description: "Know your service cost before booking with no hidden charges." },
  { title: "Doorstep Convenience", icon: MapPin, description: "We service your bike at home, office, or parking location." },
  { title: "Genuine Parts", icon: Cog, description: "Only genuine consumables and quality replacements are used." },
  { title: "Service Warranty", icon: ShieldCheck, description: "Covered support for eligible service issues after completion." },
  { title: "Digital Service Records", icon: Timer, description: "Track previous services, paid amounts, and invoices in one place." },
  { title: "Flexible Slots", icon: Timer, description: "Morning to evening slot options based on your daily schedule." },
  { title: "Trusted Service", icon: Star, description: "Consistent process checks for reliable and safe bike servicing." },
];

const steps = ["Select Your Bike", "Choose Service", "Partner Arrives", "Service Done at Your Doorstep"];

const heroHighlights = [
  { label: "Genuine Parts", icon: Cog },
  { label: "Hassle Free Doorstep Service", icon: Timer },
  { label: "On-Time Guarantee", icon: MapPin },
];

export function PublicLanding() {
  const [services, setServices] = useState<ApiService[]>([]);
  const [servicesError, setServicesError] = useState("");
  const [zones, setZones] = useState<ApiServiceZone[]>([]);
  const [zonesError, setZonesError] = useState("");

  useEffect(() => {
    fetchServices()
      .then((data) => setServices(data))
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "Unable to load services";
        setServicesError(message);
      });
  }, []);

  useEffect(() => {
    fetchServiceZones()
      .then((data) => setZones(data))
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "Unable to load service zones";
        setZonesError(message);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)]" id="home">
      <PublicHeader />

      <main>
        <Section className="pt-5 sm:pt-8">
          <div className="royal-hero-wrap relative overflow-hidden rounded-3xl border border-[#4b3820] bg-[#12161d]">
            <div className="absolute inset-0">
              <Image
                src="/images/hero-bike.jpg"
                alt="Premium bike service hero"
                fill
                priority
                className="hero-image-main object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0c11]/90 via-[#0a0c11]/70 to-[#0a0c11]/35" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c11]/92 via-transparent to-[#0a0c11]/18" />
              <div className="royal-grid absolute inset-0" />
            </div>

            <div className="relative z-10 grid gap-8 p-5 sm:p-8 lg:grid-cols-[1fr_320px] lg:p-10">
              <div className="max-w-2xl">
                <Badge className="hero-badge-pop mb-4 border-[#c79c56]/50 bg-[#2a2118] text-[#eac37f]">Doorstep Bike Service</Badge>
                <h1 className="hero-title-reveal font-heading text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-[#ede9de] sm:text-6xl">
                  Premium Bike Service
                  <span className="hero-title-accent mt-2 block text-[#d2a454]">At Your Doorstep</span>
                </h1>
                <p className="mt-5 max-w-xl text-sm text-[#d0c6b6] sm:text-xl">
                  Expert care. Genuine parts. Affordable pricing. We come to you, so you save time.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {heroHighlights.map((item) => (
                    <div key={item.label} className="rounded-xl border border-[#4a3923] bg-black/35 px-3 py-2">
                      <div className="inline-flex items-center gap-2 text-xs text-[#f0d7a3]">
                        <item.icon className="h-3.5 w-3.5" />
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button asChild size="lg" className="min-w-[210px] justify-between">
                    <Link href="/booking">
                      Book Your Service
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="secondary"
                    size="lg"
                    className="min-w-[210px] justify-between border-[#7c6138] bg-transparent text-[#efe6d6] hover:bg-[#1f1a12]"
                  >
                    <a href="#services">
                      View All Services
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>

              <div className="lg:pt-44">
                <Card className="border-[#5f4928] bg-[rgba(17,20,27,0.92)] p-5">
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="font-semibold text-[#e6b45e]">At Your Doorstep</p>
                      <p className="text-[#cfc2ad]">We come to you</p>
                    </div>
                    <div>
                      <p className="font-semibold text-[#e6b45e]">On-Time Guarantee</p>
                      <p className="text-[#cfc2ad]">Service on time, every time</p>
                    </div>
                    <div>
                      <p className="font-semibold text-[#e6b45e]">Final Billing</p>
                      <p className="text-2xl font-extrabold text-[#f0d39d]">Set After Service</p>
                      <p className="text-[#cfc2ad]">Admin updates final amount after completion</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </Section>

        <Section id="services" title="Bike Care Services">
          <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4">
            {services.map((service, index) => {
              const Icon = serviceIcons[index % serviceIcons.length] ?? Wrench;
              return (
                <Card key={service._id} className="min-w-[270px] border-[#3c2d1d] bg-[#171b22] sm:min-w-0">
                  <CardContent className="p-5">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#2c2114] text-[#e6b45e]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold">{service.name}</h3>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">{service.description}</p>
                    <div className="mt-4 flex items-center justify-between text-sm font-semibold">
                      <span>Final amount shared after service</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {servicesError ? <p className="text-sm text-[var(--danger)]">{servicesError}</p> : null}
          </div>
        </Section>

        <Section id="how-it-works" title="How It Works">
          <div className="grid gap-4 lg:grid-cols-4">
            {steps.map((step, index) => (
              <Card key={step} className="relative border-[#3c2d1d] bg-[#171b22]">
                <CardContent className="p-5">
                  <p className="text-xs font-semibold text-[#e6b45e]">{String(index + 1).padStart(2, "0")}</p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="font-semibold">{step}</p>
                    {index < steps.length - 1 ? (
                      <ArrowRight
                        className={`how-step-arrow h-5 w-5 text-[#d7a85c] ${index === 0 ? "how-step-arrow-delay-1" : index === 1 ? "how-step-arrow-delay-2" : "how-step-arrow-delay-3"}`}
                      />
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>

        <Section title="Why Choose Us">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map((item) => (
              <Card key={item.title} className="border-[#3c2d1d] bg-[#171b22]">
                <CardContent className="p-5">
                  <item.icon className="h-5 w-5 text-[#e6b45e]" />
                  <p className="mt-3 font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>

        <Section id="zones" title="Service Zones" subtitle="Currently serving high-demand neighborhoods in Bengaluru.">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {zones.map((zone) => (
              <Card key={zone._id} className="border-[#3c2d1d] bg-[#171b22]">
                <CardContent className="flex items-center justify-between p-5">
                  <div>
                    <p className="font-semibold">{zone.name}</p>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">Doorstep coverage available</p>
                  </div>
                  <Shield className="h-5 w-5 text-[#e6b45e]" />
                </CardContent>
              </Card>
            ))}
          </div>
          {zonesError ? <p className="mt-3 text-sm text-[var(--danger)]">{zonesError}</p> : null}
        </Section>

        <Section>
          <Card className="border-[#5b4424] bg-gradient-to-r from-[#1b1f27] via-[#1f2531] to-[#2a2218] p-8 text-white">
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
              <div>
                <h3 className="font-heading text-2xl font-semibold text-[#f4d39b]">Ready To Service Your Bike?</h3>
                <p className="mt-2 max-w-2xl text-sm text-slate-100">
                  Location → Bike → Service → Time → Confirm. Built to complete bookings in minutes.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button asChild variant="secondary">
                    <Link href="/booking">Book a Service</Link>
                  </Button>
                  <Button asChild className="bg-slate-900 hover:bg-slate-800">
                    <Link href="/dashboard">Open Customer Dashboard</Link>
                  </Button>
                </div>
              </div>

              <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-2xl bg-[#141922]/75 p-3 shadow-[0_12px_26px_rgba(0,0,0,0.35)] lg:mx-0 lg:h-56 lg:w-56">
                <Image
                  src="/images/logo.png"
                  alt="Royal Mechanic logo"
                  width={190}
                  height={190}
                  className="object-contain"
                />
              </div>
            </div>
          </Card>
        </Section>
      </main>
    </div>
  );
}
