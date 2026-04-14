import { registerSiswa,getSiswa } from "@/controller/Auth/auth.controller"

export async function GET(req) {
    return getSiswa(req)
}
export async function POST(req) {
    return registerSiswa(req)
}