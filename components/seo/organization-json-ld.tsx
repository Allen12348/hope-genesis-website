import { SITE } from "@/constants/site";
import { getSiteUrl } from "@/lib/seo-defaults";
import { mergeCompanySettings } from "@/lib/cms/resolved-site";

/** Uses `SITE` defaults only — avoids Prisma during `next build` (root layout runs for static routes too). */
export function OrganizationJsonLd() {
  const site = mergeCompanySettings(null, []);
  const payload = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE.legalName,
    description: SITE.description,
    url: getSiteUrl(),
    telephone: site.phoneE164,
    email: site.email,
    areaServed: [
      { "@type": "AdministrativeArea", name: "Laguna, Philippines" },
      { "@type": "AdministrativeArea", name: "Metro Manila, Philippines" },
      { "@type": "AdministrativeArea", name: "Batangas, Philippines" },
    ],
    knowsAbout: ["HVAC", "Air conditioning", "Refrigeration", "VRF systems"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Calamba",
      addressRegion: "Laguna",
      addressCountry: "PH",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "08:00",
      closes: "18:00",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
