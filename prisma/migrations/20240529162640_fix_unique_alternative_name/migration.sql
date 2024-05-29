/*
  Warnings:

  - A unique constraint covering the columns `[eventId,name]` on the table `Alternative` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Alternative_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Alternative_eventId_name_key" ON "Alternative"("eventId", "name");
