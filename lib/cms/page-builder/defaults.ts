import type { PageBuilderDocument, BuilderSection } from "@/lib/cms/page-builder/schema";
import { CMS_PAGE_KEYS } from "@/lib/cms/marketing-cms-defaults";
import { BUILDER_PAGES } from "@/lib/cms/page-builder/registry";

function shell(title: string, description: string, eyebrow = ""): { eyebrow: string; title: string; description: string } {
  return { eyebrow, title, description };
}

const mk = (partial: BuilderSection): BuilderSection => partial;

const sharedCta: BuilderSection = mk({
  id: "blk-cta",
  type: "cta",
  visible: true,
  order: 90,
  props: {
    textAlign: "left",
    sectionSpacing: "normal",
    backgroundColor: "",
    title: "Ready to scope your next project?",
    description: "Tell us your facility type and constraints — we will respond with a clear plan and timeline.",
    primaryLabel: "Contact",
    primaryHref: "/contact",
    secondaryLabel: "Get estimate",
    secondaryHref: "/estimate",
  },
});

export function getDefaultPageBuilderDocument(pageKey: string): PageBuilderDocument {
  if (pageKey === CMS_PAGE_KEYS.home) {
    return {
      v: 2,
      sections: [
        mk({
          id: "blk-hero",
          type: "hero",
          visible: true,
          order: 0,
          props: {
            textAlign: "left",
            sectionSpacing: "normal",
            backgroundColor: "",
            title: "Professional Air Conditioning & Refrigeration Services",
            subtitle: "Engineered HVAC solutions for homes, enterprises, and industrial facilities.",
            eyebrow: "Hope Genesis Enterprises",
            backgroundImageUrl: "",
            overlayOpacity: 0.48,
            buttons: [
              { label: "Get Instant Estimate", href: "/estimate", variant: "accent" },
              { label: "Contact", href: "/contact", variant: "outline" },
            ],
          },
        }),
        mk({
          id: "blk-text-intro",
          type: "text",
          visible: true,
          order: 10,
          props: {
            textAlign: "center",
            sectionSpacing: "compact",
            backgroundColor: "",
            title: "Get started",
            subtitle: "Self-serve tools for enterprise HVAC workflows",
            body: "Request an estimate or contact our team — clear next steps for surveys, quotes, and service inquiries.",
          },
        }),
        mk({
          id: "blk-services",
          type: "servicesGrid",
          visible: true,
          order: 20,
          props: {
            textAlign: "left",
            sectionSpacing: "normal",
            backgroundColor: "",
            ...shell(
              "Featured services",
              "Installation, cleaning, commercial HVAC, and lifecycle programs — engineered for reliability.",
              "Capabilities",
            ),
          },
        }),
        mk({
          id: "blk-projects",
          type: "projectsGrid",
          visible: true,
          order: 30,
          props: {
            textAlign: "left",
            sectionSpacing: "normal",
            backgroundColor: "",
            ...shell(
              "Recent engagements with measurable outcomes",
              "Commissioning, documentation, and client-ready turnover.",
              "Portfolio",
            ),
          },
        }),
        mk({
          id: "blk-testimonials",
          type: "testimonials",
          visible: true,
          order: 40,
          props: {
            textAlign: "left",
            sectionSpacing: "normal",
            backgroundColor: "",
            ...shell(
              "Trusted where uptime matters",
              "Facilities teams choose us for disciplined execution and transparent reporting.",
              "Client proof",
            ),
          },
        }),
        mk({
          id: "blk-brands",
          type: "brandsCarousel",
          visible: true,
          order: 50,
          props: {
            textAlign: "left",
            sectionSpacing: "normal",
            backgroundColor: "",
            ...shell(
              "Dealer-grade brands we specify & support",
              "Correct pairing, warranty registration, and lifecycle parts strategy.",
              "Authorized partners",
            ),
          },
        }),
        sharedCta,
      ],
    };
  }

  if (pageKey === CMS_PAGE_KEYS.about) {
    return {
      v: 2,
      sections: [
        mk({
          id: "blk-hero",
          type: "hero",
          visible: true,
          order: 0,
          props: {
            textAlign: "left",
            sectionSpacing: "normal",
            backgroundColor: "",
            title: "About Hope Genesis Enterprises",
            subtitle: "Mission, vision, and the team behind every install.",
            eyebrow: "Company",
            backgroundImageUrl: "",
            overlayOpacity: 0.42,
            buttons: [{ label: "View services", href: "/services", variant: "accent" }],
          },
        }),
        mk({
          id: "blk-story",
          type: "imageText",
          visible: true,
          order: 10,
          props: {
            textAlign: "left",
            sectionSpacing: "normal",
            backgroundColor: "",
            title: "A Laguna-based HVAC partner built for reliability",
            body: "Dealer-level product access with field execution enterprises expect — structured QA and lifecycle programs.",
            imageUrl: "",
            imageAlt: "Industrial HVAC environment",
            imagePosition: "right",
          },
        }),
        mk({
          id: "blk-faq",
          type: "faq",
          visible: true,
          order: 20,
          props: {
            textAlign: "left",
            sectionSpacing: "normal",
            backgroundColor: "",
            title: "Common questions",
            description: "Quick answers for facilities and homeowners.",
            items: [
              { q: "Do you service industrial refrigeration?", a: "Yes — cold rooms, process cooling, and commercial kitchens." },
              { q: "How fast can you survey a site?", a: "Most requests are triaged same-day with scheduling based on coverage." },
            ],
          },
        }),
        sharedCta,
      ],
    };
  }

  if (pageKey === CMS_PAGE_KEYS.contact) {
    return {
      v: 2,
      sections: [
        mk({
          id: "blk-hero",
          type: "hero",
          visible: true,
          order: 0,
          props: {
            textAlign: "left",
            sectionSpacing: "normal",
            backgroundColor: "",
            title: "Contact Hope Genesis Enterprises",
            subtitle: "Send an inquiry, call our line, or message us on WhatsApp.",
            eyebrow: "Get in touch",
            backgroundImageUrl: "",
            overlayOpacity: 0.4,
            buttons: [],
          },
        }),
        mk({
          id: "blk-contact",
          type: "contact",
          visible: true,
          order: 10,
          props: {
            textAlign: "left",
            sectionSpacing: "normal",
            backgroundColor: "",
            eyebrow: "Contact",
            title: "Request a survey — we respond fast",
            description: "Share your requirements and site context. Our team will route you to the right engineer.",
          },
        }),
        mk({
          id: "blk-map",
          type: "map",
          visible: true,
          order: 20,
          props: {
            textAlign: "left",
            sectionSpacing: "normal",
            backgroundColor: "",
            eyebrow: "Dispatch",
            title: "Where we operate",
            description: "Metro Manila to Batangas industrial belt — routing confirmed during booking.",
          },
        }),
        sharedCta,
      ],
    };
  }

  if (pageKey === CMS_PAGE_KEYS.servicesLanding) {
    return {
      v: 2,
      sections: [
        mk({
          id: "blk-hero",
          type: "hero",
          visible: true,
          order: 0,
          props: {
            textAlign: "left",
            sectionSpacing: "normal",
            backgroundColor: "",
            title: "HVAC & refrigeration services",
            subtitle: "Structured proposals, engineered recommendations, and lifecycle support.",
            eyebrow: "Capabilities",
            backgroundImageUrl: "",
            overlayOpacity: 0.38,
            buttons: [{ label: "Contact us", href: "/contact", variant: "accent" }],
          },
        }),
        mk({
          id: "blk-services",
          type: "servicesGrid",
          visible: true,
          order: 10,
          props: {
            textAlign: "left",
            sectionSpacing: "normal",
            backgroundColor: "",
            ...shell("All services", "Select a service line to view scope, highlights, and ideal applications.", "Catalog"),
          },
        }),
        sharedCta,
      ],
    };
  }

  if (pageKey === CMS_PAGE_KEYS.projectsLanding) {
    return {
      v: 2,
      sections: [
        mk({
          id: "blk-hero",
          type: "hero",
          visible: true,
          order: 0,
          props: {
            textAlign: "left",
            sectionSpacing: "normal",
            backgroundColor: "",
            title: "Projects",
            subtitle: "Case studies and portfolio work from Hope Genesis Enterprises.",
            eyebrow: "Portfolio",
            backgroundImageUrl: "",
            overlayOpacity: 0.4,
            buttons: [{ label: "Contact", href: "/contact", variant: "accent" }],
          },
        }),
        mk({
          id: "blk-projects",
          type: "projectsGrid",
          visible: true,
          order: 10,
          props: {
            textAlign: "left",
            sectionSpacing: "normal",
            backgroundColor: "",
            ...shell(
              "Engineered outcomes you can verify",
              "Case studies across commercial, residential, and industrial programs.",
              "Portfolio",
            ),
          },
        }),
        sharedCta,
      ],
    };
  }

  if (pageKey === CMS_PAGE_KEYS.galleryLanding) {
    return {
      v: 2,
      sections: [
        mk({
          id: "blk-hero",
          type: "hero",
          visible: true,
          order: 0,
          props: {
            textAlign: "left",
            sectionSpacing: "normal",
            backgroundColor: "",
            title: "Gallery",
            subtitle: "Project gallery — commissioning, routing, and finish quality.",
            eyebrow: "Field craft",
            backgroundImageUrl: "",
            overlayOpacity: 0.4,
            buttons: [],
          },
        }),
        mk({
          id: "blk-gallery",
          type: "galleryGrid",
          visible: true,
          order: 10,
          props: {
            textAlign: "left",
            sectionSpacing: "normal",
            backgroundColor: "",
            ...shell(
              "Disciplined execution on real sites",
              "Routing, commissioning culture, and finish quality across programs.",
              "Field gallery",
            ),
          },
        }),
        sharedCta,
      ],
    };
  }

  if (pageKey === CMS_PAGE_KEYS.testimonialsLanding) {
    return {
      v: 2,
      sections: [
        mk({
          id: "blk-hero",
          type: "hero",
          visible: true,
          order: 0,
          props: {
            textAlign: "left",
            sectionSpacing: "normal",
            backgroundColor: "",
            title: "Testimonials",
            subtitle: "Reviews from facilities teams and homeowners.",
            eyebrow: "Client proof",
            backgroundImageUrl: "",
            overlayOpacity: 0.4,
            buttons: [],
          },
        }),
        mk({
          id: "blk-testimonials",
          type: "testimonials",
          visible: true,
          order: 10,
          props: {
            textAlign: "left",
            sectionSpacing: "normal",
            backgroundColor: "",
            ...shell(
              "Trusted where uptime matters",
              "Facilities teams choose us for disciplined execution and transparent reporting.",
              "Client proof",
            ),
          },
        }),
        sharedCta,
      ],
    };
  }

  if (pageKey === CMS_PAGE_KEYS.brandsLanding) {
    return {
      v: 2,
      sections: [
        mk({
          id: "blk-hero",
          type: "hero",
          visible: true,
          order: 0,
          props: {
            textAlign: "left",
            sectionSpacing: "normal",
            backgroundColor: "",
            title: "Brands & Partners",
            subtitle: "Authorized manufacturer partnerships.",
            eyebrow: "Partners",
            backgroundImageUrl: "",
            overlayOpacity: 0.4,
            buttons: [],
          },
        }),
        mk({
          id: "blk-brands",
          type: "brandsCarousel",
          visible: true,
          order: 10,
          props: {
            textAlign: "left",
            sectionSpacing: "normal",
            backgroundColor: "",
            ...shell(
              "Trusted brands",
              "Authorized partnerships and dealer-grade execution.",
              "Partners",
            ),
          },
        }),
        sharedCta,
      ],
    };
  }

  if (pageKey === CMS_PAGE_KEYS.blogLanding) {
    return {
      v: 2,
      sections: [
        mk({
          id: "blk-hero",
          type: "hero",
          visible: true,
          order: 0,
          props: {
            textAlign: "left",
            sectionSpacing: "normal",
            backgroundColor: "",
            title: "Blog",
            subtitle: "HVAC and refrigeration insights from Hope Genesis Enterprises.",
            eyebrow: "Insights",
            backgroundImageUrl: "",
            overlayOpacity: 0.4,
            buttons: [],
          },
        }),
        mk({
          id: "blk-blog",
          type: "blogFeed",
          visible: true,
          order: 10,
          props: {
            textAlign: "left",
            sectionSpacing: "normal",
            backgroundColor: "",
            eyebrow: "Insights",
            title: "Editorial briefings for facilities and homeowners",
            description: "Practical guidance on sizing, maintenance cadence, and when to escalate.",
          },
        }),
        sharedCta,
      ],
    };
  }

  if (pageKey === CMS_PAGE_KEYS.footer) {
    return {
      v: 2,
      sections: [
        mk({
          id: "blk-footer",
          type: "footerColumns",
          visible: true,
          order: 0,
          props: {
            columns: [
              { title: "Services", links: [{ label: "Installation", href: "/services/installation" }, { label: "Cleaning", href: "/services/cleaning" }] },
              { title: "Company", links: [{ label: "About", href: "/about" }, { label: "Contact", href: "/contact" }] },
            ],
            copyright: `© ${new Date().getFullYear()} Hope Genesis Enterprises`,
            tagline: "Professional HVAC & refrigeration services.",
          },
        }),
      ],
    };
  }

  if (pageKey === CMS_PAGE_KEYS.navigationHeader) {
    return {
      v: 2,
      sections: [
        mk({
          id: "blk-nav",
          type: "navigationMenu",
          visible: true,
          order: 0,
          props: {
            logoText: "HGE",
            logoUrl: "",
            items: [
              { label: "Services", href: "/services", visible: true },
              { label: "Projects", href: "/projects", visible: true },
              { label: "Contact", href: "/contact", visible: true },
            ],
            ctaLabel: "Get estimate",
            ctaHref: "/estimate",
            callLabel: "Call now",
            showCallButton: true,
          },
        }),
      ],
    };
  }

  if (pageKey === CMS_PAGE_KEYS.seo) {
    return {
      v: 2,
      sections: [
        mk({
          id: "blk-seo",
          type: "seoMeta",
          visible: true,
          order: 0,
          props: {
            pageTitle: "Hope Genesis Enterprises | HVAC Services",
            metaDescription: "Professional air conditioning installation, cleaning, repair, and maintenance.",
            keywords: "HVAC, aircon, installation, Philippines",
            ogImage: "",
          },
        }),
      ],
    };
  }

  if (pageKey === CMS_PAGE_KEYS.homepageHero) {
    return {
      v: 2,
      sections: [
        mk({
          id: "blk-hero",
          type: "hero",
          visible: true,
          order: 0,
          props: {
            textAlign: "left",
            sectionSpacing: "normal",
            backgroundColor: "",
            title: "Professional Air Conditioning & Refrigeration Services",
            subtitle: "Engineered HVAC solutions for homes, enterprises, and industrial facilities.",
            eyebrow: "Hope Genesis Enterprises",
            backgroundImageUrl: "",
            overlayOpacity: 0.48,
            buttons: [
              { label: "Get Instant Estimate", href: "/estimate", variant: "accent" },
              { label: "Contact", href: "/contact", variant: "outline" },
            ],
          },
        }),
      ],
    };
  }

  if (pageKey === CMS_PAGE_KEYS.coverageMap) {
    return {
      v: 2,
      sections: [
        mk({
          id: "blk-map",
          type: "map",
          visible: true,
          order: 0,
          props: {
            textAlign: "left",
            sectionSpacing: "normal",
            backgroundColor: "",
            eyebrow: "Coverage",
            title: "Service area intelligence",
            description: "Animated coverage map for Laguna, Batangas, and Metro Manila programs.",
          },
        }),
        sharedCta,
      ],
    };
  }

  return getDefaultPageBuilderDocument(CMS_PAGE_KEYS.home);
}

export const BUILDER_PAGE_OPTIONS = BUILDER_PAGES.map((p) => ({
  key: p.key,
  label: p.label,
  previewPath: p.previewPath,
}));

/** Sort by stored `order` (and id) — use when loading JSON from storage. */
export function sortSectionsByOrder(sections: BuilderSection[]): BuilderSection[] {
  return [...sections].sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
}

/** Reindex `order` from the current array sequence (preserves drag / splice positions). */
export function normalizeSectionOrders(sections: BuilderSection[]): BuilderSection[] {
  return sections.map((s, idx) => ({ ...s, order: idx }));
}

/** Load path: sort stored orders, then reindex so array order matches `order`. */
export function normalizeSectionsFromStorage(sections: BuilderSection[]): BuilderSection[] {
  return normalizeSectionOrders(sortSectionsByOrder(sections));
}
