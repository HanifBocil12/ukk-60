import { Role } from "@prisma/client";

export async function GET(params) {
  return Response.json(Object.values(Role));
}