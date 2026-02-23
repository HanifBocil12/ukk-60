import { PrismaClient } from "@prisma/client"
import {General} from "./general"
const prisma = new PrismaClient()

export const transaksi = {
    ...General(prisma.transaksi),


}
