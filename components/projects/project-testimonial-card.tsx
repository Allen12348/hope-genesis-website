import { Quote, Star } from "lucide-react";
import type { Testimonial } from "@/types";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ProjectTestimonialCard({ testimonial, className }: { testimonial: Testimonial; className?: string }) {
  return (
    <Card className={cn("rounded-3xl border-border/70 bg-card/90 p-6 sm:p-8", className)}>
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Quote className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-display text-lg font-semibold text-foreground">{testimonial.name}</p>
            <div className="flex items-center gap-0.5 text-amber-500" aria-label={`${testimonial.rating} out of 5 stars`}>
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-current" />
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {[testimonial.role, testimonial.company].filter(Boolean).join(" · ")}
          </p>
          <blockquote className="mt-4 text-sm leading-relaxed text-foreground/90">&ldquo;{testimonial.quote}&rdquo;</blockquote>
        </div>
      </div>
    </Card>
  );
}
