import { bukuModel } from "@/model/buku.model";
import { writeFile } from "fs/promises";
import path from "path";

export async function getBuku(req) {
  const buku = await bukuModel.findAll();
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
  delete data.jenisBukuId; 

  const buku = await bukuModel.create({
    ...data,
    jenisBuku: { connect: { id: jenisBukuId } } 
  });

  return Response.json(buku, { status: 201 });
}

export async function getTrendingBuku() {
  const data = await bukuModel.findTrending();
  return Response.json(data);
}

export async function updateBuku(req, { params }) {
  const data = await req.json();
  const buku = await bukuModel.update(parseInt(params.id), data);
  return Response.json(buku);
}

export async function deleteBuku(req, ctx) {
    const {id} = await ctx.params
  const buku = await bukuModel.delete(parseInt(id));
  return Response.json({ message: "berhasil dihapus" });
}