import { getAllBooking, createBooking } from "@/Controller/booking.controller";

export async function GET() {
  return getAllBooking();
}

export async function POST(req) {
  return createBooking(req);
}