import { getAllTransaksiAdmin } from "@/Controllers/transaksi.contoller";

export async function GET() {
  return getAllTransaksiAdmin();
}