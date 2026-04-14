import { getAllTransaksiAdmin } from "@/Controller/transaksi.controller";

export async function GET() {
  return getAllTransaksiAdmin();
}