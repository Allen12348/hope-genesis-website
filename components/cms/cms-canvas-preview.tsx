"use client";

import type { BuilderSection } from "@/lib/cms/page-builder/schema";
import type { PageRendererAdminPreview, PageRendererContext } from "@/components/cms/page-renderer";
import { PageRenderer } from "@/components/cms/page-renderer";
import { cn } from "@/lib/utils";

type Props = {
  blocks: BuilderSection[];
  ctx: PageRendererContext;
  selectedBlockId?: string | null;
  className?: string;
  previewTheme?: "light" | "dark";
  adminPreview?: PageRendererAdminPreview;
  emptyPlaceholder?: React.ReactNode;
};

/** Live draft preview for the visual CMS builder. */
export function CmsCanvasPreview({
  blocks,
  ctx,
  selectedBlockId,
  className,
  previewTheme = "light",
  adminPreview,
  emptyPlaceholder,
}: Props) {
  const mergedPreview: PageRendererAdminPreview = {
    ...adminPreview,
    emptyPlaceholder: emptyPlaceholder ?? adminPreview?.emptyPlaceholder,
    wrapSection:
      adminPreview?.wrapSection ??
      (({ section, node, isHidden }) => (
        <div
          data-cms-block={section.id}
          className={cn(
            "rounded-2xl transition-shadow",
            selectedBlockId === section.id && "ring-2 ring-accent ring-offset-2 ring-offset-background",
            isHidden && "opacity-60",
          )}
        >
          {node}
        </div>
      )),
  };

  return (
    <div className={cn("w-full", previewTheme === "dark" && "dark", className)}>
      <PageRenderer sections={blocks} ctx={ctx} adminPreview={mergedPreview} />
    </div>
  );
}
