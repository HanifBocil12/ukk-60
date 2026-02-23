// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const bcrypt = require("bcrypt"); // ← TAMBAH INI

async function main() {
  const kelasData = [
    { tingkat: "X", namaKelas: "A" },
    { tingkat: "X", namaKelas: "B" },
    { tingkat: "X", namaKelas: "C" },
    { tingkat: "XI", namaKelas: "A" },
    { tingkat: "XI", namaKelas: "B" },
    { tingkat: "XI", namaKelas: "C" },
    { tingkat: "XII", namaKelas: "A" },
    { tingkat: "XII", namaKelas: "B" },
    { tingkat: "XII", namaKelas: "C" },
  ];

  for (const kelas of kelasData) {
    await prisma.classes.upsert({
      where: { tingkat_namaKelas: kelas },
      update: {},
      create: kelas,
    });
  }

  const userAdmin = await prisma.users.upsert({
    where: { email: "admin@expobook.com" },
    update: {},
    create: {
      nama: "Admin",
      email: "admin@expobook.com",
      password: await bcrypt.hash("admin123", 10),
      role: "ADMIN",
    },
  });

  await prisma.admin.upsert({
    where: { nip: "20000" },
    update: {},
    create: {
      nip: "20000",
      userId: userAdmin.id,
    },
  });
  console.log("Seed selesai");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
