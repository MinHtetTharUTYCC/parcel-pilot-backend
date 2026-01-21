/*
  Warnings:

  - A unique constraint covering the columns `[unitNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `unitNumber` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refreshToken" TEXT,
ALTER COLUMN "unitNumber" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_unitNumber_key" ON "User"("unitNumber");
