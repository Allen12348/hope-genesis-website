-- Project portfolio: lifecycle status, stats, testimonial link, sort order control
ALTER TABLE "Project" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'completed';
ALTER TABLE "Project" ADD COLUMN "statsJson" TEXT;
ALTER TABLE "Project" ADD COLUMN "testimonialId" TEXT;

CREATE INDEX IF NOT EXISTS "Project_testimonialId_idx" ON "Project"("testimonialId");

-- Map legacy categories to the new HVAC portfolio taxonomy
UPDATE "Project" SET "category" = 'Commercial' WHERE "category" = 'Industrial';
UPDATE "Project" SET "category" = 'Refrigeration' WHERE "category" = 'Cold Storage';
UPDATE "Project" SET "category" = 'AC Cleaning' WHERE "category" = 'Cleaning Service';
