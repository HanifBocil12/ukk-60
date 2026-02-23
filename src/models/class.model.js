// models/classes.model.js
import { PrismaClient } from "@prisma/client";
import { General } from "./general";

const prisma = new PrismaClient();

export const ClassesModel = General(prisma.classes);