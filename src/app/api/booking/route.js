import { getAllBooking, createBooking } from "@/Controllers/booking.controller";

export async function GET() {
  return getAllBooking();
}

export async function POST(req) {
  return createBooking(req);
}