import { getAllTransaksi, createTransaksi } from "@/Controllers/transaksi.contoller";

export async function GET() {
  return getAllTransaksi();
}

export async function POST(req) {
  return createTransaksi(req);
}