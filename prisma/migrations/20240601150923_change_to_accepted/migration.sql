/*
  Warnings:

  - You are about to drop the column `pending` on the `Follows` table. All the data in the column will be lost.
  - Added the required column `accepted` to the `Follows` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Follows" DROP COLUMN "pending",
ADD COLUMN     "accepted" BOOLEAN NOT NULL;
