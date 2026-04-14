import { PrismaClient } from "@prisma/client";
import { General } from "./general.js";

const prisma = new PrismaClient()

export const roleModel = ({
    ...General(prisma.Role)
})