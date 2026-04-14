import { PrismaClient } from "@prisma/client";
import { general } from "./general";
const prisma = new PrismaClient();

export const bookingModel = ({
    ...general(prisma.booking),

    findAll: async () => {
        prisma.booking.findMany({
            include:{
                user:true,
                buku:true,
                transaksi:{
                    include:{
                        detailTrans:{
                            include:{buku:true}
                        }
                    }
                }
            }
        })
    },
    findByUserId: async (userId) => {
        prisma.booking.findMany({
            where:{userId},
            include:{
                buku: true,
                transaksi:{
                    include:{
                        detailTrans:{
                            include:{
                                buku: true
                            }
                        }
                    }
                }
            },
            orderBy:{createdAt:"desc"}
        })
    },
    findAllAdmin: async () => {
        prisma.booking.findMany({
            where:{status:"MENUNGGU"},
            include:{
                user:{
                    include:{
                        siswa:{include:{class:true}},
                        guru: true
                    }
                },
                buku:true,
                transaksi:{
                    include:{
                        detailTrans:{include:{buku:true}}
                    }
                }
            },
            orderBy:{createdAt:"desc"}
        })
    }
})