import { PrismaClient } from "@prisma/client";
import { General } from "./general.js";
import { UsersModel } from "./user.model.js";

const prisma = new PrismaClient()

export const SiswaModel = {
    ...General(prisma.siswa,
       {
             beforeCreate: async ({ nama, email, password, nisn, kelasId }) => {
                const user = await UsersModel.create({ nama, email, password, role: "SISWA" });
             
                const data = {
                  nisn,
                  userId: user.id,
                  // Kalau ada kelas dipilih, langsung nested create Walas
                };

                let classId

                if(kelasId){
                  classId = parseInt(kelasId)
                  data.classId = classId
                }
            
                return data;
              },
       }
    )
    
}