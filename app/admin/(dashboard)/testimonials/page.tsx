import type { Metadata } from "next";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/options";

import { getAdminTestimonials } from "@/lib/application/queries/admin";

import { SITE } from "@/constants/site";

import { TestimonialsManager } from "@/components/admin/testimonials-manager";



export const metadata: Metadata = {

  title: `Testimonials | Admin | ${SITE.name}`,

  robots: { index: false, follow: false },

};



export default async function AdminTestimonialsPage() {

  const session = await getServerSession(authOptions);

  const rows = await getAdminTestimonials();

  return <TestimonialsManager rows={rows} role={session!.user.role} />;

}

