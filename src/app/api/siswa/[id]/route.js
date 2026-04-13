import { updateUser, deleteUser } from "@/controllers/users.controller";

export async function PUT(req, { params }) {
    const { id } = await params;
    const data = await req.json();
    return updateUser(parseInt(id), data, false); // false = siswa
}

export async function DELETE(_, { params }) {
    const { id } = await params;
    return deleteUser(parseInt(id));
}