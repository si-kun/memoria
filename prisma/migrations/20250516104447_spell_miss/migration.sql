/*
  Warnings:

  - You are about to drop the column `unScheduld` on the `Note` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Note" DROP COLUMN "unScheduld",
ADD COLUMN     "unScheduled" BOOLEAN NOT NULL DEFAULT false;
