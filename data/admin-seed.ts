import type {
  AdminGalleryRecord,
  AdminProjectRecord,
  AdminServiceRecord,
  AdminTestimonialRecord,
} from "@/lib/admin/types";

export const adminServicesSeed: AdminServiceRecord[] = [
  {
    id: "svc-1",
    slug: "aircon-installation",
    title: "Aircon Installation",
    updatedAt: "2026-05-01",
    published: true,
  },
  {
    id: "svc-2",
    slug: "preventive-maintenance",
    title: "Preventive Maintenance",
    updatedAt: "2026-05-02",
    published: true,
  },
];

export const adminGallerySeed: AdminGalleryRecord[] = [
  {
    id: "gal-1",
    caption: "Commissioning outdoor unit",
    src: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80",
    updatedAt: "2026-04-20",
  },
];

export const adminProjectsSeed: AdminProjectRecord[] = [
  {
    id: "prj-1",
    slug: "vrf-campus-retrofit",
    title: "VRF Campus Retrofit",
    category: "Commercial",
    updatedAt: "2026-05-10",
  },
];

export const adminTestimonialsSeed: AdminTestimonialRecord[] = [
  {
    id: "tst-1",
    name: "Client A",
    company: "Mock Holdings",
    rating: 5,
    updatedAt: "2026-03-12",
  },
];
