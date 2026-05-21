import type { Metadata } from "next";
import { CmsImage } from "@/components/media/cms-image";
import { notFound } from "next/navigation";
import { PageCta } from "@/components/layout/page-cta";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SITE } from "@/constants/site";
import { pageMeta } from "@/lib/page-meta";
import { getSiteUrl } from "@/lib/seo-defaults";
import { getPublicBlogBySlug } from "@/lib/services/marketing";

export const dynamic = "force-dynamic";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  let post;
  try {
    post = await getPublicBlogBySlug(params.slug);
  } catch {
    return { title: "Article" };
  }
  if (!post) return { title: "Article" };
  return pageMeta({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    ogImage: post.coverImage,
    ogType: "article",
    publishedTime: post.publishedAt,
  });
}

export default async function BlogArticlePage({ params }: Props) {
  let post;
  try {
    post = await getPublicBlogBySlug(params.slug);
  } catch {
    notFound();
  }
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    author: { "@type": "Organization", name: SITE.name },
    publisher: { "@type": "Organization", name: SITE.name },
    image: post.coverImage,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${getSiteUrl()}/blog/${post.slug}`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="border-b border-border/70 bg-gradient-to-b from-muted/20 to-background">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
              { label: post.title },
            ]}
          />
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge variant="outline" className="rounded-full">
              {post.category}
            </Badge>
            <Badge variant="secondary" className="rounded-full">
              {post.readingMinutes} min read
            </Badge>
          </div>
          <h1 className="mt-4 max-w-3xl font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{post.description}</p>
          <p className="mt-3 text-sm text-muted-foreground">
            Published {new Date(post.publishedAt).toLocaleDateString("en-PH", { dateStyle: "long" })}
          </p>
        </div>
      </div>

      <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="relative aspect-[21/9] overflow-hidden rounded-3xl border border-border/70">
          <CmsImage src={post.coverImage} alt={post.coverAlt} fill priority className="object-cover" sizes="100vw" />
        </div>

        <Card className="mt-10 rounded-3xl border-border/70 bg-card/70 p-6 sm:p-10">
          <div className="max-w-none space-y-5">
            {post.body.map((para) => (
              <p key={para.slice(0, 32)} className="text-base leading-relaxed text-muted-foreground">
                {para}
              </p>
            ))}
          </div>
          <Separator className="my-8" />
          <p className="text-sm text-muted-foreground">
            This article is informational and not a substitute for on-site engineering judgment. Always consult a licensed
            professional for final equipment selection and safe installation practices.
          </p>
        </Card>
      </article>
      <PageCta />
    </>
  );
}
