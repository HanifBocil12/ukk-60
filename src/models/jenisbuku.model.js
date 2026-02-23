import { PrismaClient } from "@prisma/client";
import { General } from "./general";

const prisma = new PrismaClient()
export const jenisBukuModel = {
    ...General(prisma.jenisBuku)
}