import { FOOTER_SERVICE_LINKS, PLATFORM_LINKS, SITE } from "@/constants/site";
import { CMS_PAGE_KEYS, type CmsPageKey } from "@/lib/domain/cms/page-keys";

export { CMS_PAGE_KEYS, type CmsPageKey };

export type HeroButtonCms = {
  label: string;
  href: string;
  variant: "accent" | "outline" | "ghost";
  showArrow?: boolean;
  /** When true, `href` is ignored and the marketing phone link is used. */
  usePhoneTel?: boolean;
};

export type HeroTrustChipIcon =
  | "shield"
  | "map"
  | "wrench"
  | "award"
  | "clock"
  | "badge"
  | "users";

export type HeroTrustChip = { icon: HeroTrustChipIcon; label: string };

export const HERO_STAT_ICON_IDS = ["briefcase", "clock", "users", "shield"] as const;
export type HeroStatIcon = (typeof HERO_STAT_ICON_IDS)[number];

export type HeroStatCms = {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  icon?: HeroStatIcon;
  sortOrder: number;
  visible: boolean;
};

export const HERO_LAYOUT_VARIANT_IDS = [
  "image",
  "video",
  "split",
  "centered",
  "dark",
  "commercial",
] as const;
export type HeroLayoutVariantId = (typeof HERO_LAYOUT_VARIANT_IDS)[number];

export type HeroServicePreviewCms = {
  icon: "installation" | "cleaning" | "maintenance" | "refrigeration" | "commercial" | "repair";
  title: string;
  description: string;
  href: string;
};

export type BusinessTrustGroupCms = {
  icon: "partners" | "permits" | "certifications" | "awards" | "areas" | "clients";
  title: string;
  items: string[];
};

export type BusinessTrustCms = {
  groups: BusinessTrustGroupCms[];
};

export type BeforeAfterItemCms = {
  category: string;
  title: string;
  caption?: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  beforeAlt: string;
  afterAlt: string;
};

export type BeforeAfterCms = {
  items: BeforeAfterItemCms[];
};

export type TestimonialsDisplayCms = {
  /** When true, only testimonials marked featured in admin appear on the homepage. */
  featuredOnly: boolean;
  /** Carousel (single spotlight) or grid (cards). */
  layout: "carousel" | "grid";
};

export const DEFAULT_TESTIMONIALS_DISPLAY: TestimonialsDisplayCms = {
  featuredOnly: false,
  layout: "carousel",
};

/** Preset stacks for the hero readability overlay (edited in Admin → Content → Hero). */
export const HERO_OVERLAY_GRADIENT_IDS = ["navy-depth", "navy-soft", "royal-gold", "cinema", "minimal"] as const;
export type HeroOverlayGradientId = (typeof HERO_OVERLAY_GRADIENT_IDS)[number];

/** Optional CSS text shadow preset for hero copy (buttons/cards use their own styles). */
export const HERO_TEXT_SHADOW_IDS = ["none", "subtle", "medium"] as const;
export type HeroTextShadowId = (typeof HERO_TEXT_SHADOW_IDS)[number];

/** Background image/video focal point (maps to CSS `object-position` / `background-position`). */
export const HERO_BACKGROUND_FOCAL_IDS = ["center", "top", "bottom", "left", "right"] as const;
export type HeroBackgroundFocalId = (typeof HERO_BACKGROUND_FOCAL_IDS)[number];

export const HERO_TEXT_ALIGN_IDS = ["left", "center", "right"] as const;
export type HeroTextAlignId = (typeof HERO_TEXT_ALIGN_IDS)[number];

