import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { PageCta } from "@/components/layout/page-cta";
import { ProjectsSection } from "@/components/sections/projects-section";
import { SITE } from "@/constants/site";
import { getProjects } from "@/lib/services";
import { PageBuilderStack } from "@/components/cms/page-builder-stack";
import { CMS_PAGE_KEYS } from "@/lib/cms/marketing-cms-defaults";
import { resolveCmsPageMetadata } from "@/lib/seo/resolve-cms-seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveCmsPageMetadata("/projects", {
    title: "Projects",
    description: `Case studies and portfolio work from ${SITE.name} — commercial HVAC, residential comfort, and industrial refrigeration.`,
    path: "/projects",
  });
}

export default async function ProjectsPage() {
  const builder = await PageBuilderStack({ pageKey: CMS_PAGE_KEYS.projectsLanding });
  if (builder) return builder;

  const projects = await getProjects();

  return (
    <>
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Projects" },
        ]}
        eyebrow="Portfolio"
        title="Engineered outcomes you can verify"
        description="From VRF campuses to cold chain — disciplined commissioning, clean documentation, and client-ready turnover."
      />
      <ProjectsSection intro={false} projects={projects} />
      <PageCta />
    </>
  );
}
