import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export const general = (model, hooks={}) => ({
    findAll:  async () => model.findMany(),
    findById: async (id) => model.findUnique({where:{id}}),
    create: async (data) => {
        if (hooks.beforeCreate) data = await hooks.beforeCreate(data)
        return model.create({data})
    },
    upate: async (id,data) => {
        if (hooks.beforeUpdate) data = await hooks.beforeUpdate(data)
        return model.update({where:{id},data})
    },
    delete: async (id) => model.delete({where:{id}})
})