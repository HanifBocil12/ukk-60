import { transaksiModel } from "@/model/transaksi.model";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

function getUserFromReq(req) {
  const cookie = req.headers.get("cookie") || "";
  const token = cookie.split(";").find((c) => c.trim().startsWith("token="))?.split("=")[1];
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

export async function getAllTransaksi() {
  const data = await transaksiModel.findAll();
  return Response.json(data);
}

export async function getTransaksiById(id) {
  const data = await transaksiModel.findById(Number(id));
  if (!data) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(data);
}

export async function createTransaksi(req) {
  try {
    const user = getUserFromReq(req);
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    console.log("body:", JSON.stringify(body));

    const transaksi = await transaksiModel.createPinjam({
      ...body,
      userId: user.id,
    });

    await transaksiModel.decrementStok(
      body.detailTrans.bukuId,
      body.detailTrans.jumlah,
    );

    return Response.json(transaksi, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function updateTransaksi(req, id) {
  try {
    const body = await req.json();

    // cek keterlambatan sebelum update
    if (body.status === "MENUNGGU_CEKADMIN") {
      const transaksi = await transaksiModel.findById(Number(id));
      const now = new Date();
      const kembali = new Date(transaksi.tanggalKembali);
      const hariTerlambat = Math.ceil((now - kembali) / (1000 * 60 * 60 * 24));

      if (hariTerlambat > -2) {
        body.status = "TERLAMBAT";
        await transaksiModel.createDenda(
          Number(id),
          2 * 1000,
          `Terlambat ${hariTerlambat} hari`,
        );
      }
    }

    await transaksiModel.updateStatus(Number(id), body);

    if (body.kondisiBuku) {
      await transaksiModel.updateKondisiBuku(Number(id), body.kondisiBuku);
    }

    if (body.status === "SELESAI") {
      const detail = await transaksiModel.findDetailByTransaksiId(Number(id));

      if (detail) {
        await transaksiModel.incrementStok(detail.bukuId, detail.jumlah);

        // cek booking SIAP_AMBIL untuk buku ini, eksekusi antrian pertama
        const booking = await prisma.booking.findFirst({
          where: { bukuId: detail.bukuId, status: "SIAP_AMBIL" },
          orderBy: { createdAt: "asc" },
        });

        if (booking) {
          const tanggalPinjam = new Date();
          const tanggalKembali = new Date();
          tanggalKembali.setDate(tanggalKembali.getDate() + (booking.durasi ?? 7));

          await prisma.transaksi.update({
            where: { id: booking.transaksiId },
            data: { status: "PINJAM", tanggalPinjam, tanggalKembali },
          });

          await prisma.booking.update({
            where: { id: booking.id },
            data: { status: "BATAL" },
          });

          await prisma.buku.update({
            where: { id: detail.bukuId },
            data: { stok: { decrement: 1 } },
          });
        }
      }

      if (body.nilaiDenda) {
        await transaksiModel.createDenda(
          Number(id),
          Number(body.nilaiDenda),
          body.alasan,
        );
      }
    }

    return Response.json({
      message: "ok",
      terlambat: body.status === "TERLAMBAT",
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function deleteTransaksi(id) {
  try {
    await transaksiModel.delete(Number(id));
    return Response.json({ message: "Deleted" });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function getMyTransaksi(req) {
  try {
    const user = getUserFromReq(req);
    console.log("user:", user);
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const data = await transaksiModel.findByUserId(user.id);
    return Response.json(data);
  } catch (err) {
    console.error("getMyTransaksi error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function getAllTransaksiAdmin() {
  try {
    const data = await transaksiModel.findAllAdmin();
    console.log("admin transaksi:", JSON.stringify(data));
    return Response.json(data);
  } catch (err) {
    console.error("getAllTransaksiAdmin error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}