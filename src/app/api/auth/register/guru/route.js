// app/api/auth/register/guru/route.js
import { registerGuru, getGuru } from "@/controller/Auth/auth.controller";

export async function GET(req) {
  return getGuru(req)
}
export async function POST(req) {
  return registerGuru(req);
}