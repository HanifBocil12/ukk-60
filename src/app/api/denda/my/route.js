import { getAllDendaByUser } from "@/Controller/denda.controller";

export async function GET(req) {
  return getAllDendaByUser(req);
}