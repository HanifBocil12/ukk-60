import { getAllDenda } from "@/Controllers/denda.controller";

export async function GET() {
  return getAllDenda();
}