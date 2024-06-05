/*
  Warnings:

  - You are about to drop the column `alternativeId` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `alternativeId` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the `Alternative` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `scheduleId` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduleId` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Alternative" DROP CONSTRAINT "Alternative_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_alternativeId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_alternativeId_fkey";

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "alternativeId",
ADD COLUMN     "scheduleId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "alternativeId",
ADD COLUMN     "scheduleId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Alternative";

-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_eventId_name_key" ON "Schedule"("eventId", "name");

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
