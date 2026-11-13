/*
  Warnings:

  - Made the column `email` on table `merchants` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "merchants" ADD COLUMN     "address" VARCHAR(255),
ADD COLUMN     "city" VARCHAR(100),
ALTER COLUMN "email" SET NOT NULL;
