import { deleteJenisBuku } from "@/controller/jenisbuku.controller";

export async function DELETE(req, ctx) {
    return deleteJenisBuku(req, ctx)
}