import { general } from "./general";
import { UsersModel } from "./users.model";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export const saiswaModel = ({
    ...general(prisma.user, {
        beforeCreate: async ({nama, email, password, nisn, kelasId}) => {
            const user = await UsersModel.create({nama, email, password, role: "SISWA"})

            const data = {
                nisn,
                userId: user.id,
                if (kelasId) {
                    data.classId = parseInt(kelasId)
                }
            }

            return data
        }
    })
})