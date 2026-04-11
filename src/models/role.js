import { Prisma } from "@prisma/client";
import { General } from "./general";

const prisma = new PrismaClient();

export const Role = {
    ...General(prisma.Role) 
}