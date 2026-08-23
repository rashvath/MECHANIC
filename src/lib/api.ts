import { authStorageKeys } from "@/mock/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api";

export type ApiService = {
  _id: string;
  name: string;
  description: string;
  startingPrice: number;
  isActive: boolean;
};

export type ApiServiceZone = {
  _id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ApiDetailedBillItem = {
  id: string;
  name: string;
  description: string;
  price: number;
};

export type ApiDetailedBill = {
  billNumber: string;
  createdAt: string;
  baseServiceCharge: number;
  additionalItems: ApiDetailedBillItem[];
  additionalTotal: number;
  subtotal: number;
  discountType: "none" | "fixed" | "percentage";
  discountValue: number;
  discountAmount: number;
  taxType: "none" | "fixed" | "percentage";
  taxValue: number;
  taxAmount: number;
  finalPayableAmount: number;
  note: string;
  preparedBy: {
    id: string;
    name: string;
    role: string;
  };
};

export type ApiAdminBooking = {
  _id: string;
  bikeName: string;
  mobileNumber?: string;
  serviceAddress?: string;
  scheduledDate: string;
  scheduledTime: string;
  status: "pending_approval" | "approved" | "payment_pending" | "paid" | "rejected";
  createdAt: string;
  payment: {
    amount: number;
    method: "cash" | "online" | "none";
    paidAt?: string;
    invoiceNumber?: string;
  };
  userId: {
    _id: string;
    name: string;
    email: string;
    mobile?: string;
  } | null;
  serviceIds: Array<{
    _id: string;
    name: string;
    startingPrice: number;
  }>;
  detailedBill?: ApiDetailedBill | null;
};

export type ApiAdminUser = {
  _id: string;
  name: string;
  email: string;
  joinedAt: string;
  totalBookings: number;
  status: "active" | "new";
};

export type ApiUserBooking = {
  _id: string;
  bikeName: string;
  mobileNumber?: string;
  serviceAddress?: string;
  scheduledDate: string;
  scheduledTime: string;
  status: "pending_approval" | "approved" | "payment_pending" | "paid" | "rejected";
  createdAt: string;
  payment: {
    amount: number;
    method: "cash" | "online" | "none";
    paidAt?: string;
    invoiceNumber?: string;
  };
  serviceIds: Array<{
    _id: string;
    name: string;
    description?: string;
    startingPrice: number;
  }>;
  detailedBill?: ApiDetailedBill | null;
};

export type ApiReview = {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  userId?: {
    _id: string;
    name: string;
    email: string;
  };
  bookingId: {
    _id: string;
    bikeName: string;
    status: "pending_approval" | "approved" | "payment_pending" | "paid" | "rejected";
    scheduledDate?: string;
    scheduledTime?: string;
    serviceIds?: Array<{
      _id: string;
      name: string;
    }>;
  };
};

export type AuthResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    mobile?: string;
    role: "admin" | "user";
  };
};

