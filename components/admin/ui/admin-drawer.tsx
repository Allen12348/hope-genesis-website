"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const AdminDrawer = DialogPrimitive.Root;
const AdminDrawerTrigger = DialogPrimitive.Trigger;

const AdminDrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/55 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
AdminDrawerOverlay.displayName = "AdminDrawerOverlay";

const AdminDrawerContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    title: string;
    size?: "md" | "lg" | "xl" | "wide";
    /** Pinned below the scroll region (e.g. Save / Cancel). */
    footer?: React.ReactNode;
  }
>(({ className, children, title, size = "lg", footer, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <AdminDrawerOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-y-0 right-0 z-50 flex h-dvh w-full flex-col border-l border-border bg-background shadow-2xl duration-200",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right-8 data-[state=open]:slide-in-from-right-8",
        size === "md" && "max-w-md",
        size === "lg" && "max-w-lg sm:max-w-xl",
        size === "xl" && "max-w-xl sm:max-w-2xl",
        size === "wide" && "max-w-2xl sm:max-w-4xl lg:max-w-5xl",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5">
        <DialogPrimitive.Title className="font-display text-sm font-semibold text-foreground">{title}</DialogPrimitive.Title>
        <DialogPrimitive.Close className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </div>
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto scroll-smooth px-4 py-4 sm:px-5">{children}</div>
        {footer}
      </div>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
AdminDrawerContent.displayName = "AdminDrawerContent";

function AdminDrawerFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-10 flex shrink-0 flex-col-reverse gap-2 border-t border-sky-200/50 bg-white/80 px-4 py-3 backdrop-blur-md sm:flex-row sm:justify-end sm:px-5 dark:border-sky-900/40 dark:bg-slate-950/80",
        className,
      )}
      {...props}
    />
  );
}

export { AdminDrawer, AdminDrawerTrigger, AdminDrawerContent, AdminDrawerFooter };
