import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { BreadcrumbItem } from "@/components/layout/breadcrumbs";
import { getPublicProjectBySlug } from "@/lib/services/marketing";
import { ProjectDetailView } from "@/components/pages/project-detail-view";
import { PageCta } from "@/components/layout/page-cta";
import { pageMeta } from "@/lib/page-meta";

export const dynamic = "force-dynamic";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getPublicProjectBySlug(params.slug);
  if (!project) return { title: "Project" };
  return pageMeta({
    title: project.title,
    description: project.summary,
    path: `/projects/${project.slug}`,
    ogImage: project.image,
  });
}

export default async function ProjectSlugPage({ params }: Props) {
  const project = await getPublicProjectBySlug(params.slug);
  if (!project) notFound();

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: project.title },
  ];

  return (
    <>
      <ProjectDetailView project={project} breadcrumbs={breadcrumbs} />
      <PageCta />
    </>
  );
}
