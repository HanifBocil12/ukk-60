import { updateUser, deleteUser } from "@/controllers/users.controller";

export async function PUT(req, { params }) {
  const { id } = await params;
  const data = await req.json();

    if (isNaN(id)) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }

  return updateUser(parseInt(id), data, false);
}

export async function DELETE(_, { params }) {
    const { id } = await params;
    return deleteUser(parseInt(id));
}