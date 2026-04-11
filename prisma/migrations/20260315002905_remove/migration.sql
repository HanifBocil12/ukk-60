/*
  Warnings:

  - You are about to drop the column `maxPerpanjang` on the `Transaksi` table. All the data in the column will be lost.
  - You are about to drop the column `perpanjanganKe` on the `Transaksi` table. All the data in the column will be lost.
  - You are about to drop the `Perpanjangan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Perpanjangan" DROP CONSTRAINT "Perpanjangan_transaksiId_fkey";

-- AlterTable
ALTER TABLE "Transaksi" DROP COLUMN "maxPerpanjang",
DROP COLUMN "perpanjanganKe";

-- DropTable
DROP TABLE "Perpanjangan";
