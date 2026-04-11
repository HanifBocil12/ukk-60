// users.model.js
import { PrismaClient } from "@prisma/client";
import { General } from "./general.js";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
 /**
         * @param {import("@prisma/client").Prisma.UsersCreateInput} data
         */

export const UsersModel = {
  ...General(prisma.users, {
    beforeCreate: async (data) => {
      if (data.password) data.password = await bcrypt.hash(data.password, 10);
      return data;
    },
    }
  ),

 findByEmail: async (email) => {
    return prisma.users.findUnique({ where: { email } });
  },

  findAllGuru: () => {
    return prisma.users.findMany({
        where: { role: "GURU" },
        include: {
            guru: {
                include: {
                    walas: {
                        include: { kelas: true }
                    }
                }
            }
        }
    });},
  findAllSiswa: () => {
    return prisma.users.findMany({
        where: { role: "SISWA" },
        include: {
            siswa: {
                include:{
                    class: true
                }
            }
        }
    });}
}