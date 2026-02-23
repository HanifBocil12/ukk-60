import { deleteJenisBuku } from "@/Controllers/jenisbuku.conteoller";

export async function DELETE(req, ctx) {
    return deleteJenisBuku(req, ctx)
}