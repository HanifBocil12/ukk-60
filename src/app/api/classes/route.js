// app/api/classes/route.js
import { getKelas } from "@/controller/kelas.controller";


export async function GET(req) {
  return getKelas(req);
}

