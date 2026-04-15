import { getAdmin } from "@/Controllers/users.controller"

export async function GET() {
    return getAdmin()
}
