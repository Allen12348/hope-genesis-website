-- Project: gallery frames (JSON string[] of http(s) URLs) — matches prisma/schema.prisma
ALTER TABLE "Project" ADD COLUMN "galleryImageUrls" TEXT;
