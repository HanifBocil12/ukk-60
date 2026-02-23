import { PrismaClient } from "@prisma/client";
import { General } from "./general";

const prisma = new PrismaClient()

export const aduan = {
    ...General(prisma.aduan,{ 
        /**
         * @param {import("@prisma/client").Prisma.UsersCreateInput} data
         */
        }  
    )  
}