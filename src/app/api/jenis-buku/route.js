import { getJenisBuku,createJenisBuku } from "@/Controllers/jenisbuku.conteoller"

export async function GET(req) {
    const JenisBuku = getJenisBuku()
    return JenisBuku
}

export async function POST(req) {
    return createJenisBuku(req)
}