import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const adminBadgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
  {
    variants: {
      variant: {
        default: "border-border bg-muted/60 text-muted-foreground",
        success: "border-emerald-500/35 bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
        warning: "border-amber-500/40 bg-amber-500/12 text-amber-800 dark:text-amber-200",
        danger: "border-red-500/35 bg-red-500/10 text-red-700 dark:text-red-300",
        info: "border-sky-500/35 bg-sky-500/10 text-sky-800 dark:text-sky-200",
        accent: "border-[hsl(var(--accent)/0.45)] bg-[hsl(var(--accent)/0.14)] text-[hsl(var(--accent-foreground))]",
        navy: "border-[hsl(var(--brand-navy)/0.35)] bg-[hsl(var(--brand-navy)/0.12)] text-[hsl(var(--brand-navy))] dark:text-white",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export type AdminBadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof adminBadgeVariants>;

export function AdminBadge({ className, variant, ...props }: AdminBadgeProps) {
  return <span className={cn(adminBadgeVariants({ variant }), className)} {...props} />;
}
