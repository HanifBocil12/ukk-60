// /api/guru/route.js
import { getGuru } from "@/controller/users.controller";

export async function GET() {
    return getGuru()
}