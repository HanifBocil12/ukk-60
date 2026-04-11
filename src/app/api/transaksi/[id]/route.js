import { getTransaksiById,updateTransaksi, deleteTransaksi } from "@/Controllers/transaksi.contoller";

export async function GET(_, { params }) {
  const { id } = await params;
  return getTransaksiById(id);
}

export async function PUT(req, { params }) {
  const { id } = await params;
  return updateTransaksi(req, id);
}

export async function DELETE(_, { params }) {
  const { id } = await params;
  return deleteTransaksi(id);
}