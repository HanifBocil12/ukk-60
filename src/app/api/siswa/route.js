// /api/guru/route.js
import { getSiswa } from "@/Controllers/users.controller";

export async function GET() {
    return getSiswa()
}