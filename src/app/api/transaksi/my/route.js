import { getMyTransaksi } from "@/Controllers/transaksi.contoller";

export async function GET(req) {
  return getMyTransaksi(req);
}