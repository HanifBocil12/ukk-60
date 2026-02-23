import { getBuku,createBuku } from "@/Controllers/buku.controller";

export async function GET(req) {
    return getBuku(req)
}
export async function POST(req) {
    return createBuku(req)
}