function buildHeaders(token?: string) {
  const headers: HeadersInit = {
    "Content-Type": "application/json"
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function apiRequest<T>(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${path}`, options);
  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof body === "object" && body && "message" in body ? String(body.message) : "Request failed";
    throw new Error(message);
  }

  return body as T;
}

export function getAdminToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(authStorageKeys.admin);
}

export function getUserToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(authStorageKeys.user);
}

export function setAdminToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(authStorageKeys.admin, token);
}

export function setUserToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(authStorageKeys.user, token);
}

export async function login(payload: { password: string; email?: string; mobile?: string }) {
  const normalizedMobile = String(payload.mobile || "").replace(/\D/g, "");
  const normalizedEmail = String(payload.email || "").trim().toLowerCase();

  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({
      password: payload.password,
      email: normalizedEmail || undefined,
      mobile: normalizedMobile || undefined,
    })
  });
}

export async function register(name: string, mobile: string, password: string, email?: string) {
  const normalizedMobile = String(mobile || "").replace(/\D/g, "");

  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({ name, email: String(email || "").trim() || undefined, mobile: normalizedMobile, password })
  });
}

export async function fetchServices() {
  return apiRequest<ApiService[]>("/services");
}

export async function fetchServiceZones() {
  return apiRequest<ApiServiceZone[]>("/service-zones");
}

export async function createService(payload: { name: string; description: string; startingPrice: number }, token: string) {
  return apiRequest<ApiService>("/admin/services", {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify(payload)
  });
}

export async function updateService(serviceId: string, payload: Partial<{ name: string; description: string; startingPrice: number }>, token: string) {
  return apiRequest<ApiService>(`/admin/services/${serviceId}`, {
    method: "PATCH",
    headers: buildHeaders(token),
    body: JSON.stringify(payload)
  });
}

export async function deleteService(serviceId: string, token: string) {
  return apiRequest<{ message: string }>(`/admin/services/${serviceId}`, {
    method: "DELETE",
    headers: buildHeaders(token)
  });
}

export async function fetchAdminServiceZones(token: string) {
  return apiRequest<ApiServiceZone[]>("/admin/service-zones", {
    method: "GET",
    headers: buildHeaders(token)
  });
}

export async function createAdminServiceZone(name: string, token: string) {
  return apiRequest<ApiServiceZone>("/admin/service-zones", {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify({ name })
  });
}

export async function updateAdminServiceZone(zoneId: string, payload: Partial<{ name: string; isActive: boolean }>, token: string) {
  return apiRequest<ApiServiceZone>(`/admin/service-zones/${zoneId}`, {
    method: "PATCH",
    headers: buildHeaders(token),
    body: JSON.stringify(payload)
  });
}

export async function deleteAdminServiceZone(zoneId: string, token: string) {
  return apiRequest<{ message: string }>(`/admin/service-zones/${zoneId}`, {
    method: "DELETE",
    headers: buildHeaders(token)
  });
}

export async function fetchAdminBookings(token: string) {
  return apiRequest<ApiAdminBooking[]>("/admin/bookings", {
    method: "GET",
    headers: buildHeaders(token)
  });
}

export async function fetchAdminBookingById(bookingId: string, token: string) {
  return apiRequest<ApiAdminBooking>(`/admin/bookings/${bookingId}`, {
    method: "GET",
    headers: buildHeaders(token)
  });
}

export async function fetchAdminUsers(token: string) {
  return apiRequest<ApiAdminUser[]>("/admin/users", {
    method: "GET",
    headers: buildHeaders(token)
  });
}

export async function approveAdminBooking(bookingId: string, token: string, adminNote?: string) {
  return apiRequest<ApiAdminBooking>(`/admin/bookings/${bookingId}/approve`, {
    method: "PATCH",
    headers: buildHeaders(token),
    body: JSON.stringify({ adminNote })
  });
}

export async function updateAdminBookingPayment(bookingId: string, token: string, payload: { amount: number; method: "cash" | "online" }) {
  return apiRequest<ApiAdminBooking>(`/admin/bookings/${bookingId}/payment`, {
    method: "PATCH",
    headers: buildHeaders(token),
    body: JSON.stringify(payload)
  });
}

export async function saveDetailedBill(
  bookingId: string,
  token: string,
  payload: {
    baseServiceCharge: number;
    additionalItems: ApiDetailedBillItem[];
    discountType: "none" | "fixed" | "percentage";
    discountValue: number;
    taxType: "none" | "fixed" | "percentage";
    taxValue: number;
    note?: string;
  }
) {
  return apiRequest<ApiAdminBooking>(`/admin/bookings/${bookingId}/detailed-bill`, {
    method: "PATCH",
    headers: buildHeaders(token),
    body: JSON.stringify(payload)
  });
}

export async function fetchMyBookings(token: string) {
  return apiRequest<ApiUserBooking[]>("/bookings/me", {
    method: "GET",
    headers: buildHeaders(token)
  });
}

export async function fetchMyReviews(token: string) {
  return apiRequest<ApiReview[]>("/reviews/me", {
    method: "GET",
    headers: buildHeaders(token)
  });
}

export async function createReview(payload: { bookingId: string; rating: number; comment: string }, token: string) {
  return apiRequest<ApiReview>("/reviews", {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify(payload)
  });
}

export async function fetchAdminReviews(token: string) {
  return apiRequest<ApiReview[]>("/admin/reviews", {
    method: "GET",
    headers: buildHeaders(token)
  });
}

export async function downloadInvoiceHtml(bookingId: string, token: string) {
  const response = await fetch(`${API_BASE}/invoices/${bookingId}/download`, {
    method: "GET",
    headers: buildHeaders(token)
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Unable to download invoice");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `invoice-${bookingId}.html`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export async function createBooking(
  payload: {
    bikeName: string;
    mobileNumber: string;
    serviceAddress: string;
    serviceIds: string[];
    scheduledDate: string;
    scheduledTime: string;
  },
  token: string,
) {
  return apiRequest<{ _id: string }>("/bookings", {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify(payload)
  });
}
