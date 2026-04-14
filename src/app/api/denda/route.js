import { getAllDenda } from "@/Controller/denda.controller";

export async function GET() {
  return getAllDenda();
}