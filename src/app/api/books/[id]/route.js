import { updateBuku, deleteBuku } from "@/Controllers/buku.controller";

export async function PUT(req, ctx) {
    return updateBuku(req, ctx)
}

export async function DELETE(req, ctx) {
    return deleteBuku(req, ctx)
}