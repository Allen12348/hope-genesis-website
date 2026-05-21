-- Testimonial: featured flag + service categorization for admin CMS

ALTER TABLE "Testimonial" ADD COLUMN "featured" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Testimonial" ADD COLUMN "serviceType" TEXT NOT NULL DEFAULT 'General';
