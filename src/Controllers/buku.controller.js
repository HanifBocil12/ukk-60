import { BukuModel } from "@/models/buku.model";
// import { getSchema } from "@/lib/schema";
import { writeFile } from "fs/promises";
import path from "path";

export async function getBuku(req) {
  const bku = await BukuModel.findAll();
  return Response.json(bku);
}

export async function createBuku(req) {
  const formData = await req.formData();

  const data = {};
  formData.forEach((value, key) => {
    // skip field relasi kosong
    if (["jenisBuku", "detailTrans", "booking"].includes(key)) return;
    data[key] = value;
  });

  // Handle upload gambar
  const file = formData.get("image_buku");
  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}_${file.name}`;
    const filepath = path.join(process.cwd(), "public/uploads", filename);
    await writeFile(filepath, buffer);
    data.image_buku = `/uploads/${filename}`;
  }

  data.tahun = parseInt(data.tahun);
  data.stok  = parseInt(data.stok);
  const jenisBukuId = parseInt(data.jenisBukuId);
  delete data.jenisBukuId; // ← hapus, ganti pakai connect

  const buku = await BukuModel.create({
    ...data,
    jenisBuku: { connect: { id: jenisBukuId } } // ← ini yang Prisma minta
  });

  return Response.json(buku, { status: 201 });
}

export async function updateBuku(req, { params }) {
  const data = await req.json();
  const buku = await BukuModel.update(parseInt(params.id), data);
  return Response.json(buku);
}

export async function deleteBuku(req, ctx) {
    const {id} = await ctx.params
  const buku = await BukuModel.delete(parseInt(id));
  return Response.json({ message: "berhasil dihapus" });
}
