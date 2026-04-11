import { UsersModel } from "@/models/user.model";

export async function getGuru(params) {
    const guruModel = await UsersModel.findAllGuru()
    return Response.json(guruModel)
}

export async function getSiswa(params) {
    const siswaModel = await UsersModel.findAllSiswa()
    return Response.json(siswaModel)
}