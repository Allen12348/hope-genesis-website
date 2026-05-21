-- Project: homepage featured strip ordering (matches prisma/schema.prisma)
ALTER TABLE "Project" ADD COLUMN "featured" BOOLEAN NOT NULL DEFAULT false;
