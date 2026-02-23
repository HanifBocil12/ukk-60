// lib/schemas.js
import { Prisma } from "@prisma/client";

const exclude = ["id", "createdAt", "updatedAt","jenisBuku","booking","detailTrans"];

export function getSchema(modelName) {
  const model = Prisma.dmmf.datamodel.models.find(m => m.name === modelName);
  console.log("models:", Prisma.dmmf.datamodel.models.map(m => m.name));
  const schema = {};
  model.fields
    .filter(f => !exclude.includes(f.name))
    .filter(f => f.kind !== "object")
    .forEach(field => {
      schema[field.name] = "";
    });
  return schema;
}