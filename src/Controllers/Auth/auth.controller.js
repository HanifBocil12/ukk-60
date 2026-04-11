// controllers/Auth/auth.controller.js
import { GuruModel } from "@/models/guru.model";
import { SiswaModel } from "@/models/siswa.model";
import { UsersModel } from "@/models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function getGuru(req) {
  const classes = await GuruModel.findAll();
  return Response.json(classes);
}

export async function getSiswa(req) {
  const classes = await SiswaModel.findAll();
  return Response.json(classes);
}

export async function registerGuru(req) {
  const body = await req.json();

  console.log("body:", body); // cek dulu apa yang diterima

  const { nama, email, password, nip, walasKelasId } = body;

  await GuruModel.create({ nama, email, password, nip, walasKelasId });

  return Response.json({ message: "Register berhasil" }, { status: 201 });
}

export async function registerSiswa(req) {
  const body = await req.json();

  console.log("body:", body); // cek dulu apa yang diterima

  const { nama, email, password, nisn, kelasId } = body;

  await SiswaModel.create({ nama, email, password, nisn, kelasId });

  return Response.json({ message: "Register berhasil" }, { status: 201 });
}

export async function login(req) {
  const { identifier, password } = await req.json(); // ← ganti email → identifier

  const user = await UsersModel.findByEmail(identifier); // ← ganti email → identifier
  if (!user)
    return Response.json({ message: "Email tidak ditemukan" }, { status: 404 });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid)
    return Response.json({ message: "password salah" }, { status: 401 });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  const response = Response.json(
    { message: "Login berhasil", role: user.role },
    { status: 200 },
  );
  response.headers.set("Set-Cookie", `token=${token}; Path=/; HttpOnly`);

  return response;
}

