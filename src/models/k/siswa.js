import { gen } from "./gen";
import { userk } from "./user";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export const siwa = ({
    ...gen(prisma.users,
        {
            beforeCreate: async ({nama, email, password, nisn, kelasId}) => {
                const user = await userk.create({nama, email, password, role:"SISWA"})

                const data = {
                    nisn,
                    userId: user.id
                }
                
                let classId
                if(kelasId){
                    classId = parseInt(kelasId)
                    data.classId = classId
                }

                return data
            }
        }
    ),

})