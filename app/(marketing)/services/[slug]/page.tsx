import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { BreadcrumbItem } from "@/components/layout/breadcrumbs";
import { isPrimaryServiceDataSlug } from "@/constants/routes";
import { getPublicServiceBySlug } from "@/lib/services/marketing";
import { ServiceDetailView } from "@/components/pages/service-detail-view";
import { PageCta } from "@/components/layout/page-cta";
import { pageMeta } from "@/lib/page-meta";

export const dynamic = "force-dynamic";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getPublicServiceBySlug(params.slug);
  if (!service) return { title: "Service" };
  return pageMeta({
    title: service.title,
    description: service.shortDescription,
    path: `/services/${params.slug}`,
    ogImage: service.heroImage,
  });
}

export default async function ServiceSlugPage({ params }: Props) {
  const service = await getPublicServiceBySlug(params.slug);
  if (!service || isPrimaryServiceDataSlug(params.slug)) notFound();

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
