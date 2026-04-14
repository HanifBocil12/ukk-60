import { getAllTransaksi, createTransaksi } from "@/controller/transaksi.controller";

export async function GET() {
  return getAllTransaksi();
}

export async function POST(req) {
  return createTransaksi(req);
}