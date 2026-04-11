// /api/guru/route.js
import { getGuru } from "@/Controllers/users.controller";

export async function GET() {
    return getGuru()
}