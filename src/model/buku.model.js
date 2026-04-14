import { PrismaClient } from "@prisma/client";
import { general } from "./general.js";

const prisma = new PrismaClient()

export const bukuModel = ({
    ...general(prisma.buku,
        {   beforeCreate: async (data) => {
                if(data.stok < 0){
                    throw new Error("stok tidak boleh 0")
                }

                return data
            },
            beforeUpdate: async (data) => {
                if(data.stok !== undefined && data.stok < 0){
                    throw new Error("stok tidak boleh 0")
                }
                return data
            }
        }
    ),

    findAll: async (params) => {
        return prisma.buku.findMany({include:{
            jenisBuku:true
        }})
    },

    findTrending: async (limit = 4) => {
        prisma.buku.findMany({
            take:limit,
            orderBy:{
                detailTrans:{
                    _count: "desc"
                }
            },
            include:{
                jenisBuku: true
            }
        })
    }
})