/*
  Warnings:

  - You are about to drop the column `accepted` on the `Follows` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Follows" DROP COLUMN "accepted",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';
