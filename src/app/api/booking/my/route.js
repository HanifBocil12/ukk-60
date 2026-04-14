import { getMyBooking } from "@/controller/booking.controller";

export async function GET(req) {
  return getMyBooking(req);
}