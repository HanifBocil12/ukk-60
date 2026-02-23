import { getSchema } from "@/lib/schema"

export async function GET(req, context) {
    // console.log("params:", params); // cek apa yang diterim
    const {modelsName} = await context.params
    const shema = getSchema(modelsName)
     
    return Response.json(shema)
}