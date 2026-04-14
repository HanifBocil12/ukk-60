import { getTrendingBuku } from "@/controller/buku.contoller";

export async function GET() {
  return getTrendingBuku();
}