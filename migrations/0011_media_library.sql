-- Media library assets (visual CMS uploads)
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "folder" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "publicUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "alt" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "sizeBytes" INTEGER NOT NULL DEFAULT 0,
    "thumbSizeBytes" INTEGER,
    "uploadedById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MediaAsset_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "MediaAsset_folder_idx" ON "MediaAsset"("folder");
CREATE INDEX "MediaAsset_createdAt_idx" ON "MediaAsset"("createdAt");
