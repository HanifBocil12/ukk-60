import { getAllBookingAdmin } from "@/Controllers/booking.controller";

export async function GET() {
  return getAllBookingAdmin();
}