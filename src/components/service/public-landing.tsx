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
  LocateFixed,
  MapPin,
  Plug,
  ShieldCheck,
  Snowflake,
  Star,
  Timer,
  Wrench,
  Zap,
} from "lucide-react";
import { mechanics, serviceCategories, servicePackages } from "@/mock/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Section } from "@/components/layout/section";
import { PublicHeader } from "@/components/navbar/public-header";
import { MapPlaceholder } from "@/components/maps/map-placeholder";
import { TypingHeadline } from "@/components/service/typing-headline";

const iconMap = {
  Wrench,
  Droplets,
  Disc,
  Battery,
  Circle,
  Link: Link2,
  Cog,
  Zap,
  Snowflake,
  Plug,
};

const whyChooseUs = [
  { title: "Verified Mechanics", icon: ShieldCheck },
  { title: "Transparent Pricing", icon: Star },
  { title: "Doorstep Convenience", icon: MapPin },
  { title: "Genuine Parts", icon: Cog },
  { title: "Service Warranty", icon: ShieldCheck },
  { title: "Digital Service History", icon: Timer },
  { title: "Flexible Slots", icon: Timer },
  { title: "Trusted Service", icon: Star },
];

const steps = ["Select Your Bike", "Choose Service", "Mechanic Comes to You", "Bike Serviced at Your Doorstep"];

export function PublicLanding() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <PublicHeader />

      <main>
        <Section className="pt-8 sm:pt-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <Badge className="mb-4">Bike service at your doorstep.</Badge>
              <TypingHeadline
                text="Professional Bike Service, Right at Your Doorstep."
                className="font-heading text-3xl font-semibold leading-tight tracking-tight sm:text-5xl"
              />
              <p className="mt-4 max-w-xl text-sm text-[var(--muted-foreground)] sm:text-lg">
                Book a trusted mechanic and get your bike serviced without visiting a garage.
              </p>

              <Card className="mt-6 p-3 sm:p-4">
                <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-[var(--muted-foreground)]" />
                    <Input className="pl-9" placeholder="Enter your location or PIN code" />
                  </div>
                  <Button variant="secondary" className="gap-2">
                    <LocateFixed className="h-4 w-4" /> Detect
                  </Button>
                  <Button>Search</Button>
                </div>
              </Card>

              <div className="mt-5 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/booking">Book a Service</Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <a href="#services">Explore Services</a>
                </Button>
              </div>
            </div>

            <div className="relative h-[320px] overflow-hidden rounded-3xl border border-[var(--border)] sm:h-[420px]">
              <div className="hero-orb-1 absolute -left-8 top-6 h-28 w-28 rounded-full bg-sky-100/70 blur-xl" />
              <div className="hero-orb-2 absolute bottom-8 -right-8 h-36 w-36 rounded-full bg-cyan-100/70 blur-xl" />
              <Image
                src="/images/girl-drying-motorcycle-headlight-with-blue-cloth-biker-woman-cleaning-caring-her-motorcycle_137603-256.jpg"
                alt="Mechanic cleaning bike"
                fill
                className="hero-image-main object-cover"
                priority
              />
              <div className="hero-image-float absolute -bottom-5 right-5 hidden h-32 w-44 overflow-hidden rounded-2xl border border-white/70 shadow-xl sm:block">
                <Image
                  src="/images/how-effectively-clean-maintain-motorcycle-handlebars-better-riding-experience_431161-111843.jpg"
                  alt="Bike handlebar care"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/50 to-transparent p-6 text-white">
                <p className="text-xs uppercase tracking-widest text-slate-200">Trusted mechanics</p>
                <p className="mt-1 text-lg font-semibold">60-minute average doorstep response in major zones</p>
              </div>
            </div>
          </div>
        </Section>

        <Section id="services" title="What does your bike need?">
          <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4">
            {serviceCategories.map((category) => {
              const Icon = iconMap[category.icon as keyof typeof iconMap] ?? Wrench;
              return (
                <Card key={category.id} className="min-w-[270px] sm:min-w-0">
                  <CardContent className="p-5">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">{category.description}</p>
                    <div className="mt-4 flex items-center justify-between text-sm font-semibold">
                      <span>₹{category.startingPrice} onwards</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Section>

        <Section title="Popular Service Packages" subtitle="Compare transparent plans and book in one tap.">
          <div className="grid gap-4 lg:grid-cols-3">
            {servicePackages.map((pack) => (
              <Card key={pack.id} className={pack.popular ? "border-[var(--primary)]" : ""}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{pack.name}</CardTitle>
                    {pack.popular ? <Badge>Most Popular</Badge> : null}
                  </div>
                  <p className="mt-1 text-xl font-semibold">₹{pack.price} onwards</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
                    {pack.includes.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button className="mt-5 w-full">Book Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>

        <Section id="how-it-works" title="How It Works">
          <div className="grid gap-4 lg:grid-cols-4">
            {steps.map((step, index) => (
              <Card key={step} className="relative">
                <CardContent className="p-5">
                  <p className="text-xs font-semibold text-[var(--primary)]">{String(index + 1).padStart(2, "0")}</p>
                  <p className="mt-2 font-semibold">{step}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>

        <Section title="Why Choose Us">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map((item) => (
              <Card key={item.title}>
                <CardContent className="p-5">
                  <item.icon className="h-5 w-5 text-[var(--primary)]" />
                  <p className="mt-3 font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                    Service quality checkpoints and transparent updates on every booking.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>

        <Section id="find-service" title="Find Service" subtitle="Check mechanic availability in your area.">
          <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
            <Card>
              <CardContent className="space-y-4 p-5">
                <Input placeholder="Search by location" />
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="PIN code" />
                  <Input placeholder="Service area" />
                </div>
                <h3 className="text-sm font-semibold">Nearby mechanics</h3>
                <div className="space-y-3">
                  {mechanics.map((m) => (
                    <Card key={m.id} className="border-dashed">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold">{m.name}</p>
                          <Badge variant="neutral">{m.rating} ★</Badge>
                        </div>
                        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                          {m.distanceKm} km away · {m.jobsCompleted} jobs
                        </p>
                        <p className="mt-2 text-xs text-[var(--muted-foreground)]">Slots: {m.slots.join(", ")}</p>
                        <Button variant="secondary" size="sm" className="mt-3">
                          View Profile
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
            <MapPlaceholder />
          </div>
        </Section>

        <Section>
          <Card className="bg-[var(--primary)] p-8 text-white">
            <h3 className="font-heading text-2xl font-semibold">Bike service at your doorstep.</h3>
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
          </Card>
        </Section>
      </main>
    </div>
  );
}
