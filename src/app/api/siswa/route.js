// /api/guru/route.js
import { getSiswa } from "@/controller/users.controller";

export async function GET() {
    return getSiswa()
}