"use client";

import * as React from "react";
import { HeroSection } from "@/components/sections/hero-section";
import { HomepageSections } from "@/components/home/homepage-sections";
import { MarketingSiteProvider } from "@/components/providers/marketing-site-provider";
import type { HomepageEditorState } from "@/lib/cms/homepage-visual-editor/types";
import type { HomepageCanvasSectionId } from "@/lib/cms/homepage-visual-editor/types";
import { buildPreviewCmsBundle } from "@/lib/cms/homepage-visual-editor/preview-cms";
import type { PublicMarketingCmsBundle } from "@/lib/cms/merge-public-marketing-cms";
import type { PageBuilderPreviewContext } from "@/lib/cms/page-builder/preview-data";
import { HomepageSectionToolbar } from "@/components/admin/homepage-visual-editor/homepage-section-toolbar";
import { HOMEPAGE_BLOCK_BY_ID, isSectionVisible } from "@/lib/cms/homepage-visual-editor/registry";
import { cn } from "@/lib/utils";
import type { HomeLegacySectionId } from "@/lib/cms/homepage-sections";

type Props = {
  state: HomepageEditorState;
  baseCms: PublicMarketingCmsBundle;
  previewCtx: PageBuilderPreviewContext;
  selectedId: HomepageCanvasSectionId | null;
  onSelectSection: (id: HomepageCanvasSectionId) => void;
  onMoveSection: (id: HomeLegacySectionId, dir: -1 | 1) => void;
  onToggleVisible: (id: HomeLegacySectionId) => void;
  onDuplicate: (id: HomeLegacySectionId) => void;
  onReset: (id: HomepageCanvasSectionId) => void;
  onDelete: (id: HomeLegacySectionId) => void;
  viewport: "desktop" | "tablet" | "mobile";
  previewTheme: "light" | "dark";
};

function SectionChrome({
  id,
  label,
  visible,
  selected,
  canMoveUp,
  canMoveDown,
  canDelete,
  onSelect,
  onMoveUp,
  onMoveDown,
  onToggleVisible,
  onDuplicate,
  onReset,
  onDelete,
  children,
}: {
  id: HomepageCanvasSectionId;
  label: string;
  visible: boolean;
  selected: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  canDelete: boolean;
  onSelect: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onToggleVisible: () => void;
  onDuplicate: () => void;
  onReset: () => void;
  onDelete: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      data-hve-section={id}
      className={cn(
        "group relative scroll-mt-4",
        selected && "ring-2 ring-sky-500/50 ring-offset-2 ring-offset-background rounded-2xl",
        !visible && id !== "hero" && "opacity-50",
      )}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-2 z-20 flex justify-center opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
        <div className="pointer-events-auto">
        <HomepageSectionToolbar
          sectionId={id}
          label={label}
          visible={visible}
          selected={selected}
          canMoveUp={canMoveUp}
          canMoveDown={canMoveDown}
          canDelete={canDelete}
          onSelect={onSelect}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onToggleVisible={onToggleVisible}
          onDuplicate={onDuplicate}
          onReset={onReset}
          onDelete={onDelete}
        />
        </div>
      </div>
      {children}
    </div>
  );
}

export function HomepageVisualPreview({
  state,
  baseCms,
  previewCtx,
  selectedId,
  onSelectSection,
  onMoveSection,
  onToggleVisible,
  onDuplicate,
  onReset,
  onDelete,
  viewport,
  previewTheme,
}: Props) {
  const cms = React.useMemo(() => buildPreviewCmsBundle(state, baseCms), [state, baseCms]);
  const { services, projects, testimonials, brands, resolvedSite } = previewCtx;

  const previewWidth =
    viewport === "mobile" ? "max-w-[390px]" : viewport === "tablet" ? "max-w-[768px]" : "max-w-full";

  const order = state.order;

  return (
    <MarketingSiteProvider value={{ site: resolvedSite, cms }}>
      <div className={cn("mx-auto w-full transition-[max-width]", previewWidth, previewTheme === "dark" && "dark")}>
        <SectionChrome
          id="hero"
          label="Hero"
          visible
          selected={selectedId === "hero"}
          canMoveUp={false}
          canMoveDown={false}
          canDelete={false}
          onSelect={() => onSelectSection("hero")}
          onMoveUp={() => {}}
          onMoveDown={() => {}}
          onToggleVisible={() => {}}
          onDuplicate={() => {}}
          onReset={() => onReset("hero")}
          onDelete={() => {}}
        >
          <HeroSection />
        </SectionChrome>

        {order.map((sectionId, index) => {
          const block = HOMEPAGE_BLOCK_BY_ID[sectionId];
          const visible = isSectionVisible(sectionId, state.visibility);
          return (
            <SectionChrome
              key={sectionId}
              id={sectionId}
              label={block.label}
              visible={visible}
              selected={selectedId === sectionId}
              canMoveUp={index > 0}
              canMoveDown={index < order.length - 1}
              canDelete={!block.required}
              onSelect={() => onSelectSection(sectionId)}
              onMoveUp={() => onMoveSection(sectionId, -1)}
              onMoveDown={() => onMoveSection(sectionId, 1)}
              onToggleVisible={() => onToggleVisible(sectionId)}
              onDuplicate={() => onDuplicate(sectionId)}
              onReset={() => onReset(sectionId)}
              onDelete={() => onDelete(sectionId)}
            >
              <HomepageSections
                cms={cms}
                visibility={{ ...state.visibility, [sectionId]: visible } as typeof state.visibility}
                order={[sectionId]}
                services={services}
                projects={projects}
                testimonials={testimonials}
                brands={brands}
              />
            </SectionChrome>
          );
        })}
      </div>
    </MarketingSiteProvider>
  );
}
