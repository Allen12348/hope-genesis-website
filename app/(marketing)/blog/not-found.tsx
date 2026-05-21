import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BlogNotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="font-display text-2xl font-semibold">Article not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">This article may have been removed or the link is incorrect.</p>
      <Button asChild className="mt-6 rounded-2xl">
        <Link href="/blog">Back to blog</Link>
      </Button>
    </div>
  );
}
