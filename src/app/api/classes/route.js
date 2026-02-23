// app/api/classes/route.js
import { getClasses } from "@/Controllers/classes.controller.js";


export async function GET(req) {
  return getClasses(req);
}

