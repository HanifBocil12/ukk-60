import { getTrendingBuku } from "@/Controllers/buku.controller";

export async function GET() {
  return getTrendingBuku();
}