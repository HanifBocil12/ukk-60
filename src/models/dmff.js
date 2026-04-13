import { Prisma } from "@prisma/client"

export const buildInclude = (paths, modelName) => {
  if (!paths) return {}

  if (typeof paths === "string") paths = [paths]

  const models = Prisma.dmmf.datamodel.models

  const getModel = (name) =>
    models.find((m) => m.name === name)

  const result = {}

  for (const path of paths) {
    const keys = path.split(".")
    let current = result
    let currentModel = getModel(modelName)

    keys.forEach((key, index) => {
      if (!currentModel) {
        throw new Error(`Model tidak ditemukan`)
      }

      const field = currentModel.fields.find(
        (f) => f.name === key && f.kind === "object"
      )

      if (!field) {
        throw new Error(
          `Relasi "${key}" tidak ada di model "${currentModel.name}"`
        )
      }

      if (!current[key]) current[key] = {}

      if (index === keys.length - 1) {
        current[key] = true
      } else {
        current[key].include = current[key].include || {}
        current = current[key].include
        currentModel = getModel(field.type)
      }
    })
  }

  return result
}