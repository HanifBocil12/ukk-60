import { UsersModel } from "@/model/users.model";

export async function getGuru(params) {
    const guruModel = await UsersModel.findAllGuru()
    return Response.json(guruModel)
}

export async function getSiswa(params) {
    const siswaModel = await UsersModel.findAllSiswa()
    return Response.json(siswaModel)
}
export async function updateUser(req, res) {
    const {id} = req.params;
    const {isGuru} = req.query;
    const data = req.body;

    const updated = await UsersModel.update(id, data, isGuru)
    return Response.json(updated)
}

export async function deleteUser(id) {
    const deleted = await UsersModel.delete(id)
    return Response.json(deleted)
}
