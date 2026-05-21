import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type Props = ComponentPropsWithoutRef<"section"> & {
  eyebrow?: string;
  title: string;
  description?: string;
  /** When false, only renders children (for inner pages that use `PageHero` for the title). */
  intro?: boolean;
};

/** Consistent section spacing + typographic rhythm for long-scroll pages. */
export function SectionShell({
  id,
  eyebrow,
  title,
  description,
  intro = true,
  className,
  children,
  ...props
}: Props) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 section-divider-top bg-cool-vignette py-20 sm:py-28 lg:py-36",
        className,
      )}
      {...props}
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {intro ? (
          <div className="max-w-3xl">
            {eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{eyebrow}</p>
            ) : null}
            <h2 className="mt-4 font-display text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.08] tracking-[-0.02em] text-balance text-foreground sm:mt-5">
              {title}
            </h2>
            {description ? (
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg">
                {description}
              </p>
            ) : null}
          </div>
        ) : null}
        <div className={intro ? "mt-10 sm:mt-14 lg:mt-16" : "mt-0"}>{children}</div>
      </div>
    </section>
  );
}
