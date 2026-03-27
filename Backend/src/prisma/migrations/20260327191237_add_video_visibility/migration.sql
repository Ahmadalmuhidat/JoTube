/*
  Warnings:

  - You are about to drop the column `isPublished` on the `Video` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "VideoVisibility" AS ENUM ('PUBLIC', 'PRIVATE', 'UNLISTED', 'DRAFT');

-- AlterTable
ALTER TABLE "Channel" ADD COLUMN     "bannerUrl" TEXT,
ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "isPublished",
ADD COLUMN     "visibility" "VideoVisibility" NOT NULL DEFAULT 'DRAFT';

-- CreateTable
CREATE TABLE "WatchLater" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,

    CONSTRAINT "WatchLater_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WatchLater_videoId_idx" ON "WatchLater"("videoId");

-- CreateIndex
CREATE UNIQUE INDEX "WatchLater_userId_videoId_key" ON "WatchLater"("userId", "videoId");

-- AddForeignKey
ALTER TABLE "WatchLater" ADD CONSTRAINT "WatchLater_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchLater" ADD CONSTRAINT "WatchLater_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;
