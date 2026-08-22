export type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "Partner Assigned"
  | "Partner On the Way"
  | "In Progress"
  | "Completed"
  | "Cancelled";

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

export interface Booking {
  id: string;
  customerName: string;
  bikeId: string;
  serviceId: string;
  assignedPartner: string;
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
  partner: string;
  rating: number;
  review: string;
  date: string;
}
