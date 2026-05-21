"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-md shadow-slate-900/10 hover:bg-primary/92 active:scale-[0.99]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline:
          "border-2 border-slate-300 bg-white/80 text-slate-900 shadow-sm backdrop-blur hover:border-slate-400 hover:bg-white dark:border-white/20 dark:bg-black/50 dark:text-white dark:hover:border-white/30 dark:hover:bg-black/60",
        ghost: "hover:bg-muted/70",
        accent:
          "border-2 border-foreground/18 bg-background text-foreground shadow-sm ring-0 backdrop-blur hover:border-foreground/32 hover:bg-muted/35 active:scale-[0.99]",
        contrast:
          "bg-slate-950 text-white shadow-md shadow-slate-900/20 hover:bg-slate-950/92 hover:shadow-[0_0_28px_-6px_rgba(56,189,248,0.35)] active:scale-[0.99] dark:bg-slate-950 dark:text-white dark:hover:bg-slate-950/90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-12 rounded-xl px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
