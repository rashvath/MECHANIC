import { Bike, Booking, Review, ServiceCategory, ServicePackage } from "@/types";

export const serviceCategories: ServiceCategory[] = [
  { id: "cat-1", name: "General Service", description: "Complete health check and tune-up.", icon: "Wrench", startingPrice: 499 },
  { id: "cat-2", name: "Oil Change", description: "Engine oil top-up and replacement.", icon: "Droplets", startingPrice: 349 },
  { id: "cat-3", name: "Brake Service", description: "Brake inspection and calibration.", icon: "Disc", startingPrice: 399 },
  { id: "cat-4", name: "Battery", description: "Battery check and terminal care.", icon: "Battery", startingPrice: 299 },
  { id: "cat-5", name: "Tyre & Wheel", description: "Wheel alignment and tyre care.", icon: "Circle", startingPrice: 449 },
  { id: "cat-6", name: "Chain Service", description: "Chain cleaning and lubrication.", icon: "Link", startingPrice: 249 },
  { id: "cat-7", name: "Engine Service", description: "Deep engine diagnostics.", icon: "Cog", startingPrice: 899 },
  { id: "cat-8", name: "Electrical", description: "Wiring and lights diagnostics.", icon: "Zap", startingPrice: 399 },
  { id: "cat-9", name: "AC / Cooling", description: "Cooling system check where applicable.", icon: "Snowflake", startingPrice: 499 },
  { id: "cat-10", name: "EV Service", description: "EV system and controller check.", icon: "Plug", startingPrice: 699 },
];

export const servicePackages: ServicePackage[] = [
  {
    id: "pkg-basic",
    name: "Basic Service",
    price: 499,
    duration: "45-60 min",
    includes: ["General inspection", "Engine oil check", "Brake inspection", "Tyre pressure", "Chain lubrication"],
  },
  {
    id: "pkg-premium",
    name: "Premium Service",
    price: 799,
    duration: "75-90 min",
    popular: true,
    includes: ["Everything in Basic", "Detailed inspection", "Battery check", "Air filter check", "Brake adjustment"],
  },
  {
    id: "pkg-complete",
    name: "Complete Service",
    price: 1199,
    duration: "120 min",
    includes: ["Full diagnostics", "Engine tuning", "Brake overhaul", "Electrical scan", "Wash and polish", "Road-test report"],
  },
];

export const bikes: Bike[] = [
  { id: "bike-1", brand: "Honda", model: "Activa 6G", registrationNumber: "KA01AB2345", lastServiceDate: "10 Jun 2026", fuelType: "Petrol" },
  { id: "bike-2", brand: "Royal Enfield", model: "Classic 350", registrationNumber: "KA03CD1122", lastServiceDate: "28 Apr 2026", fuelType: "Petrol" },
  { id: "bike-3", brand: "TVS", model: "Jupiter", registrationNumber: "KA05XY7854", lastServiceDate: "14 May 2026", fuelType: "Petrol" },
  { id: "bike-4", brand: "Yamaha", model: "R15", registrationNumber: "KA51PL3399", lastServiceDate: "22 Mar 2026", fuelType: "Petrol" },
];

export const bookings: Booking[] = [
  {
    id: "BK-20260820-1024",
    customerName: "Rahul Shetty",
    bikeId: "bike-1",
    serviceId: "pkg-premium",
    assignedPartner: "Rajesh Kumar",
    date: "20 Aug 2026",
    time: "4:00 PM",
    amount: 799,
    status: "Partner Assigned",
    location: "HSR Layout, Bengaluru",
  },
  {
    id: "BK-20260812-0932",
    customerName: "Rahul Shetty",
    bikeId: "bike-2",
    serviceId: "pkg-basic",
    assignedPartner: "Arjun R",
    date: "12 Aug 2026",
    time: "10:30 AM",
    amount: 499,
    status: "Completed",
    location: "Koramangala, Bengaluru",
  },
];

export const reviews: Review[] = [
  {
    id: "rev-1",
    customer: "Sneha M",
    service: "Premium Service",
    partner: "Rajesh Kumar",
    rating: 5,
    review: "Excellent doorstep service and very transparent explanation of work.",
    date: "14 Aug 2026",
  },
  {
    id: "rev-2",
    customer: "Akash P",
    service: "Brake Service",
    partner: "Arjun R",
    rating: 4,
    review: "Quick response and smooth pickup at my apartment parking.",
    date: "11 Aug 2026",
  },
];

export const adminStats = [
  { label: "Total Users", value: "1,284" },
  { label: "Active Partners", value: "86" },
  { label: "Today's Bookings", value: "124" },
  { label: "Completed Services", value: "98" },
  { label: "Revenue", value: "₹1,24,500" },
  { label: "Cancellation Rate", value: "4.2%" },
];

export const chartSeries = [
  { name: "Mon", bookings: 82, users: 12, revenue: 42000 },
  { name: "Tue", bookings: 95, users: 18, revenue: 57000 },
  { name: "Wed", bookings: 110, users: 24, revenue: 61000 },
  { name: "Thu", bookings: 124, users: 26, revenue: 78000 },
  { name: "Fri", bookings: 98, users: 21, revenue: 64000 },
  { name: "Sat", bookings: 141, users: 32, revenue: 91000 },
];

export const serviceDistribution = [
  { name: "General", value: 28 },
  { name: "Premium", value: 21 },
  { name: "Engine", value: 16 },
  { name: "Brake", value: 18 },
  { name: "EV", value: 17 },
];
