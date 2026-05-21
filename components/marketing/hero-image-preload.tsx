/** Preloads the resolved homepage hero still image for faster LCP (skipped when empty). */
export function HeroImagePreload({ href }: { href: string }) {
  const url = href.trim();
  if (!url) return null;
  return <link rel="preload" href={url} as="image" fetchPriority="high" />;
}
