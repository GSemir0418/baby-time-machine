/*
  Warnings:

  - You are about to drop the `images` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "images";

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumb_url" TEXT NOT NULL,
    "exif" JSON,
    "desc" TEXT,
    "create_time" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP,
    "delete_time" TIMESTAMP,
    "postId" TEXT,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "create_time" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP,
    "delete_time" TIMESTAMP,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
