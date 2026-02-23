// app/api/auth/login/route.js
import { login } from "@/Controllers/Auth/auth.controller";

export async function POST(req) {
  return login(req);
}