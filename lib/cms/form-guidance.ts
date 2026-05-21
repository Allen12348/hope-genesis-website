/** Shared copy for admin CMS forms — placeholders, helpers, tooltips. */

export const FORM_TOOLTIPS = {
  slug: "URL-friendly ID used in the web address. Lowercase letters, numbers, and hyphens only. Auto-generated from the title unless you turn that off.",
  seoTitle: "Shown in Google search results and the browser tab. Keep under ~60 characters for best display.",
  seoDescription: "Short summary under the title in search results. Aim for 120–160 characters.",
  sortOrder: "Lower numbers appear first in lists. Use 0, 10, 20 to leave room for inserts later.",
  featured: "Featured items appear more prominently on the homepage and listing pages.",
  published: "When off, visitors cannot see this item on the public website.",
  readingMinutes: "Estimated read time shown on the blog card. Count ~200 words per minute.",
  monogram: "2–3 letter abbreviation shown when no logo image is set (e.g. DK for Daikin).",
  fallbackImage:
    "Backup image if the remote URL is empty or fails. Use a full https:// URL or a path from the public folder (e.g. /images/hero.jpg).",
  altText: "Describes the image for screen readers and SEO. Be specific about what is shown.",
  tags: "Comma-separated keywords for filtering and internal organization.",
  faqJson: 'JSON array of questions and answers, e.g. [{"q":"How long?","a":"About 2 hours."}]',
} as const;

export const BLOG_GUIDANCE = {
  slug: { placeholder: "how-to-clean-aircon-filter", helper: "Used in the blog URL: /blog/your-slug" },
  title: { placeholder: "How to Properly Clean Your Air Conditioner Filter", helper: "Clear, benefit-focused headline readers will see first." },
  description: {
    placeholder: "Learn how to clean your AC filter properly to improve cooling and reduce electricity costs.",
    helper: "Short intro shown on blog cards and search snippets.",
  },
  readingMinutes: { placeholder: "6", helper: "Typical articles: 4–8 minutes." },
  coverFallback: { placeholder: "https://example.com/blog-cover.jpg", helper: FORM_TOOLTIPS.fallbackImage },
  body: {
    placeholder: "First paragraph...\n\nSecond paragraph after a blank line...",
    helper: "Separate paragraphs with a blank line. Each block becomes its own paragraph on the page.",
  },
} as const;

export const PROJECT_GUIDANCE = {
  title: { placeholder: "Daikin VRF Installation at SM Calamba", helper: "Project name as shown on the portfolio card." },
  location: { placeholder: "Calamba, Laguna", helper: "City and province where the work was done." },
  summary: {
    placeholder: "Installed a complete commercial VRF system for a 3-storey office building.",
    helper: "One or two sentences for the project card.",
  },
  scope: {
    placeholder: "• Supply and installation\n• Copper tubing\n• Electrical works\n• Vacuum testing\n• Commissioning",
    helper: "Bullet list of work performed. One item per line.",
  },
} as const;

export const SERVICE_GUIDANCE = {
  title: { placeholder: "Aircon Cleaning Service", helper: "Service name on the public services page." },
  shortDescription: {
    placeholder: "Professional cleaning for split-type and window-type air conditioners.",
    helper: "One sentence for cards and listings.",
  },
  highlights: {
    placeholder: "• Deep cleaning\n• Chemical wash\n• Filter cleaning\n• Drain line flushing",
    helper: "Key benefits — one bullet per line.",
  },
  idealFor: {
    placeholder: "• Homes and condos\n• Small offices\n• Pre-summer maintenance",
    helper: "Who this service is best for — one per line.",
  },
} as const;

export const TESTIMONIAL_GUIDANCE = {
  clientName: { placeholder: "Maria Santos", helper: "Customer or contact name shown publicly." },
  company: { placeholder: "South Luzon Logistics", helper: "Optional business name for B2B reviews." },
  role: { placeholder: "Operations Manager", helper: "Job title or relationship to the company." },
  review: {
    placeholder: "Fast response and professional installation. Highly recommended.",
    helper: "The customer quote — keep it authentic and specific.",
  },
} as const;

export const BRAND_GUIDANCE = {
  name: { placeholder: "Daikin", helper: "Manufacturer or partner name as shown on the site." },
  description: {
    placeholder: "Authorized Daikin air conditioning solutions provider.",
    helper: "Optional short line about your partnership.",
  },
  monogram: { placeholder: "DK", helper: FORM_TOOLTIPS.monogram },
} as const;

export const GALLERY_GUIDANCE = {
  caption: { placeholder: "Commercial VRF Installation", helper: "Title shown under the image in the gallery grid." },
  alt: { placeholder: "Technicians installing outdoor VRF units on a rooftop", helper: FORM_TOOLTIPS.altText },
  category: { placeholder: "Commercial", helper: "Groups images in filters (e.g. Residential, Commercial)." },
  imageUrl: { placeholder: "https://example.com/project.jpg", helper: "Full https URL to the image file." },
} as const;

export const SEO_GUIDANCE = {
  metaTitle: {
    placeholder: "Professional HVAC Services in Laguna | Hope Genesis Enterprises",
    helper: FORM_TOOLTIPS.seoTitle,
  },
  metaDescription: {
    placeholder:
      "Trusted air conditioning installation, cleaning, and refrigeration services in Laguna and Metro Manila.",
    helper: FORM_TOOLTIPS.seoDescription,
  },
} as const;

export const HEADER_GUIDANCE = {
  logoText: { placeholder: "HGE", helper: "Short text logo when no image is uploaded." },
  companyName: { placeholder: "Hope Genesis Enterprises", helper: "Full company name beside the logo." },
  companySubtitle: { placeholder: "HVAC & Refrigeration Specialists", helper: "Tagline under the company name." },
  primaryCtaLabel: { placeholder: "Get a Quote", helper: "Main button text in the header." },
  primaryCtaUrl: { placeholder: "/estimate", helper: "Where the main button links (use / paths for site pages)." },
  navLabel: { placeholder: "Services", helper: "Link text visitors see in the menu." },
  navHref: { placeholder: "/services", helper: "Page path (e.g. /contact) or full URL for external links." },
} as const;

export const inputClass =
  "rounded-xl border-border/80 bg-white/80 shadow-sm backdrop-blur-sm transition focus-visible:border-sky-400/60 focus-visible:ring-sky-500/25 dark:bg-slate-900/50";
