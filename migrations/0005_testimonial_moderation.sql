-- Testimonial moderation: Prisma field names (clientName, review, imageUrl, source)

ALTER TABLE "Testimonial" RENAME COLUMN "name" TO "clientName";
ALTER TABLE "Testimonial" RENAME COLUMN "quote" TO "review";

ALTER TABLE "Testimonial" ADD COLUMN "imageUrl" TEXT;

UPDATE "Testimonial"
SET "imageUrl" = TRIM("avatarImageUrl")
WHERE TRIM(COALESCE("avatarImageUrl", '')) != '';

UPDATE "Testimonial"
SET "imageUrl" = TRIM("avatar")
WHERE "imageUrl" IS NULL AND TRIM(COALESCE("avatar", '')) LIKE 'http%';

ALTER TABLE "Testimonial" ADD COLUMN "source" TEXT;

UPDATE "Testimonial" SET "source" = 'LEGACY' WHERE "source" IS NULL;

ALTER TABLE "Testimonial" DROP COLUMN "avatar";
ALTER TABLE "Testimonial" DROP COLUMN "avatarImageUrl";
