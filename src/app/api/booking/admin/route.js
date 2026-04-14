import { getAllBookingAdmin } from "@/Controller/booking.controller";

export async function GET() {
  return getAllBookingAdmin();
}