export type HomeHeroCms = {
  eyebrowBrand: string;
  eyebrowRegion: string;
  titleLine1: string;
  titleAccent: string;
  titleLine2: string;
  subtitle: string;
  buttons: HeroButtonCms[];
  trustChips: HeroTrustChip[];
  stats: HeroStatCms[];
  bottomBadges: string[];
  /** When set, replaces the split headline (titleLine1 / titleAccent / titleLine2) with a single line. */
  heroTitle?: string;
  heroSubtitle?: string;
  heroBackgroundImageUrl?: string;
  heroBackgroundVideoUrl?: string;
  /** Alt text for the background still image (falls back to company hero alt). */
  heroBackgroundImageAlt?: string;
  /** 0–1 strength of the primary readability gradient over the photo/video. */
  heroOverlayOpacity?: number;
  heroOverlayGradient?: HeroOverlayGradientId;
  /** Optional hex overlay tint (e.g. #0F172A or #38BDF8). Empty uses preset gradient. */
  heroOverlayColor?: string;
  /** Backdrop blur on the subtle texture layer (px). */
  heroBlurStrength?: number;
  /** CSS filter brightness on background media (0.55–1.15). */
  heroBackgroundBrightness?: number;
  /** Focal preset for background media (`object-position`). Legacy free-form strings may still exist in older JSON. */
  heroBackgroundPosition?: string;
  /** Text shadow on hero headline and body copy. */
  heroTextShadow?: HeroTextShadowId;
  /** Fog, particles, and light animated wash. */
  heroEnableCinematic?: boolean;
  heroBadgeText?: string;
  heroLocationText?: string;
  heroPrimaryButtonLabel?: string;
  heroPrimaryButtonUrl?: string;
  heroSecondaryButtonLabel?: string;
  heroSecondaryButtonUrl?: string;
  heroEnableParallax?: boolean;
  heroEnableParticles?: boolean;
  heroEnableFog?: boolean;
  heroEnableCtaGlow?: boolean;
  /** CSS scale on background media (1–1.2). */
  heroBackgroundZoom?: number;
  /** CSS filter contrast on background media (0.85–1.25). */
  heroBackgroundContrast?: number;
  /** Opacity of background media layer (0.4–1). */
  heroBackgroundOpacity?: number;
  heroLayoutVariant?: HeroLayoutVariantId;
  /** Subtle airflow curve overlay. */
  heroEnableAirflow?: boolean;
  /** Headline block alignment (centered layout variant forces center). */
  heroTextAlign?: HeroTextAlignId;
};

export type HomeSectionVisibility = {
  customerPlatformStrip: boolean;
  heroServicesStrip: boolean;
  aboutPreview: boolean;
  servicesPreview: boolean;
  businessTrust: boolean;
  beforeAfter: boolean;
  coverageMap: boolean;
  projectsPreview: boolean;
  testimonials: boolean;
  lifecycleSubscriptions: boolean;
  technicianShowcase: boolean;
  brands: boolean;
  /** Mid-page “Get instant estimate” banner */
  instantEstimateBanner: boolean;
  contactCta: boolean;
  mobileStickyCta: boolean;
};

export type SectionShellCms = {
  eyebrow: string;
  title: string;
  description: string;
};

export type AboutPreviewCms = SectionShellCms & {
  imageUrl: string;
  imageAlt: string;
  pillars: string[];
  ctaLabel: string;
  ctaHref: string;
};

export type AboutPageCms = {
  pageHero: SectionShellCms & { breadcrumbsHomeLabel?: string };
  storyEyebrow: string;
  storyTitle: string;
  storyDescription: string;
  imageUrl: string;
  imageAlt: string;
  imageCaptionTitle: string;
  imageCaptionSubtitle: string;
  visionTitle: string;
  visionBody: string;
  missionTitle: string;
  missionBody: string;
  whyTitle: string;
  pillars: string[];
  teamSection: SectionShellCms;
};

export type ContactPagePublishedV1 = {
  v: 1;
  pageHero: SectionShellCms;
  mapSection: SectionShellCms;
};

export type FooterLinkCms = { label: string; href: string; external?: boolean };

export type FooterColumnCms = { title: string; links: FooterLinkCms[] };

export type FooterCmsPayload = {
  brandMonogram: string;
  brandName: string;
  brandTagline: string;
  brandDescription: string;
  serviceLinks: FooterLinkCms[];
  platformLinks: FooterLinkCms[];
  /** Footer column heading above platform / utility links */
  platformLinksColumnTitle: string;
  bookSurveyLabel: string;
  bookSurveyHref: string;
  companyHoursLabel: string;
  companyServingLine: string;
  bottomTagline: string;
  copyrightTemplate: string;
};

