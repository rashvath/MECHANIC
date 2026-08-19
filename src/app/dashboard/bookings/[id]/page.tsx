import { BookingTracking } from "@/components/dashboard/booking-tracking";

export default async function BookingTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BookingTracking bookingId={id} />;
}
