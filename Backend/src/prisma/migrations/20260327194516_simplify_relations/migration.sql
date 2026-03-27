/*
  Warnings:

  - You are about to drop the `PlaylistVideo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VideoCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PlaylistVideo" DROP CONSTRAINT "PlaylistVideo_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistVideo" DROP CONSTRAINT "PlaylistVideo_videoId_fkey";

-- DropForeignKey
ALTER TABLE "VideoCategory" DROP CONSTRAINT "VideoCategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "VideoCategory" DROP CONSTRAINT "VideoCategory_videoId_fkey";

-- DropTable
DROP TABLE "PlaylistVideo";

-- DropTable
DROP TABLE "VideoCategory";

-- CreateTable
CREATE TABLE "_PlaylistToVideo" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_VideoToCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PlaylistToVideo_AB_unique" ON "_PlaylistToVideo"("A", "B");

-- CreateIndex
CREATE INDEX "_PlaylistToVideo_B_index" ON "_PlaylistToVideo"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_VideoToCategory_AB_unique" ON "_VideoToCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_VideoToCategory_B_index" ON "_VideoToCategory"("B");

-- AddForeignKey
ALTER TABLE "_PlaylistToVideo" ADD CONSTRAINT "_PlaylistToVideo_A_fkey" FOREIGN KEY ("A") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlaylistToVideo" ADD CONSTRAINT "_PlaylistToVideo_B_fkey" FOREIGN KEY ("B") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VideoToCategory" ADD CONSTRAINT "_VideoToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VideoToCategory" ADD CONSTRAINT "_VideoToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;
