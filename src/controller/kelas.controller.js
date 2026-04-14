import { kelasModel } from "@/model/kelas.model";

export async function getKelas(req) {
    const kelas = await kelasModel.findAll();
    return Response.json(kelas)
}