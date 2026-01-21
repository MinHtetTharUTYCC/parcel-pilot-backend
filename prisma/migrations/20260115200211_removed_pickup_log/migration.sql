/*
  Warnings:

  - You are about to drop the `PickupLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PickupLog" DROP CONSTRAINT "PickupLog_parcelId_fkey";

-- DropForeignKey
ALTER TABLE "PickupLog" DROP CONSTRAINT "PickupLog_pickedById_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "unitNumber" DROP NOT NULL;

-- DropTable
DROP TABLE "PickupLog";