export type MobileStickyCtaCms = {
  callLabel: string;
  messengerLabel: string;
  quoteLabel: string;
  quoteHref: string;
};

export type FloatingActionsCms = {
  showMessenger: boolean;
  showWhatsapp: boolean;
  showCall: boolean;
  showQuote?: boolean;
  showScrollTop: boolean;
  mobileSticky?: MobileStickyCtaCms;
};

export type HomePagePublishedV1 = {
  v: 1;
  customerPlatform: SectionShellCms;
  hero: HomeHeroCms;
  homeSectionShells: {
    servicesPreview: SectionShellCms;
    heroServices: SectionShellCms;
    coverage: SectionShellCms;
    lifecycle: SectionShellCms;
    people: SectionShellCms;
    projectsPreview: SectionShellCms;
    testimonialsPreview: SectionShellCms;
    brandsPreview: SectionShellCms;
    businessTrust: SectionShellCms;
    beforeAfter: SectionShellCms;
    instantEstimate: SectionShellCms;
  };
  aboutPreview: AboutPreviewCms;
  contactCta: SectionShellCms;
  heroServicePreview: HeroServicePreviewCms[];
  businessTrust: BusinessTrustCms;
  beforeAfter: BeforeAfterCms;
  testimonialsDisplay: TestimonialsDisplayCms;
};

const defaultHeroButtons: HeroButtonCms[] = [
  { label: "Get Instant Estimate", href: "/estimate", variant: "accent" },
  { label: "Contact us", href: "/contact", variant: "outline", showArrow: true },
];

const defaultTrust: HeroTrustChip[] = [
  { icon: "shield", label: "Licensed HVAC Contractor" },
  { icon: "badge", label: "TESDA Certified" },
  { icon: "clock", label: "24/7 Emergency Support" },
  { icon: "award", label: "Authorized Dealer" },
  { icon: "map", label: "Serving Laguna · Metro Manila · Batangas" },
];

const defaultHeroServicePreview: HeroServicePreviewCms[] = [
  {
    icon: "installation",
    title: "Installation",
    description: "Correct sizing, neat piping, and careful commissioning.",
    href: "/services/installation",
  },
  {
    icon: "cleaning",
    title: "Cleaning",
    description: "Deep cleaning for healthier air and stronger cooling.",
    href: "/services/cleaning",
  },
  {
    icon: "maintenance",
    title: "Preventive Maintenance",
    description: "Tune-ups that extend equipment life and avoid surprises.",
    href: "/services/maintenance",
  },
  {
    icon: "refrigeration",
    title: "Refrigeration",
    description: "Cold rooms, display cases, and commercial refrigeration care.",
    href: "/services/refrigeration-services",
  },
  {
    icon: "commercial",
    title: "Commercial HVAC",
    description: "VRF, ducted, and rooftop systems for offices and retail.",
    href: "/services/commercial-ac",
  },
];

const defaultBusinessTrust: BusinessTrustCms = {
  groups: [
    {
      icon: "certifications",
      title: "Certifications & training",
      items: [
        "TESDA Certified",
        "Licensed HVAC Contractor",
        "Manufacturer installation standards",
        "Safety-first field protocols",
      ],
    },
    {
      icon: "partners",
      title: "Authorized dealer",
      items: ["Authorized Dealer — Carrier · Daikin · Mitsubishi · LG · Samsung", "Genuine parts and warranty registration support"],
    },
    {
      icon: "permits",
      title: "Permits & compliance",
      items: ["Licensed HVAC contractor documentation", "Structured commissioning checklists on every install"],
    },
    {
      icon: "awards",
      title: "Awards & recognition",
      items: ["Trusted by homeowners and facility managers across Southern Luzon", "Documented project handoffs for commercial clients"],
    },
    {
      icon: "areas",
      title: "Service areas",
      items: ["Serving Laguna · Metro Manila · Batangas", "Calamba · Cabuyao · Sta. Rosa · nearby cities"],
    },
    {
      icon: "clients",
      title: "24/7 support",
      items: ["24/7 Emergency Support", "Rapid response for commercial and residential clients"],
    },
    {
      icon: "clients",
      title: "Clients & projects",
      items: ["Residential estates and condominiums", "Retail, clinics, offices, and light industrial sites"],
    },
  ],
};

