-- AlterTable
ALTER TABLE "Parcel" ADD COLUMN     "returnedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Parcel_pickedUpAt_idx" ON "Parcel"("pickedUpAt");

-- CreateIndex
CREATE INDEX "Parcel_returnedAt_idx" ON "Parcel"("returnedAt");
