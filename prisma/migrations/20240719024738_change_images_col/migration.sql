-- CreateTable
CREATE TABLE "images" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumb_url" TEXT NOT NULL,
    "exif" JSON,
    "desc" TEXT,
    "create_time" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP,
    "delete_time" TIMESTAMP,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);
