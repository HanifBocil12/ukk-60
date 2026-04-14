import { PrismaClient } from "@prisma/client";
import { general } from "./general";

const prisma = new PrismaClient()

export const aduanModel = ({
    ...General(prisma.aduan)
})