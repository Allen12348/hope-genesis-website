import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { BreadcrumbItem } from "@/components/layout/breadcrumbs";
import type { PrimaryServiceSegment } from "@/constants/routes";
import { getDataSlugForSegment } from "@/constants/routes";
import { getPublicServiceBySlug } from "@/lib/services/marketing";
import { ServiceDetailView } from "@/components/pages/service-detail-view";
import { PageCta } from "@/components/layout/page-cta";
import { pageMeta } from "@/lib/page-meta";

export async function primaryServiceMetadata(segment: PrimaryServiceSegment): Promise<Metadata> {
  const slug = getDataSlugForSegment(segment);
  if (!slug) return {};
  const s = await getPublicServiceBySlug(slug);
  if (!s) return {};
  return pageMeta({
    title: s.title,
    description: s.shortDescription,
    path: `/services/${segment}`,
    ogImage: s.heroImage,
  });
}

export async function PrimaryServicePage({ segment }: { segment: PrimaryServiceSegment }) {
  const slug = getDataSlugForSegment(segment);
  if (!slug) notFound();
  const service = await getPublicServiceBySlug(slug);
  if (!service) notFound();

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: service.title },
  ];

  return (
    <>
      <ServiceDetailView service={service} breadcrumbs={breadcrumbs} />
      <PageCta />
    </>
  );
}
