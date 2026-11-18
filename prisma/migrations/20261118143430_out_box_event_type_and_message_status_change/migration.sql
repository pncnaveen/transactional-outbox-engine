/*
  Warnings:

  - You are about to drop the column `eventType` on the `outbox_messages` table. All the data in the column will be lost.
  - You are about to drop the column `messsageStatus` on the `outbox_messages` table. All the data in the column will be lost.
  - Added the required column `event_type` to the `outbox_messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "outbox_messages" DROP COLUMN "eventType",
DROP COLUMN "messsageStatus",
ADD COLUMN     "event_type" "EventType" NOT NULL,
ADD COLUMN     "messsage_status" "MessageStatus" NOT NULL DEFAULT 'PROCESSING';
