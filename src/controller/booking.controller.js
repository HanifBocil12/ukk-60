import { bookingModel } from "@/model/booking.model";
import jwt from "jsonwebtoken";

function getUserFromReq(req) {
  const cookie = req.headers.get("cookie") || "";
  const token = cookie.split(";").find((c) => c.trim().startsWith("token="))?.split("=")[1];
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

export async function getAllBooking() {
  try {
    const data = await bookingModel.findAll();
    return Response.json(data);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function getMyBooking(req) {
  try {
    const user = getUserFromReq(req);
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const data = await bookingModel.findByUserId(user.id);
    return Response.json(data);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function getAllBookingAdmin() {
  try {
    const data = await bookingModel.findAllAdmin();
    return Response.json(data);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function createBooking(req) {
  try {
    const user = getUserFromReq(req);
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const data = await bookingModel.createBooking(
      user.id,
      body.bukuId,
      body.jumlah,
      body.durasi,
    );
    return Response.json(data, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function konfirmasiBooking(id) {
  try {
    // set SIAP_AMBIL dulu, belum eksekusi tanggal
    const data = await bookingModel.konfirmasiBooking(Number(id));
    return Response.json(data);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function batalBooking(id) {
  try {
    const data = await bookingModel.batalBooking(Number(id));
    return Response.json(data);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}