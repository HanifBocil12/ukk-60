import { PrismaClient } from "@prisma/client";
import {General} from "./general"

const prisma = new PrismaClient()

export const BukuModel = {
    ...General(prisma.buku,{
          /**
         * @param {import("@prisma/client").Prisma.UsersCreateInput} data
         */
            beforeCreate: async(data) => {
                if (data.stok < 0) {
                    throw new Error("Stok tidak boleh negatif")
                }
                return data;
            },
            beforeUpdate: async (data) => {
                if (data.stok !== undefined && data.stok < 0) {
                    throw new Error("Stok tidak boleh negatif");
                }
                return data;
            }
    }),
    findAll: async (params) => {
        return prisma.buku.findMany({
            include: {jenisBuku: true}
        })
    }
}
