import { jenisBukuModel } from "@/models/jenisbuku.model";

export async function createJenisBuku(req) {
    const formData = await req.formData()
    const nama = formData.get("nama")
    const icon = formData.get("icon")
    const deskripsi = formData.get("deskripsi")
    const color = formData.get("color")

    const result = await jenisBukuModel.create({nama,icon,deskripsi,color})
    return Response.json(result, {status: 201})
}

export async function getJenisBuku() {
    const jenisBuku = await jenisBukuModel.findAll() 
    return Response.json(jenisBuku)
}

export async function deleteJenisBuku(req, ctx) {
    const {id} = await ctx.params
    const jenisBuku = await jenisBukuModel.delete(parseInt(id)) 
    return Response.json(jenisBuku)
}