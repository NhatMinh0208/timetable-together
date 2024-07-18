/*
  Warnings:

  - The primary key for the `Recipient` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `messageId` on the `Recipient` table. All the data in the column will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `noteId` to the `Recipient` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Recipient" DROP CONSTRAINT "Recipient_messageId_fkey";

-- AlterTable
ALTER TABLE "Recipient" DROP CONSTRAINT "Recipient_pkey",
DROP COLUMN "messageId",
ADD COLUMN     "noteId" TEXT NOT NULL,
ADD CONSTRAINT "Recipient_pkey" PRIMARY KEY ("noteId", "userId");

-- DropTable
DROP TABLE "Message";

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "position" TIMESTAMP(3) NOT NULL,
    "timeSent" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipient" ADD CONSTRAINT "Recipient_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