const defaultBeforeAfter: BeforeAfterCms = {
  items: [
    {
      category: "AC Cleaning",
      title: "Split-type deep clean",
      caption: "Restored airflow and coil efficiency after full chemical wash.",
      beforeImageUrl:
        "https://images.unsplash.com/photo-1631545806609-826fded44f44?auto=format&fit=crop&w=1200&q=80",
      afterImageUrl:
        "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80",
      beforeAlt: "AC unit before cleaning",
      afterAlt: "AC unit after cleaning",
    },
    {
      category: "Installation",
      title: "Commercial VRF rollout",
      caption: "Clean ceiling cassette install with labeled refrigerant lines.",
      beforeImageUrl:
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
      afterImageUrl:
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80",
      beforeAlt: "Site before installation",
      afterAlt: "Completed commercial install",
    },
  ],
};

export const DEFAULT_HOME_PAGE_PUBLISHED: HomePagePublishedV1 = {
  v: 1,
  customerPlatform: {
    eyebrow: "Get started",
    title: "Request an estimate or reach our team",
    description:
      "Use the instant estimate tool for a planning ballpark, or contact us for surveys, quotes, and service inquiries.",
  },
  hero: {
    eyebrowBrand: "Hope Genesis Enterprises",
    eyebrowRegion: "Calamba · Laguna · Southern Luzon",
    titleLine1: "Professional Air Conditioning",
    titleAccent: "&",
    titleLine2: "Refrigeration Services",
    subtitle:
      "Reliable HVAC service for homes and businesses — fast estimates, professional installation, aircon cleaning, repair, and maintenance from Hope Genesis Enterprises.",
    buttons: defaultHeroButtons,
    trustChips: defaultTrust,
    stats: [
      {
        id: "stat-projects",
        label: "Projects Completed",
        value: 1280,
        suffix: "+",
        icon: "briefcase",
        sortOrder: 0,
        visible: true,
      },
      {
        id: "stat-experience",
        label: "Years Experience",
        value: 14,
        suffix: "+",
        icon: "clock",
        sortOrder: 1,
        visible: true,
      },
      {
        id: "stat-clients",
        label: "Happy Clients",
        value: 920,
        suffix: "+",
        icon: "users",
        sortOrder: 2,
        visible: true,
      },
      {
        id: "stat-technicians",
        label: "Certified Technicians",
        value: 28,
        suffix: "",
        icon: "shield",
        sortOrder: 3,
        visible: true,
      },
    ],
    bottomBadges: [
      "TESDA Certified",
      "Licensed HVAC Contractor",
      "Authorized Dealer",
      "24/7 Emergency Support",
      "Serving Laguna · Metro Manila · Batangas",
    ],
    heroOverlayOpacity: 0.48,
    heroOverlayGradient: "navy-depth",
    heroBlurStrength: 0.75,
    heroBackgroundBrightness: 1,
    heroBackgroundPosition: "center",
    heroTextShadow: "subtle",
    heroEnableCinematic: true,
    heroEnableParallax: false,
    heroEnableParticles: false,
    heroEnableFog: true,
    heroEnableCtaGlow: false,
    heroBackgroundZoom: 1.04,
    heroBackgroundContrast: 1,
    heroBackgroundOpacity: 1,
    heroLayoutVariant: "image",
    heroEnableAirflow: true,
    heroTextAlign: "left",
  },
  heroServicePreview: defaultHeroServicePreview,
  businessTrust: defaultBusinessTrust,
  beforeAfter: defaultBeforeAfter,
  testimonialsDisplay: DEFAULT_TESTIMONIALS_DISPLAY,
  homeSectionShells: {
    heroServices: {
      eyebrow: "Our services",
      title: "HVAC services for your home or business",
      description: "Professional installation, cleaning, repair, preventive maintenance, and refrigeration — without the jargon.",
    },
    servicesPreview: {
      eyebrow: "What we offer",
      title: "The HVAC services customers ask for most",
      description: "Straightforward help so your space stays comfortable year-round.",
    },
    coverage: {
      eyebrow: "Coverage",
      title: "Service area intelligence",
      description:
        "Animated coverage map for Calamba, Cabuyao, Sta. Rosa, Laguna province, Batangas, and Metro Manila programs — enterprise dispatch ready.",
    },
    lifecycle: {
      eyebrow: "Lifecycle",
      title: "Maintenance subscriptions that scale with your assets",
      description:
        "Residential care, business HVAC, and enterprise maintenance ladders — with comparison tooling for finance and facilities sign-off.",
    },
    people: {
      eyebrow: "People",
      title: "Technician bench — certifications you can verify",
      description:
        "Premium profile cards highlight specialties, completed workload, and training paths — designed for RFP attachments.",
    },
    projectsPreview: {
      eyebrow: "Recent work",
      title: "A snapshot of completed projects",
      description: "Real installs and upgrades — tap through to see more photos and details.",
    },
    testimonialsPreview: {
      eyebrow: "Reviews",
      title: "What our customers say",
      description: "Feedback from homeowners and businesses we’ve worked with in Laguna and nearby areas.",
    },
    brandsPreview: {
      eyebrow: "Authorized partners",
      title: "Dealer-grade brands we specify & support",
      description:
        "Correct pairing, warranty registration, and lifecycle parts strategy — across leading manufacturers.",
    },
    businessTrust: {
      eyebrow: "Why choose us",
      title: "Comfort, clarity, and dependable workmanship",
      description:
        "You get honest recommendations, responsive communication, and crews who treat your property with respect.",
    },
    beforeAfter: {
      eyebrow: "Gallery preview",
      title: "See the difference our team makes",
      description: "A quick before-and-after look — visit the gallery for more photos.",
    },
    instantEstimate: {
      eyebrow: "Ballpark pricing",
      title: "Get an instant estimate",
      description:
        "A simple online planner gives you an indicative range for equipment and installation so you can plan your budget.",
    },
  },
  aboutPreview: {
    eyebrow: "About Hope Genesis",
    title: "Built for reliability across Laguna & Southern Luzon",
    description: `${SITE.name} pairs dealer-grade equipment access with enterprise-level execution — structured QA, respectful crews, and lifecycle programs that reduce downtime.`,
    imageUrl:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Industrial HVAC environment",
    pillars: [
      "Engineering-first installs with documented commissioning",
      "Technicians trained on leading brands and safety protocols",
      "Transparent proposals and disciplined site cleanliness",
    ],
    ctaLabel: "View About",
    ctaHref: "/about",
  },
  contactCta: {
    eyebrow: "Contact",
    title: "Call, message, or send us a note",
    description:
      "Tell us what you need — we’ll recommend next steps and schedule a visit when it makes sense.",
  },
};

