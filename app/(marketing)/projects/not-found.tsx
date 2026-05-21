import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProjectsNotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="font-display text-2xl font-semibold">Project not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">This case study may have moved or is unpublished.</p>
      <Button asChild className="mt-6 rounded-2xl">
        <Link href="/projects">All projects</Link>
      </Button>
    </div>
  );
}
