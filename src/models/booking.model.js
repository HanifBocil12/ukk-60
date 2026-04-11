import { PrismaClient } from "@prisma/client";
import { General } from "./general";
const prisma = new PrismaClient();

export const bookingModel = {
  ...General(prisma.booking),

  findAll: async () =>
    prisma.booking.findMany({
      include: {
        user: true,
        buku: true,
        transaksi: {
          include: {
            detailTrans: { include: { buku: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),

  findByUserId: async (userId) =>
    prisma.booking.findMany({
      where: { userId },
      include: {
        buku: true,
        transaksi: {
          include: {
            detailTrans: { include: { buku: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),

  findAllAdmin: async () =>
    prisma.booking.findMany({
      where: { status: "MENUNGGU" },
      include: {
        user: {
          include: {
            siswa: { include: { class: true } },
            guru: true,
          },
        },
        buku: true,
        transaksi: {
          include: {
            detailTrans: { include: { buku: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),

  createBooking: async (userId, bukuId, jumlah, durasi) => {
    const transaksi = await prisma.transaksi.create({
      data: {
        userId,
        tipe: "SISWA",
        tanggalPinjam: new Date(),
        status: "BOOKED",
        detailTrans: {
          create: {
            bukuId,
            jumlah,
            kondisiBuku: "",
          },
        },
      },
    });

    return prisma.booking.create({
      data: {
        transaksiId: transaksi.id,
        userId,
        bukuId,
        durasi,
        status: "MENUNGGU",
      },
    });
  },

  konfirmasiBooking: async (bookingId) => {
    // cuma set SIAP_AMBIL, belum eksekusi tanggal
    // tanggal baru dieksekusi waktu ada buku lain dikembalikan
    return prisma.booking.update({
      where: { id: bookingId },
      data: { status: "SIAP_AMBIL" },
    });
  },

  batalBooking: async (bookingId) => {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    await prisma.transaksi.update({
      where: { id: booking.transaksiId },
      data: { status: "SELESAI" },
    });

    return prisma.booking.update({
      where: { id: bookingId },
      data: { status: "BATAL" },
    });
  },
};