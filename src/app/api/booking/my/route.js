import { getMyBooking } from "@/Controllers/booking.controller";

export async function GET(req) {
  return getMyBooking(req);
}