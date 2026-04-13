import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export const gen = (model, hooks = {}) => ({
    finAll:  async () => model.findMany(),
    findById: async (id) => model.findMany({where:{id}}),
    create: async (data) => {
        if(hooks.beforeCreate) data = hooks.beforeCreate()
        model.create(data)
    },
    delete: async (id) => model.delete({where:{id}})
})