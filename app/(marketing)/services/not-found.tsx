import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ServicesNotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="font-display text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">We could not find that service page.</p>
      <Button asChild className="mt-6 rounded-2xl">
        <Link href="/services">Back to services</Link>
      </Button>
    </div>
  );
}
