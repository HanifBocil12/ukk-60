import { PrismaClient } from "@prisma/client";
import { general } from "./general.js";

const prisma = new PrismaClient()

export const kategoryModel = ({
    ...general(prisma.jenisBuku)
})