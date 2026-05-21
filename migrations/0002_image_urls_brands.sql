-- Prisma / SQLite / D1: optional remote image URLs + brand partners

ALTER TABLE "Service" ADD COLUMN "imageUrl" TEXT;
ALTER TABLE "Project" ADD COLUMN "imageUrl" TEXT;
ALTER TABLE "Project" ADD COLUMN "beforeImageUrl" TEXT;
ALTER TABLE "Project" ADD COLUMN "afterImageUrl" TEXT;
ALTER TABLE "GalleryItem" ADD COLUMN "imageUrl" TEXT;
ALTER TABLE "Testimonial" ADD COLUMN "avatarImageUrl" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "coverImageUrl" TEXT;
ALTER TABLE "CompanySettings" ADD COLUMN "heroImageUrl" TEXT;
ALTER TABLE "CompanySettings" ADD COLUMN "heroImageAlt" TEXT;

CREATE TABLE "BrandPartner" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "monogram" TEXT NOT NULL,
    "imageUrl" TEXT,
    "imageAlt" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE UNIQUE INDEX "BrandPartner_slug_key" ON "BrandPartner"("slug");
