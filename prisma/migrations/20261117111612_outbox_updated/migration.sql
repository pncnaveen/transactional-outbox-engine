-- AlterEnum
ALTER TYPE "EventType" ADD VALUE 'USER_CREATED';

-- DropForeignKey
ALTER TABLE "outbox_messages" DROP CONSTRAINT "outbox_messages_order_id_fkey";

-- AlterTable
ALTER TABLE "outbox_messages" ALTER COLUMN "order_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "outbox_messages" ADD CONSTRAINT "outbox_messages_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
