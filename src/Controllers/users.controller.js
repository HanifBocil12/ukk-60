import { UsersModel } from "@/models/user.model";

export async function getGuru() {
    const guruModel = await UsersModel.findAllGuru()
    return Response.json(guruModel)
}

export async function getSiswa() {
    const siswaModel = await UsersModel.findAllSiswa()
    return Response.json(siswaModel)
}

export async function getAdmin() {
    const adminModel = await UsersModel.findAllAdmin()
    return Response.json(adminModel)
}

export async function updateUser(id, data, isGuru) {
  const updated = await UsersModel.update(id, data, isGuru);
  return Response.json(updated);
}

export async function deleteUser(id) {
    const deleted = await UsersModel.delete(id)
    return Response.json(deleted)
}