export const DEFAULT_SECTION_VISIBILITY: HomeSectionVisibility = {
  customerPlatformStrip: false,
  heroServicesStrip: true,
  aboutPreview: false,
  servicesPreview: true,
  businessTrust: true,
  beforeAfter: true,
  coverageMap: false,
  projectsPreview: true,
  testimonials: true,
  lifecycleSubscriptions: false,
  technicianShowcase: false,
  brands: false,
  instantEstimateBanner: true,
  contactCta: true,
  mobileStickyCta: true,
};

export const DEFAULT_MOBILE_STICKY_CTA: MobileStickyCtaCms = {
  callLabel: "Call Now",
  messengerLabel: "Messenger",
  quoteLabel: "Get Quote",
  quoteHref: "/estimate",
};

export const DEFAULT_FLOATING_ACTIONS: FloatingActionsCms = {
  showQuote: true,
  showMessenger: true,
  showWhatsapp: true,
  showCall: true,
  showScrollTop: true,
  mobileSticky: DEFAULT_MOBILE_STICKY_CTA,
};

export const DEFAULT_ABOUT_PAGE_PUBLISHED: AboutPageCms = {
  pageHero: {
    eyebrow: "Company",
    title: "About Hope Genesis Enterprises",
    description: SITE.description,
    breadcrumbsHomeLabel: "Home",
  },
  storyEyebrow: "About Hope Genesis",
  storyTitle: "A Laguna-based HVAC partner built for reliability",
  storyDescription: `${SITE.name} combines dealer-level product access with field execution that enterprises expect — structured QA, respectful crews, and service programs designed to reduce downtime.`,
  imageUrl:
    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1600&q=80",
  imageAlt: "Industrial HVAC environment",
  imageCaptionTitle: "Mission-critical comfort",
  imageCaptionSubtitle: "From cold chain to corporate towers — executed with precision.",
  visionTitle: "Vision",
  visionBody:
    "To be the most trusted HVAC & refrigeration contractor in Southern Luzon — known for engineering discipline, integrity, and long-term client partnerships.",
  missionTitle: "Mission",
  missionBody:
    "Deliver safe, efficient, and measurable outcomes on every project — with clear communication from survey to turnover.",
  whyTitle: `Why clients choose ${SITE.name}`,
  pillars: [
    "Engineering-first installs with documented commissioning",
    "Technicians trained on leading brands and safety protocols",
    "Transparent proposals, disciplined site cleanliness, and warranty support",
  ],
  teamSection: {
    eyebrow: "Team",
    title: "Technicians behind the installs",
    description:
      "Certified specialists with commercial, industrial, and residential depth — profile cards you can attach to bids and safety packets.",
  },
};

