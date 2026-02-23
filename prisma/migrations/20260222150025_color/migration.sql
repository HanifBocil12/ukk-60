/*
  Warnings:

  - Added the required column `color` to the `JenisBuku` table without a default value. This is not possible if the table is not empty.
  - Made the column `deskripsi` on table `JenisBuku` required. This step will fail if there are existing NULL values in that column.
  - Made the column `icon` on table `JenisBuku` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "JenisBuku" ADD COLUMN     "color" TEXT NOT NULL,
ALTER COLUMN "deskripsi" SET NOT NULL,
ALTER COLUMN "icon" SET NOT NULL;
