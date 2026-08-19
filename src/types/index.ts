export type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "Assigned"
  | "In Progress"
  | "Completed"
  | "Cancelled"
  | "Mechanic Assigned"
  | "Mechanic Accepted"
  | "Mechanic On the Way"
  | "Service Started";

export interface Bike {
  id: string;
  brand: string;
  model: string;
  variant?: string;
  registrationNumber: string;
  lastServiceDate: string;
  fuelType: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  startingPrice: number;
}

export interface ServicePackage {
  id: string;
  name: string;
  price: number;
  popular?: boolean;
  includes: string[];
  duration: string;
}

export interface Mechanic {
  id: string;
  name: string;
  phone: string;
  rating: number;
  distanceKm: number;
  jobsCompleted: number;
  slots: string[];
  services: string[];
  location: string;
  availability: boolean;
}

export interface Booking {
  id: string;
  customerName: string;
  bikeId: string;
  serviceId: string;
  mechanicId: string;
  date: string;
  time: string;
  amount: number;
  status: BookingStatus;
  location: string;
}

export interface Review {
  id: string;
  customer: string;
  service: string;
  mechanic: string;
  rating: number;
  review: string;
  date: string;
}
