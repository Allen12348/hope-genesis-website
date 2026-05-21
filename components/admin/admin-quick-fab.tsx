"use client";

import Link from "next/link";
import { Calendar, ImageIcon, MessageSquareQuote, PanelLeft, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin/content", label: "Content", icon: Calendar },
  { href: "/admin/projects?new=1", label: "Project", icon: PanelLeft },
  { href: "/admin/testimonials", label: "Testimonial", icon: MessageSquareQuote },
  { href: "/admin/gallery?new=1", label: "Gallery", icon: ImageIcon },
  { href: "/admin/blog", label: "Blog", icon: PenLine },
] as const;

export function AdminQuickFab({ className }: { className?: string }) {
  return (
    <TooltipProvider delayDuration={200}>
      <div
        className={cn(
          "pointer-events-none fixed bottom-6 right-4 z-30 flex flex-col items-end gap-2 sm:right-6 lg:hidden",
          className,
        )}
      >
        <div className="pointer-events-auto flex flex-col gap-2 rounded-2xl border border-border bg-card/95 p-2 shadow-lg backdrop-blur-md">
          {LINKS.map(({ href, label, icon: Icon }) => (
            <Tooltip key={href}>
              <TooltipTrigger asChild>
                <Button size="icon" variant="secondary" className="h-10 w-10 rounded-xl border border-border shadow-sm" asChild>
                  <Link href={href} aria-label={label}>
                    <Icon className="h-4 w-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">{label}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
