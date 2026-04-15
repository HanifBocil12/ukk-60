import { general } from "./general";
import { UsersModel } from "./users.model";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export const guruModel = ({
    ...general(prisma.guru, {
        beforeCreate:async (nama, email, password, nip,kelasId) => {
            const user = await UsersModel.create({nama, email, password, role:"GURU"})

            const data ={
                nip,
                userId: user.id
            }

            if (kelasId){
                data.walas = {
                    create:{
                        kelas:{
                            connect:{
                                id: parseInt(kelasId)
                            }
                        }
                    }

                }
            }

            return data
        }
    })
})