// guru.model.js
import { PrismaClient } from "@prisma/client";
import { General } from "./general.js";
import { UsersModel } from "./user.model.js";

const prisma = new PrismaClient();

/**
 * @param {import("@prisma/client").Prisma.UsersCreateInput} data
 */

export const GuruModel = General(prisma.guru, {
  beforeCreate: async ({ nama, email, password, nip, walasKelasId }) => {
    const user = await UsersModel.create({ nama, email, password, role: "GURU" });
 
    const data = {
      nip,
      userId: user.id,
      // Kalau ada kelas dipilih, langsung nested create Walas
      ...(walasKelasId && {
        walas: {
          create: {
            kelas: {
              connect: { id: parseInt(walasKelasId) }, // assign ke kelas yang dipilih
            },
          },
        },
      }),
    };

    return data;
  },
});