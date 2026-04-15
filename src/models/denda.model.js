import { PrismaClient } from "@prisma/client";
import { General } from "./general";
const prisma = new PrismaClient();

export const dendaModel = {
  ...General(prisma.denda),

  findAll: async () =>
    prisma.denda.findMany({
      include: {
        transaksi: {
          include: {
            user: true,
            detailTrans: { include: { buku: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),

  findByUserId: async (userId) =>
    prisma.denda.findMany({
      where: { transaksi: { userId } },
      include: {
        transaksi: {
          include: {
            detailTrans: { include: { buku: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
};