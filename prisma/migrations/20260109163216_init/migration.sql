-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('MANAGER', 'STAFF', 'RESIDENT', 'RESIDENT_PENDING');

-- CreateEnum
CREATE TYPE "ParcelStatus" AS ENUM ('REGISTERED', 'READY_FOR_PICKUP', 'PICKED_UP', 'RETURNED');

-- CreateEnum
CREATE TYPE "PickupMethod" AS ENUM ('QR_SCAN', 'MANUAL_CODE', 'STAFF_VERIFIED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('PARCEL_RECEIVED', 'PARCEL_READY', 'PARCEL_PICKED_UP', 'PICKUP_REMINDER', 'ACCOUNT_APPROVED', 'ACCOUNT_REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "approvedAt" TIMESTAMP(3),
    "role" "UserRole" NOT NULL DEFAULT 'RESIDENT_PENDING',
    "unitNumber" TEXT,
    "imageUrl" TEXT,
    "imageKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parcel" (
    "id" TEXT NOT NULL,
    "orderId" TEXT,
    "description" TEXT,
    "courier" TEXT,
    "imageUrl" TEXT,
    "imageKey" TEXT,
    "imageSize" INTEGER,
    "status" "ParcelStatus" NOT NULL DEFAULT 'REGISTERED',
    "notes" TEXT,
    "pickupCode" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "receivedById" TEXT NOT NULL,
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pickedUpAt" TIMESTAMP(3),

    CONSTRAINT "Parcel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PickupLog" (
    "id" TEXT NOT NULL,
    "parcelId" TEXT NOT NULL,
    "pickedById" TEXT NOT NULL,
    "method" "PickupMethod" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PickupLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "actionUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_unitNumber_idx" ON "User"("unitNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Parcel_pickupCode_key" ON "Parcel"("pickupCode");

-- CreateIndex
CREATE INDEX "Parcel_recipientId_idx" ON "Parcel"("recipientId");

-- CreateIndex
CREATE INDEX "Parcel_status_idx" ON "Parcel"("status");

-- CreateIndex
CREATE INDEX "Parcel_pickupCode_idx" ON "Parcel"("pickupCode");

-- CreateIndex
CREATE INDEX "Parcel_receivedById_idx" ON "Parcel"("receivedById");

-- CreateIndex
CREATE INDEX "Parcel_registeredAt_idx" ON "Parcel"("registeredAt");

-- CreateIndex
CREATE INDEX "Parcel_orderId_idx" ON "Parcel"("orderId");

-- CreateIndex
CREATE INDEX "PickupLog_parcelId_idx" ON "PickupLog"("parcelId");

-- CreateIndex
CREATE INDEX "PickupLog_pickedById_idx" ON "PickupLog"("pickedById");

-- CreateIndex
CREATE INDEX "PickupLog_createdAt_idx" ON "PickupLog"("createdAt");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE INDEX "Notification_type_idx" ON "Notification"("type");

-- AddForeignKey
ALTER TABLE "Parcel" ADD CONSTRAINT "Parcel_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parcel" ADD CONSTRAINT "Parcel_receivedById_fkey" FOREIGN KEY ("receivedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PickupLog" ADD CONSTRAINT "PickupLog_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "Parcel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PickupLog" ADD CONSTRAINT "PickupLog_pickedById_fkey" FOREIGN KEY ("pickedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
