/*
  Warnings:

  - Changed the type of `startTime` on the `Session` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `endTime` on the `Session` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "startTime",
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL,
DROP COLUMN "endTime",
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "startDate" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "endDate" SET DATA TYPE TIMESTAMP(3);
