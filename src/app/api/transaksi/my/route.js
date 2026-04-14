import { getMyTransaksi } from "@/controller/transaksi.controller";

export async function GET(req) {
  return getMyTransaksi(req);
}