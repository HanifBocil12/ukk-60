import { getBuku,createBuku } from "@/controller/buku.contoller";

export async function GET(req) {
    return getBuku(req)
}
export async function POST(req) {
    return createBuku(req)
}