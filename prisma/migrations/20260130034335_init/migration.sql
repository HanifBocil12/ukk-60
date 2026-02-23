/*
  Warnings:

  - You are about to drop the column `classId` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `nisn_nip` on the `Users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Aduan" DROP CONSTRAINT "Aduan_adminId_fkey";

-- DropForeignKey
ALTER TABLE "Aduan" DROP CONSTRAINT "Aduan_walasId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_userId_fkey";

-- DropForeignKey
ALTER TABLE "Classes" DROP CONSTRAINT "Classes_walasId_fkey";

-- DropForeignKey
ALTER TABLE "Transaksi" DROP CONSTRAINT "Transaksi_userId_fkey";

-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_classId_fkey";

-- DropIndex
DROP INDEX "Users_nisn_nip_key";

-- AlterTable
ALTER TABLE "Aduan" ALTER COLUMN "adminId" DROP NOT NULL,
ALTER COLUMN "walasId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Classes" ALTER COLUMN "walasId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Transaksi" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "classId",
DROP COLUMN "nisn_nip";

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "nip" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Siswa" (
    "id" SERIAL NOT NULL,
    "nisn" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "classId" INTEGER,

    CONSTRAINT "Siswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Walas" (
    "id" SERIAL NOT NULL,
    "nip" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Walas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_nip_key" ON "Admin"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_userId_key" ON "Admin"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Siswa_nisn_key" ON "Siswa"("nisn");

-- CreateIndex
CREATE UNIQUE INDEX "Siswa_userId_key" ON "Siswa"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Walas_nip_key" ON "Walas"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "Walas_userId_key" ON "Walas"("userId");

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Siswa" ADD CONSTRAINT "Siswa_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Siswa" ADD CONSTRAINT "Siswa_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Walas" ADD CONSTRAINT "Walas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classes" ADD CONSTRAINT "Classes_walasId_fkey" FOREIGN KEY ("walasId") REFERENCES "Walas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaksi" ADD CONSTRAINT "Transaksi_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aduan" ADD CONSTRAINT "Aduan_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aduan" ADD CONSTRAINT "Aduan_walasId_fkey" FOREIGN KEY ("walasId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
