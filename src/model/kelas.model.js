import { PrismaClient } from "@prisma/client";
import { general } from "./general";

const prisma = new PrismaClient();

export const kelasModel = general(prisma.classes);