// controllers/classes.controller.js
import { ClassesModel } from "../models/class.model.js";

export async function getClasses(req, res) {
  const classes = await ClassesModel.findAll();
  return Response.json(classes);
}