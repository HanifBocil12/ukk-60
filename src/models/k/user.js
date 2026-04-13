import { gen } from "./gen";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const userk = {
  ...gen(prisma.users, {
    beforeCreate: async (data) => {
      if (data.password) data.password = await bcrypt.hash(data.password, 10);
    },
  }),

  findEmail: async (email) => {
    prisma.users.findUnique({where:{email}})
  },

  findAllGuru: async (params) => {
    prisma.users.findMany({
      where: { role: "GURU" },
      include: {
        guru: {
          include: {
            walas: {
              include: {
                kelas: true,
              },
            },
          },
        },
      },
    });
  },
  findAllSiswa: () => {
    return prisma.users.findMany({
      where: { role: "SISWA" },
      include: {
        siswa: {
          include: {
            class: true,
          },
        },
      },
    });
  },
};
