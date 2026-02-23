/*
  Warnings:

  - The values [MURID,WALAS] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - The values [KEMBALI] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `tanggal` on the `Aduan` table. All the data in the column will be lost.
  - You are about to drop the column `nip` on the `Walas` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Walas` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[transaksiId]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[guruId]` on the table `Walas` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Aduan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transaksiId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deskripsi` to the `Buku` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_buku` to the `Buku` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Buku` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tingkat` to the `Classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Classes` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `namaKelas` on the `Classes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedAt` to the `DetailTransaksi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `JenisBuku` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Siswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipe` to the `Transaksi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Transaksi` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `Transaksi` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guruId` to the `Walas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Walas` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransaksiTipe" AS ENUM ('SISWA', 'GURU');

-- CreateEnum
CREATE TYPE "Tingkat" AS ENUM ('X', 'XI', 'XII');

-- CreateEnum
CREATE TYPE "NamaKelas" AS ENUM ('A', 'B', 'C');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'GURU', 'SISWA');
ALTER TABLE "Users" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('BOOKED', 'PINJAM', 'TERLAMBAT', 'SELESAI');
ALTER TABLE "Transaksi" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "public"."Status_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Transaksi" DROP CONSTRAINT "Transaksi_userId_fkey";

-- DropForeignKey
ALTER TABLE "Walas" DROP CONSTRAINT "Walas_userId_fkey";

-- DropIndex
DROP INDEX "Walas_nip_key";

-- DropIndex
DROP INDEX "Walas_userId_key";

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Aduan" DROP COLUMN "tanggal",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "transaksiId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Buku" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deskripsi" TEXT NOT NULL,
ADD COLUMN     "image_buku" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Classes" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "tingkat" "Tingkat" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "namaKelas",
ADD COLUMN     "namaKelas" "NamaKelas" NOT NULL;

-- AlterTable
ALTER TABLE "DetailTransaksi" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "JenisBuku" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Siswa" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Transaksi" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "keterangan" TEXT,
ADD COLUMN     "maxPerpanjang" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "perpanjanganKe" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tipe" "TransaksiTipe" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "image_profile" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Walas" DROP COLUMN "nip",
DROP COLUMN "userId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "guruId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Guru" (
    "id" SERIAL NOT NULL,
    "nip" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Guru_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Perpanjangan" (
    "id" SERIAL NOT NULL,
    "transaksiId" INTEGER NOT NULL,
    "tanggalSebelum" TIMESTAMP(3) NOT NULL,
    "tanggalSesudah" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Perpanjangan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Denda" (
    "id" SERIAL NOT NULL,
    "transaksiId" INTEGER NOT NULL,
    "nilaiDenda" INTEGER NOT NULL,
    "alasan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Denda_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guru_nip_key" ON "Guru"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "Guru_userId_key" ON "Guru"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Denda_transaksiId_key" ON "Denda"("transaksiId");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_transaksiId_key" ON "Booking"("transaksiId");

-- CreateIndex
CREATE UNIQUE INDEX "Walas_guruId_key" ON "Walas"("guruId");

-- AddForeignKey
ALTER TABLE "Guru" ADD CONSTRAINT "Guru_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Walas" ADD CONSTRAINT "Walas_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "Guru"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaksi" ADD CONSTRAINT "Transaksi_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Perpanjangan" ADD CONSTRAINT "Perpanjangan_transaksiId_fkey" FOREIGN KEY ("transaksiId") REFERENCES "Transaksi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_transaksiId_fkey" FOREIGN KEY ("transaksiId") REFERENCES "Transaksi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Denda" ADD CONSTRAINT "Denda_transaksiId_fkey" FOREIGN KEY ("transaksiId") REFERENCES "Transaksi"("id") ON DELETE CASCADE ON UPDATE CASCADE;
