import { getJenisBuku,createJenisBuku } from "@/controller/jenisbuku.controller"

export async function GET(req) {
    const JenisBuku = getJenisBuku()
    return JenisBuku
}

export async function POST(req) {
    return createJenisBuku(req)
}