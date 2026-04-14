import { PrismaClient } from "@prisma/client";
import { general } from "./general.js";

const prisma = new PrismaClient()

export const dendaModel = ({
    ...general(prisma.denda),

    findAll: async () => {
        prisma.denda.findMany({
            include:{
                transaksi:{
                    include:{
                        user: true,
                        detailTrans: {
                            include: {buku: true}
                        }
                    }
                }
            },
            orderBy: {createdAt: "desc"}
        })
    },

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
    })
})