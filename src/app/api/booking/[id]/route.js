import { konfirmasiBooking, batalBooking } from "@/Controllers/booking.controller";

export async function PUT(req, { params }) {
  const { id } = await params;
  return konfirmasiBooking(id);
}

export async function DELETE(_, { params }) {
  const { id } = await params;
  return batalBooking(id);
}