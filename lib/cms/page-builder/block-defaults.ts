import type { BuilderBlockType, BuilderSection } from "@/lib/cms/page-builder/schema";
import { BUILDER_BLOCK_TYPES } from "@/lib/cms/page-builder/schema";
import { BLOCK_CATALOG } from "@/lib/cms/page-builder/registry";

const catalogLabels = Object.fromEntries(
  BLOCK_CATALOG.map((e) => [e.type, e.label]),
) as Partial<Record<BuilderBlockType, string>>;

export const BLOCK_LABELS = { ...catalogLabels } as Record<BuilderBlockType, string>;
for (const t of BUILDER_BLOCK_TYPES) {
  if (!BLOCK_LABELS[t]) BLOCK_LABELS[t] = t;
}

const shell = { eyebrow: "", title: "Section title", description: "", textAlign: "left" as const, sectionSpacing: "normal" as const, backgroundColor: "" };

export function defaultPropsForBlockType(type: BuilderBlockType): BuilderSection["props"] {
  switch (type) {
    case "hero":
      return {
        title: "New hero title",
        subtitle: "",
        eyebrow: "",
        backgroundImageUrl: "",
        overlayOpacity: 0.45,
        buttons: [],
        textAlign: "left",
        sectionSpacing: "normal",
        backgroundColor: "",
      };
    case "text":
      return { title: "", subtitle: "", body: "Add body copy.", textAlign: "left", sectionSpacing: "normal", backgroundColor: "" };
    case "richText":
      return { title: "", subtitle: "", body: "Add rich text content.", textAlign: "left", sectionSpacing: "normal", backgroundColor: "" };
    case "image":
      return { imageUrl: "", alt: "", caption: "", textAlign: "center", sectionSpacing: "normal", backgroundColor: "" };
    case "imageText":
      return { title: "", body: "", imageUrl: "", imageAlt: "", imagePosition: "right", textAlign: "left", sectionSpacing: "normal", backgroundColor: "" };
    case "twoColumn":
      return { leftTitle: "", leftBody: "", rightTitle: "", rightBody: "", textAlign: "left", sectionSpacing: "normal", backgroundColor: "" };
    case "servicesGrid":
    case "projectsGrid":
    case "galleryGrid":
    case "testimonials":
    case "brandsCarousel":
      return { ...shell };
    case "serviceCard":
      return {
        ...shell,
        cards: [{ icon: "", title: "Service", description: "", href: "/services" }],
      };
    case "cta":
      return {
        title: "Request your estimate",
        description: "",
        primaryLabel: "Get estimate",
        primaryHref: "/estimate",
        secondaryLabel: "Speak with HVAC expert",
        secondaryHref: "/contact",
        textAlign: "left",
        sectionSpacing: "normal",
        backgroundColor: "",
      };
    case "estimateCTA":
      return {
        title: "Get your instant estimate",
        description: "Share room size and installation details for a guided quote.",
        primaryLabel: "Get Instant Estimate",
        primaryHref: "/estimate",
        secondaryLabel: "Book survey",
        secondaryHref: "/contact",
        textAlign: "left",
        sectionSpacing: "normal",
        backgroundColor: "",
      };
    case "contactCTA":
      return {
        title: "Talk to Hope Genesis Enterprises",
        description: "Licensed HVAC technicians for installation, cleaning, and repair.",
        primaryLabel: "Contact",
        primaryHref: "/contact",
        phone: "",
        textAlign: "left",
        sectionSpacing: "normal",
        backgroundColor: "",
      };
    case "stats":
      return {
        eyebrow: "",
        title: "By the numbers",
        description: "",
        items: [{ label: "Projects", value: "120", suffix: "+" }],
        textAlign: "left",
        sectionSpacing: "normal",
        backgroundColor: "",
      };
    case "faq":
      return {
        title: "FAQ",
        description: "",
        items: [{ q: "Question?", a: "Answer." }],
        textAlign: "left",
        sectionSpacing: "normal",
        backgroundColor: "",
      };
    case "contact":
      return { eyebrow: "", title: "Contact us", description: "", textAlign: "left", sectionSpacing: "normal", backgroundColor: "" };
    case "contactInfo":
      return { title: "Contact", phone: "", email: "", address: "", hours: "", textAlign: "left", sectionSpacing: "normal", backgroundColor: "" };
    case "contactForm":
      return { title: "Send a message", description: "", submitLabel: "Send message", textAlign: "left", sectionSpacing: "normal", backgroundColor: "" };
    case "map":
      return { eyebrow: "", title: "Coverage", description: "", textAlign: "left", sectionSpacing: "normal", backgroundColor: "" };
    case "buttonGroup":
      return {
        title: "",
        description: "",
        buttons: [{ label: "Learn more", href: "/services", variant: "accent" }],
        textAlign: "left",
        sectionSpacing: "normal",
        backgroundColor: "",
      };
    case "blogFeed":
      return { eyebrow: "", title: "Blog", description: "", textAlign: "left", sectionSpacing: "normal", backgroundColor: "" };
    case "timeline":
      return {
        title: "Our journey",
        description: "",
        items: [{ year: "2020", title: "Founded", description: "" }],
        textAlign: "left",
        sectionSpacing: "normal",
        backgroundColor: "",
      };
    case "team":
      return {
        title: "Our team",
        description: "",
        members: [{ name: "Team member", role: "Role", imageUrl: "", bio: "" }],
        textAlign: "left",
        sectionSpacing: "normal",
        backgroundColor: "",
      };
    case "certifications":
      return {
        title: "Certifications",
        description: "",
        items: [{ title: "Certification", imageUrl: "" }],
        textAlign: "left",
        sectionSpacing: "normal",
        backgroundColor: "",
      };
    case "footerColumns":
      return {
        columns: [{ title: "Services", links: [{ label: "Installation", href: "/services/installation" }] }],
        copyright: "© Hope Genesis Enterprises",
        tagline: "",
      };
    case "navigationMenu":
      return {
        logoText: "HGE",
        logoUrl: "",
        items: [
          { label: "Services", href: "/services", visible: true },
          { label: "Contact", href: "/contact", visible: true },
        ],
        ctaLabel: "Get estimate",
        ctaHref: "/estimate",
        callLabel: "Call now",
        showCallButton: true,
      };
    case "seoMeta":
      return {
        pageTitle: "Hope Genesis Enterprises",
        metaDescription: "",
        keywords: "",
        ogImage: "",
      };
    case "spacer":
      return { height: "md" };
    case "divider":
      return { style: "solid" };
  }
  const _never: never = type;
  return _never;
}
