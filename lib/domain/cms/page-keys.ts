/** Canonical CMS page keys — shared by admin, merge layer, and revalidation maps. */

export const CMS_PAGE_KEYS = {

  home: "home",

  about: "about",

  contact: "contact",

  coverageMap: "coverage-map",

  servicesLanding: "services-landing",

  projectsLanding: "projects-landing",

  galleryLanding: "gallery-landing",

  testimonialsLanding: "testimonials-landing",

  brandsLanding: "brands-landing",

  blogLanding: "blog-landing",

  footer: "footer",

  navigationHeader: "navigation-header",

  seo: "seo",

  homepageHero: "homepage-hero",

} as const;



export type CmsPageKey = (typeof CMS_PAGE_KEYS)[keyof typeof CMS_PAGE_KEYS];



export const ALL_CMS_PAGE_KEYS = Object.values(CMS_PAGE_KEYS);


