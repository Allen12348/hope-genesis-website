import type { Metadata } from "next";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/options";

import { getAdminProjects, getAdminTestimonials } from "@/lib/application/queries/admin";

import { SITE } from "@/constants/site";

import { ProjectsManager } from "@/components/admin/projects-manager";



export const metadata: Metadata = {

  title: `Projects | Admin | ${SITE.name}`,

  robots: { index: false, follow: false },

};



export default async function AdminProjectsPage() {

  const session = await getServerSession(authOptions);

  const [rows, testimonials] = await Promise.all([getAdminProjects(), getAdminTestimonials()]);

  return <ProjectsManager rows={rows} role={session!.user.role} testimonials={testimonials} />;

}

