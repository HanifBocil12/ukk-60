import { kategoryModel } from "@/model/jenisBuku.model";

export async function createJenisBuku(req) {
    const formData = await req.formData()
    const nama = formData.get("nama")
    const icon = formData.get("icon")
    const deskripsi = formData.get("deskripsi")
    const color = formData.get("color")

    const result = await kategoryModel.create({nama,icon,deskripsi,color})
    return Response.json(result, {status: 201})
}

export async function getJenisBuku() {
    const jenisBuku = await kategoryModel.findAll() 
    return Response.json(jenisBuku)
}

export async function deleteJenisBuku(req, ctx) {
    const {id} = await ctx.params
    const jenisBuku = await kategoryModel.delete(parseInt(id)) 
    return Response.json(jenisBuku)
}