-- Header / navigation CMS fields on CompanySettings + NavigationItem table

ALTER TABLE "CompanySettings" ADD COLUMN "logoText" TEXT NOT NULL DEFAULT 'HGE';
ALTER TABLE "CompanySettings" ADD COLUMN "logoImageUrl" TEXT;
ALTER TABLE "CompanySettings" ADD COLUMN "companyName" TEXT;
ALTER TABLE "CompanySettings" ADD COLUMN "companySubtitle" TEXT;
ALTER TABLE "CompanySettings" ADD COLUMN "primaryCtaLabel" TEXT NOT NULL DEFAULT 'Get Instant Estimate';
ALTER TABLE "CompanySettings" ADD COLUMN "primaryCtaUrl" TEXT NOT NULL DEFAULT '/estimate';
ALTER TABLE "CompanySettings" ADD COLUMN "callButtonLabel" TEXT NOT NULL DEFAULT 'Call Now';
ALTER TABLE "CompanySettings" ADD COLUMN "showPrimaryCta" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "CompanySettings" ADD COLUMN "showCallButton" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "CompanySettings" ADD COLUMN "showThemeToggle" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "CompanySettings" ADD COLUMN "defaultTheme" TEXT NOT NULL DEFAULT 'light';

CREATE TABLE "NavigationItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isExternal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