export const DEFAULT_COVERAGE_MAP_PAGE: SectionShellCms = {
  eyebrow: "Coverage",
  title: "Service area intelligence",
  description:
    "Animated coverage map for Calamba, Cabuyao, Sta. Rosa, Laguna province, Batangas, and Metro Manila programs — enterprise dispatch ready.",
};

export const DEFAULT_CONTACT_PAGE_PUBLISHED: ContactPagePublishedV1 = {
  v: 1,
  pageHero: {
    eyebrow: "Get in touch",
    title: "Contact Hope Genesis Enterprises",
    description:
      "Send an inquiry, call our line, or message us on WhatsApp — we route every request to the right engineer.",
  },
  mapSection: {
    eyebrow: "Dispatch",
    title: "Where we operate — with survey availability",
    description:
      "Metro Manila to Batangas industrial belt. Markers pulse to visualize active programs; exact routing is confirmed during booking.",
  },
};

export const DEFAULT_SERVICES_LANDING_COPY: SectionShellCms = {
  eyebrow: "Capabilities",
  title: "HVAC & refrigeration services",
  description:
    "Structured proposals, engineered recommendations, disciplined installation, and lifecycle support for residential, commercial, and industrial clients.",
};

export const DEFAULT_FOOTER_PAYLOAD: FooterCmsPayload = {
  brandMonogram: "HGE",
  brandName: SITE.name,
  brandTagline: SITE.shortTagline,
  brandDescription:
    "Reliable HVAC service for homes and businesses — professional installation, cleaning, repair, and maintenance from Hope Genesis Enterprises.",
  serviceLinks: FOOTER_SERVICE_LINKS.map((l) => ({ label: l.label, href: l.href })),
  platformLinks: PLATFORM_LINKS.map((l) => ({ label: l.label, href: l.href })),
  platformLinksColumnTitle: "Helpful links",
  bookSurveyLabel: "Book a visit",
  bookSurveyHref: "/contact",
  companyHoursLabel: "Hours:",
  companyServingLine: "Laguna & Southern Luzon",
  bottomTagline: "Licensed HVAC contractor · Residential & commercial AC · Refrigeration",
  copyrightTemplate: `© {year} ${SITE.legalName}. All rights reserved.`,
};
