/*
  Warnings:

  - A unique constraint covering the columns `[tingkat,namaKelas]` on the table `Classes` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "JenisBuku" ADD COLUMN     "deskripsi" TEXT,
ADD COLUMN     "icon" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Classes_tingkat_namaKelas_key" ON "Classes"("tingkat", "namaKelas");
