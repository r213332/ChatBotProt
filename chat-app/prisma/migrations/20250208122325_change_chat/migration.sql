/*
  Warnings:

  - Added the required column `title` to the `chats` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_model_id_fkey";

-- AlterTable
ALTER TABLE "chats" ADD COLUMN     "title" TEXT NOT NULL,
ALTER COLUMN "model_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "models"("id") ON DELETE SET NULL ON UPDATE CASCADE;
