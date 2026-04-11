import { PrismaClient } from "@prisma/client";
import { General } from "./general";
const prisma = new PrismaClient();

export const transaksiModel = {
  ...General(prisma.transaksi),

  findAll: async () =>
    prisma.transaksi.findMany({
      include: {
        user: {
          include: {
            siswa: true,
            guru: true,
          },
        },
        detailTrans: {
          include: { buku: true },
        },
      },
    }),

  findByUserId: async (userId) =>
    prisma.transaksi.findMany({
      where: { userId },
      include: {
        detailTrans: {
          include: { buku: { include: { jenisBuku: true } } },
        },
        denda: true,
      },
    }),

  createDenda: async (transaksiId, nilaiDenda, alasan) =>
    prisma.denda.create({
      data: {
        transaksiId,
        nilaiDenda,
        alasan: alasan ?? null,
      },
    }),

  findAllAdmin: async () =>
    prisma.transaksi.findMany({
      where: {
        status: { in: ["PINJAM", "TERLAMBAT", "MENUNGGU_CEKADMIN"] },
      },
      include: {
        user: {
          include: {
            siswa: { include: { class: true } },
            guru: true,
          },
        },
        detailTrans: { include: { buku: true } },
        denda: true,
      },
      orderBy: { createdAt: "desc" },
    }),

  updateStatus: async (id, data) =>
    prisma.transaksi.update({
      where: { id },
      data: {
        status: data.status,
        keterangan: data.keterangan,
      },
    }),

  updateKondisiBuku: async (transaksiId, kondisiBuku) =>
    prisma.detailTransaksi.updateMany({
      where: { transaksiId },
      data: { kondisiBuku },
    }),

  createPinjam: async (payload) =>
    prisma.transaksi.create({
      data: {
        userId: payload.userId,
        tipe: payload.tipe,
        tanggalPinjam: new Date(payload.tanggalPinjam),
        tanggalKembali: new Date(payload.tanggalKembali),
        status: "PINJAM",
        detailTrans: {
          create: {
            bukuId: payload.detailTrans.bukuId,
            jumlah: payload.detailTrans.jumlah,
            kondisiBuku: payload.detailTrans.kondisiBuku ?? "BAIK",
          },
        },
      },
      include: { detailTrans: true },
    }),

  decrementStok: async (bukuId, jumlah) =>
    prisma.buku.update({
      where: { id: bukuId },
      data: { stok: { decrement: jumlah } },
    }),

  incrementStok: async (bukuId, jumlah) =>
    prisma.buku.update({
      where: { id: bukuId },
      data: { stok: { increment: jumlah } },
    }),

  findDetailByTransaksiId: async (transaksiId) =>
    prisma.detailTransaksi.findFirst({ where: { transaksiId } }),
};