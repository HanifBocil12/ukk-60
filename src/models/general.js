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
    if (hooks.beforeUpdate) data = await hooks.beforeUpdate(data);
    return model.update({ where: { id }, data });
  },
  delete: async (id) => model.delete({ 
    where: { id } 
  }),
});
