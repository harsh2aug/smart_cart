-- CreateEnum
CREATE TYPE "OtpPurpose" AS ENUM ('VERIFY_EMAIL', 'RESET_PASSWORD');

-- AlterTable
ALTER TABLE "merchants" ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "email_otps" (
    "id" UUID NOT NULL,
    "merchantId" UUID NOT NULL,
    "purpose" "OtpPurpose" NOT NULL,
    "codeHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_otps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email_otps_merchantId_purpose_key" ON "email_otps"("merchantId", "purpose");

-- AddForeignKey
ALTER TABLE "email_otps" ADD CONSTRAINT "email_otps_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "merchants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
