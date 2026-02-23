import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * General helper untuk model prisma
 * @param {import("@prisma/client").PrismaClient[keyof import("@prisma/client").PrismaClient]} model
 * @param {Object} [hooks]
 * @param {(data: any) => any | Promise<any>} [hooks.beforeCreate]
 */
 
export const General = (model, hooks = {}) => ({
  findAll: async () => model.findMany(),
  findById: async (id) => model.findUnique(
    { 
      where: { id } 
    }
  ),
  create: async (data) => {
    if (hooks.beforeCreate) data = await hooks.beforeCreate(data);
    return model.create({ data });
  },
  update: async (id, data) => {
    if (hooks.beforeCreate) data = await hooks.beforeCreate(data);
    return model.update({ where: { id }, data });
  },
  delete: async (id) => model.delete({ 
    where: { id } 
  }),
});

// // ========================
// // Contoh penggunaan
// // ========================
// const userService = General(prisma.user); // <-- VSCode akan kasih suggestion: prisma.user, prisma.buku, prisma.post
// const bukuService = General(prisma.buku);

// // Panggil helper
// await userService.findAll();
// await bukuService.create({ title: "Judul Buku" });
