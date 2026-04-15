import { getAllDendaByUser } from "@/Controllers/denda.controller";

export async function GET(req) {
  return getAllDendaByUser(req);
}