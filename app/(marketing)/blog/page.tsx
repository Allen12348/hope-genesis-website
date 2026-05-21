import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { PageCta } from "@/components/layout/page-cta";
import { BlogIndexClient } from "@/components/blog/blog-index-client";
import { pageMeta } from "@/lib/page-meta";
import { SITE } from "@/constants/site";
import { blogPosts as staticBlogCatalog } from "@/data/blog-posts";
import { getPublicBlogPostSummaries } from "@/lib/services/marketing";
import type { BlogPostSummary } from "@/types";
import { PageBuilderStack } from "@/components/cms/page-builder-stack";
import { CMS_PAGE_KEYS } from "@/lib/cms/marketing-cms-defaults";

export const metadata: Metadata = pageMeta({
  title: "Blog",
  description: `HVAC and refrigeration insights from ${SITE.name} — buying guides, maintenance calendars, and troubleshooting perspectives.`,
  path: "/blog",
});

export default async function BlogPage() {
  const builder = await PageBuilderStack({ pageKey: CMS_PAGE_KEYS.blogLanding });
  if (builder) return builder;

  let summaries: BlogPostSummary[] = [];
  try {
    summaries = await getPublicBlogPostSummaries();
  } catch {
    /* CMS / DB unavailable — fall back to bundled editorial samples */
  }
  if (summaries.length === 0) {
    summaries = staticBlogCatalog.map((p) => {
      const { body, ...rest } = p;
      void body;
      return rest;
    });
  }

  return (
    <>
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Blog" },
        ]}
        eyebrow="Insights"
        title="Editorial briefings for facilities and homeowners"
        description="Practical guidance on sizing, energy behavior, maintenance cadence, and when to escalate to a licensed technician."
      />
      <section className="border-b border-border/60 bg-gradient-to-b from-muted/15 to-background py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <BlogIndexClient blogPosts={summaries} />
        </div>
      </section>
      <PageCta />
    </>
  );
}
