import { dendaModel } from "@/model/denda.model";
import jwt from "jsonwebtoken";

function getUserFromReq(req) {
  const cookie = req.headers.get("cookie") || "";
  const token = cookie.split(";").find((c) => c.trim().startsWith("token="))?.split("=")[1];
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

export async function getAllDenda() {
  try {
    const data = await dendaModel.findAll();
    return Response.json(data);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function getAllDendaByUser(req) {
  try {
    const user = getUserFromReq(req);
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const data = await dendaModel.findByUserId(user.id);
    return Response.json(data);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}