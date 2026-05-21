-- Align D1 with current prisma/schema.prisma (CMS tables + missing columns).
-- Apply locally:  npm run db:migrate:d1
-- Apply remote:   npm run db:migrate:d1:remote

-- ---------------------------------------------------------------------------
-- Service (category + SEO / FAQ fields)
-- ---------------------------------------------------------------------------
ALTER TABLE "Service" ADD COLUMN "category" TEXT NOT NULL DEFAULT 'General';
ALTER TABLE "Service" ADD COLUMN "faqJson" TEXT;
ALTER TABLE "Service" ADD COLUMN "pricingNote" TEXT;
ALTER TABLE "Service" ADD COLUMN "seoTitle" TEXT;
ALTER TABLE "Service" ADD COLUMN "seoDescription" TEXT;

-- ---------------------------------------------------------------------------
-- Project (homepage featured strip label)
-- ---------------------------------------------------------------------------
ALTER TABLE "Project" ADD COLUMN "clientLabel" TEXT;

-- ---------------------------------------------------------------------------
-- GalleryItem (category + featured)
-- ---------------------------------------------------------------------------
ALTER TABLE "GalleryItem" ADD COLUMN "category" TEXT NOT NULL DEFAULT '';
ALTER TABLE "GalleryItem" ADD COLUMN "featured" BOOLEAN NOT NULL DEFAULT false;

-- ---------------------------------------------------------------------------
-- BrandPartner (richer cards)
-- ---------------------------------------------------------------------------
ALTER TABLE "BrandPartner" ADD COLUMN "description" TEXT;
ALTER TABLE "BrandPartner" ADD COLUMN "category" TEXT NOT NULL DEFAULT '';
ALTER TABLE "BrandPartner" ADD COLUMN "featured" BOOLEAN NOT NULL DEFAULT false;

-- ---------------------------------------------------------------------------
-- Testimonial (moderation)
-- ---------------------------------------------------------------------------
ALTER TABLE "Testimonial" ADD COLUMN "rejected" BOOLEAN NOT NULL DEFAULT false;

-- ---------------------------------------------------------------------------
-- BlogPost (tags + SEO)
-- ---------------------------------------------------------------------------
ALTER TABLE "BlogPost" ADD COLUMN "tags" TEXT NOT NULL DEFAULT '[]';
ALTER TABLE "BlogPost" ADD COLUMN "metaTitle" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "metaDescription" TEXT;

-- ---------------------------------------------------------------------------
-- CMS: structured pages, site toggles, footer JSON, SEO overrides
-- ---------------------------------------------------------------------------
CREATE TABLE "PageContent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pageKey" TEXT NOT NULL,
    "publishedData" TEXT NOT NULL,
    "draftData" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX "PageContent_pageKey_key" ON "PageContent"("pageKey");

CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sectionVisibilityJson" TEXT,
    "floatingActionsJson" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "FooterSection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "payloadJson" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "SeoMetadata" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pagePath" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "ogImageUrl" TEXT,
    "keywords" TEXT,
    "canonicalUrl" TEXT,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX "SeoMetadata_pagePath_key" ON "SeoMetadata"("pagePath");
