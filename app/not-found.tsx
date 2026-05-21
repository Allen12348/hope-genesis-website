import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-b from-muted/30 via-background to-background">
      <div className="pointer-events-none absolute inset-0 bg-grid-fade opacity-30 dark:opacity-[0.15]" aria-hidden />
      <div className="relative mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-6 py-20">
        <Card className="rounded-3xl border-border/70 p-8 shadow-glass backdrop-blur-md sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">404</p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-display sm:text-4xl">
            Page not found
          </h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            The page you are looking for may have moved. Return to the homepage or contact Hope Genesis
            Enterprises for assistance.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="rounded-2xl">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Back to home
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-2xl">
              <Link href="/contact">Contact support</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
