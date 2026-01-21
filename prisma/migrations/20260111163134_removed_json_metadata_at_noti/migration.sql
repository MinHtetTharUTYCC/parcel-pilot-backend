/*
  Warnings:

  - You are about to drop the column `metadata` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `method` on the `PickupLog` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'RESIDENT_REJECTED';

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "metadata";

-- AlterTable
ALTER TABLE "PickupLog" DROP COLUMN "method";

-- DropEnum
DROP TYPE "PickupMethod";
