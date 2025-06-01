/*
  Warnings:

  - You are about to drop the column `favorite` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `public` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `unScheduled` on the `Note` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Folder" ADD COLUMN     "color" TEXT;

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "favorite",
DROP COLUMN "public",
DROP COLUMN "unScheduled",
ADD COLUMN     "color" TEXT,
ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isFavorite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isUnscheduled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "color" TEXT;
