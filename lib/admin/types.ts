/**
 * Admin CMS domain shapes for mock/seed data.
 */
export type AdminServiceRecord = {
  id: string;
  slug: string;
  title: string;
  updatedAt: string;
  published: boolean;
};

export type AdminGalleryRecord = {
  id: string;
  caption: string;
  src: string;
  updatedAt: string;
};

export type AdminProjectRecord = {
  id: string;
  slug: string;
  title: string;
  category: string;
  updatedAt: string;
};

export type AdminTestimonialRecord = {
  id: string;
  name: string;
  company: string;
  rating: number;
  updatedAt: string;
};

