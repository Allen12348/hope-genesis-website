"use client";

import * as React from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowUp,
  Copy,
  Eye,
  EyeOff,
  GripVertical,
  LayoutGrid,
  Monitor,
  Moon,
  Plus,
  Search,
  Smartphone,
  Sun,
  Tablet,
  Trash2,
} from "lucide-react";
import { CMS_PAGE_KEYS, type CmsPageKey } from "@/lib/cms/marketing-cms-defaults";
import type { PageBuilderDocument, BuilderSection, BuilderBlockType } from "@/lib/cms/page-builder/schema";
import { BUILDER_BLOCK_TYPES, newSectionId, validatePageBuilderDocument } from "@/lib/cms/page-builder/schema";
import { safeJsonParse } from "@/lib/utils/safe-json-parse";
import { BLOCK_LABELS, defaultPropsForBlockType } from "@/lib/cms/page-builder/block-defaults";
import {
  BLOCK_CATALOG,
  BLOCK_CATEGORY_LABELS,
  type BlockCategory,
} from "@/lib/cms/page-builder/registry";
import { CmsBlocksValidationError, validateBlocksForSave } from "@/lib/cms/cms-page";
import { DeveloperJsonPanel } from "@/components/admin/page-builder/developer-json-panel";
import { CmsCanvasPreview } from "@/components/cms/cms-canvas-preview";
import { tryParsePageBuilderJson } from "@/lib/cms/page-builder/parse";
import { extractHomepageBuilderOverlay, mergeHomePublishedJsonWithOverlay } from "@/lib/cms/page-builder/home-published-overlay";
import {
  getDefaultPageBuilderDocument,
  normalizeSectionOrders,
  normalizeSectionsFromStorage,
} from "@/lib/cms/page-builder/defaults";
import type { PageBuilderPreviewContext } from "@/lib/cms/page-builder/preview-data";
import { upsertPageContentAction } from "@/lib/actions/cms-site";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminFormField } from "@/components/admin/ui/admin-form-field";
import { FORM_TOOLTIPS, SEO_GUIDANCE } from "@/lib/cms/form-guidance";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

const DEBUG_PAGE_BUILDER = process.env.NEXT_PUBLIC_DEBUG_PAGE_BUILDER === "true";

const HOME_BUILDER_DEV_AUDIT = process.env.NODE_ENV === "development";

const CANVAS_TAIL_ID = "BUILDER_CANVAS_TAIL";
const CANVAS_EMPTY_ID = "BUILDER_CANVAS_EMPTY";

function canonicalDocJson(doc: PageBuilderDocument): string {
  return JSON.stringify({ v: doc.v, sections: doc.sections });
}

function createInitialDocument(pageKey: CmsPageKey, publishedData: string, draftData: string | null): PageBuilderDocument {
  const fromDraft = tryParsePageBuilderJson(draftData);
  if (fromDraft) return { v: 2, sections: normalizeSectionsFromStorage(fromDraft.sections) };
  if (pageKey === CMS_PAGE_KEYS.home) {
    const fromOverlay = extractHomepageBuilderOverlay(publishedData);
    if (fromOverlay) return { v: 2, sections: normalizeSectionsFromStorage(fromOverlay.sections) };
  }
  const fromPublished = tryParsePageBuilderJson(publishedData);
  if (fromPublished) return { v: 2, sections: normalizeSectionsFromStorage(fromPublished.sections) };
  return getDefaultPageBuilderDocument(pageKey);
}

function BlockMiniPreview({ type }: { type: BuilderBlockType }) {
  return (
    <div className="flex h-14 w-[52px] shrink-0 flex-col justify-between rounded-lg border border-border/70 bg-gradient-to-br from-muted/70 to-muted/30 p-1.5 shadow-inner dark:from-muted/40 dark:to-background">
      <div className="space-y-0.5">
        <div className="h-0.5 w-full rounded-full bg-foreground/20" />
        <div className="h-0.5 w-2/3 rounded-full bg-foreground/10" />
        {type === "hero" ? <div className="mt-0.5 h-3 rounded-sm bg-accent/70" /> : null}
        {type === "servicesGrid" ? (
          <div className="mt-1 grid grid-cols-2 gap-0.5">
            <div className="h-2 rounded-[2px] bg-primary/55" />
            <div className="h-2 rounded-[2px] bg-primary/35" />
            <div className="h-2 rounded-[2px] bg-primary/35" />
            <div className="h-2 rounded-[2px] bg-primary/55" />
          </div>
        ) : null}
      </div>
      {type !== "servicesGrid" && type !== "hero" ? (
        <div className="grid grid-cols-2 gap-0.5">
          <div className="h-2 rounded-[2px] bg-foreground/15" />
          <div className="h-2 rounded-[2px] bg-foreground/15" />
        </div>
      ) : null}
    </div>
  );
}

function LibraryDraggableRow({ entry }: { entry: (typeof BLOCK_CATALOG)[number] }) {
  const blockType = entry.type as BuilderBlockType;
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `library:${entry.type}`,
    data: { kind: "library", blockType },
  });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "mb-3 cursor-grab rounded-xl border border-border/70 bg-card p-3 shadow-sm transition hover:border-accent/40",
        isDragging && "opacity-50",
      )}
      {...listeners}
      {...attributes}
    >
      <div className="flex gap-3">
        <BlockMiniPreview type={blockType} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">{entry.label}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{entry.blurb}</p>
        </div>
      </div>
    </div>
  );
}

function EmptyCanvasDropArea() {
  const { setNodeRef, isOver } = useDroppable({ id: CANVAS_EMPTY_ID, data: { kind: "empty" } });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed p-6 text-center",
        isOver ? "border-accent bg-accent/5" : "border-border/70 bg-muted/10",
      )}
    >
      <p className="font-display text-base font-semibold text-foreground">No sections yet</p>
      <p className="mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground">
        Drag a block from the left panel or use <span className="font-semibold text-foreground">Add section</span> below to insert your first
        block.
      </p>
    </div>
  );
}

function CanvasTailDropArea() {
  const { setNodeRef, isOver } = useDroppable({ id: CANVAS_TAIL_ID, data: { kind: "tail" } });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "mt-2 flex min-h-[36px] items-center justify-center rounded-lg border border-dashed text-[11px] font-semibold text-muted-foreground",
        isOver ? "border-accent bg-accent/10 text-accent-foreground" : "border-border/60",
      )}
    >
      Drop here to append to the page
    </div>
  );
}

function SortablePreviewChrome({
  section,
  selected,
  onSelect,
  onToggleVisible,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onRequestDelete,
  children,
}: {
  section: BuilderSection;
  selected: boolean;
  onSelect: () => void;
  onToggleVisible: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onRequestDelete: () => void;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging, isOver } = useSortable({ id: section.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.65 : 1,
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-builder-section={section.id}
      className={cn(
        "mb-4 rounded-2xl border bg-card/30 shadow-sm transition",
        selected ? "border-accent ring-2 ring-accent/35" : "border-border/70",
        isDragging && "scale-[1.01] shadow-lg",
        isOver && !isDragging && "border-accent/70 ring-2 ring-accent/25",
      )}
    >
      <div className="flex flex-wrap items-center gap-2 border-b border-border/60 bg-muted/50 px-2 py-1.5">
        <button
          type="button"
          className="flex cursor-grab touch-none items-center rounded-md px-1 text-muted-foreground hover:text-foreground active:cursor-grabbing"
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{BLOCK_LABELS[section.type]}</span>
        {!section.visible ? <span className="text-[10px] font-semibold uppercase text-amber-600">Hidden</span> : null}
        <div className="ml-auto flex flex-wrap items-center gap-1">
          <Button type="button" size="sm" variant={selected ? "secondary" : "ghost"} className="h-7 px-2 text-[11px]" onClick={onSelect}>
            Select
          </Button>
          <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={onMoveUp} aria-label="Move block up">
            <ArrowUp className="h-3.5 w-3.5" />
          </Button>
          <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={onMoveDown} aria-label="Move block down">
            <ArrowDown className="h-3.5 w-3.5" />
          </Button>
          <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={onToggleVisible} aria-label="Toggle visibility">
            {section.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />}
          </Button>
          <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={onDuplicate} aria-label="Duplicate section">
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button type="button" size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={onRequestDelete} aria-label="Delete section">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

function SectionFields({
  section,
  onChange,
}: {
  section: BuilderSection;
  onChange: (next: BuilderSection) => void;
}) {
  const patch = (props: Record<string, unknown>) => onChange({ ...section, props: { ...section.props, ...props } } as BuilderSection);

  if (section.type === "hero") {
    const p = section.props;
    return (
      <div className="space-y-3">
        <Field label="Eyebrow" helper="Small label above the headline." example="Hope Genesis Enterprises">
          <Input value={p.eyebrow} onChange={(e) => patch({ eyebrow: e.target.value })} placeholder="Hope Genesis Enterprises" />
        </Field>
        <Field label="Title" helper="Main hero headline." example="Professional HVAC Services in Laguna">
          <Input value={p.title} onChange={(e) => patch({ title: e.target.value })} placeholder="Professional HVAC Services in Laguna" />
        </Field>
        <Field label="Subtitle" helper="Supporting line under the title." example="Installation, cleaning, and repair you can trust.">
          <Textarea value={p.subtitle} onChange={(e) => patch({ subtitle: e.target.value })} rows={3} placeholder="Installation, cleaning, and repair you can trust." />
        </Field>
        <Field label="Background image URL" tooltip={FORM_TOOLTIPS.fallbackImage} example="https://example.com/hero.jpg">
          <Input value={p.backgroundImageUrl} onChange={(e) => patch({ backgroundImageUrl: e.target.value })} placeholder="https://example.com/hero.jpg or /images/hero.jpg" />
        </Field>
        <Field label="Overlay opacity (0–1)">
          <Input
            type="number"
            step={0.05}
            min={0}
            max={1}
            value={p.overlayOpacity}
            onChange={(e) => patch({ overlayOpacity: Number.parseFloat(e.target.value) || 0 })}
          />
        </Field>
        <Field label="Text align">
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={p.textAlign}
            onChange={(e) => patch({ textAlign: e.target.value })}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </Field>
      </div>
    );
  }

  if (section.type === "text") {
    const p = section.props;
    return (
      <div className="space-y-3">
        <Field label="Title">
          <Input value={p.title} onChange={(e) => patch({ title: e.target.value })} />
        </Field>
        <Field label="Subtitle">
          <Input value={p.subtitle} onChange={(e) => patch({ subtitle: e.target.value })} />
        </Field>
        <Field label="Body">
          <Textarea value={p.body} onChange={(e) => patch({ body: e.target.value })} rows={8} />
        </Field>
      </div>
    );
  }

  if (section.type === "imageText") {
    const p = section.props;
    return (
      <div className="space-y-3">
        <Field label="Title">
          <Input value={p.title} onChange={(e) => patch({ title: e.target.value })} />
        </Field>
        <Field label="Body">
          <Textarea value={p.body} onChange={(e) => patch({ body: e.target.value })} rows={6} />
        </Field>
        <Field label="Image URL">
          <Input value={p.imageUrl} onChange={(e) => patch({ imageUrl: e.target.value })} />
        </Field>
        <Field label="Image alt">
          <Input value={p.imageAlt} onChange={(e) => patch({ imageAlt: e.target.value })} />
        </Field>
        <Field label="Image position">
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={p.imagePosition}
            onChange={(e) => patch({ imagePosition: e.target.value })}
          >
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </Field>
      </div>
    );
  }

  if (
    section.type === "servicesGrid" ||
    section.type === "projectsGrid" ||
    section.type === "galleryGrid" ||
    section.type === "testimonials" ||
    section.type === "brandsCarousel" ||
    section.type === "blogFeed"
  ) {
    const p = section.props as { eyebrow: string; title: string; description: string };
    return (
      <div className="space-y-3">
        <Field label="Eyebrow">
          <Input value={p.eyebrow} onChange={(e) => patch({ eyebrow: e.target.value })} />
        </Field>
        <Field label="Title">
          <Input value={p.title} onChange={(e) => patch({ title: e.target.value })} />
        </Field>
        <Field label="Description">
          <Textarea value={p.description} onChange={(e) => patch({ description: e.target.value })} rows={4} />
        </Field>
      </div>
    );
  }

  if (section.type === "cta") {
    const p = section.props;
    return (
      <div className="space-y-3">
        <Field label="Title">
          <Input value={p.title} onChange={(e) => patch({ title: e.target.value })} />
        </Field>
        <Field label="Description">
          <Textarea value={p.description} onChange={(e) => patch({ description: e.target.value })} rows={3} />
        </Field>
        <Field label="Primary label">
          <Input value={p.primaryLabel} onChange={(e) => patch({ primaryLabel: e.target.value })} />
        </Field>
        <Field label="Primary URL">
          <Input value={p.primaryHref} onChange={(e) => patch({ primaryHref: e.target.value })} />
        </Field>
        <Field label="Secondary label">
          <Input value={p.secondaryLabel} onChange={(e) => patch({ secondaryLabel: e.target.value })} />
        </Field>
        <Field label="Secondary URL">
          <Input value={p.secondaryHref} onChange={(e) => patch({ secondaryHref: e.target.value })} />
        </Field>
      </div>
    );
  }

  if (section.type === "stats") {
    const p = section.props;
    return (
      <div className="space-y-3">
        <Field label="Eyebrow">
          <Input value={p.eyebrow} onChange={(e) => patch({ eyebrow: e.target.value })} />
        </Field>
        <Field label="Title">
          <Input value={p.title} onChange={(e) => patch({ title: e.target.value })} />
        </Field>
        <Field label="Description">
          <Textarea value={p.description} onChange={(e) => patch({ description: e.target.value })} rows={2} />
        </Field>
        <p className="text-xs font-semibold text-muted-foreground">Stat rows</p>
        {p.items.map((it, idx) => (
          <div key={idx} className="grid grid-cols-3 gap-2">
            <Input
              placeholder="Label"
              value={it.label}
              onChange={(e) => {
                const items = [...p.items];
                items[idx] = { ...items[idx], label: e.target.value };
                patch({ items });
              }}
            />
            <Input
              placeholder="Value"
              value={String(it.value)}
              onChange={(e) => {
                const items = [...p.items];
                items[idx] = { ...items[idx], value: e.target.value };
                patch({ items });
              }}
            />
            <Input
              placeholder="Suffix"
              value={it.suffix ?? ""}
              onChange={(e) => {
                const items = [...p.items];
                items[idx] = { ...items[idx], suffix: e.target.value };
                patch({ items });
              }}
            />
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => patch({ items: [...p.items, { label: "New", value: "0", suffix: "" }] })}
        >
          Add stat
        </Button>
      </div>
    );
  }

  if (section.type === "faq") {
    const p = section.props;
    return (
      <div className="space-y-3">
        <Field label="Title">
          <Input value={p.title} onChange={(e) => patch({ title: e.target.value })} />
        </Field>
        <Field label="Description">
          <Textarea value={p.description} onChange={(e) => patch({ description: e.target.value })} rows={2} />
        </Field>
        {p.items.map((it, idx) => (
          <div key={idx} className="space-y-2 rounded-lg border border-border/60 p-3">
            <Input
              placeholder="Question"
              value={it.q}
              onChange={(e) => {
                const items = [...p.items];
                items[idx] = { ...items[idx], q: e.target.value };
                patch({ items });
              }}
            />
            <Textarea
              placeholder="Answer"
              value={it.a}
              rows={3}
              onChange={(e) => {
                const items = [...p.items];
                items[idx] = { ...items[idx], a: e.target.value };
                patch({ items });
              }}
            />
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => patch({ items: [...p.items, { q: "", a: "" }] })}>
          Add FAQ item
        </Button>
      </div>
    );
  }

  if (section.type === "contact" || section.type === "map") {
    const p = section.props;
    return (
      <div className="space-y-3">
        <Field label="Eyebrow">
          <Input value={p.eyebrow} onChange={(e) => patch({ eyebrow: e.target.value })} />
        </Field>
        <Field label="Title">
          <Input value={p.title} onChange={(e) => patch({ title: e.target.value })} />
        </Field>
        <Field label="Description">
          <Textarea value={p.description} onChange={(e) => patch({ description: e.target.value })} rows={3} />
        </Field>
      </div>
    );
  }

  if (section.type === "buttonGroup") {
    const p = section.props;
    return (
      <div className="space-y-3">
        <Field label="Title">
          <Input value={p.title} onChange={(e) => patch({ title: e.target.value })} />
        </Field>
        <Field label="Description">
          <Textarea value={p.description} onChange={(e) => patch({ description: e.target.value })} rows={2} />
        </Field>
        {p.buttons.map((b, idx) => (
          <div key={idx} className="grid gap-2 sm:grid-cols-2">
            <Input
              placeholder="Label"
              value={b.label}
              onChange={(e) => {
                const buttons = [...p.buttons];
                buttons[idx] = { ...buttons[idx], label: e.target.value };
                patch({ buttons });
              }}
            />
            <Input
              placeholder="URL"
              value={b.href}
              onChange={(e) => {
                const buttons = [...p.buttons];
                buttons[idx] = { ...buttons[idx], href: e.target.value };
                patch({ buttons });
              }}
            />
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => patch({ buttons: [...p.buttons, { label: "Button", href: "/", variant: "outline" }] })}
        >
          Add button
        </Button>
      </div>
    );
  }

  if (section.type === "estimateCTA") {
    const p = section.props;
    return (
      <div className="space-y-3">
        <Field label="Title">
          <Input value={p.title} onChange={(e) => patch({ title: e.target.value })} />
        </Field>
        <Field label="Description">
          <Textarea value={p.description} onChange={(e) => patch({ description: e.target.value })} rows={3} />
        </Field>
        <Field label="Primary label">
          <Input value={p.primaryLabel} onChange={(e) => patch({ primaryLabel: e.target.value })} />
        </Field>
        <Field label="Primary URL">
          <Input value={p.primaryHref} onChange={(e) => patch({ primaryHref: e.target.value })} />
        </Field>
        <Field label="Secondary label">
          <Input value={p.secondaryLabel ?? ""} onChange={(e) => patch({ secondaryLabel: e.target.value })} />
        </Field>
        <Field label="Secondary URL">
          <Input value={p.secondaryHref ?? ""} onChange={(e) => patch({ secondaryHref: e.target.value })} />
        </Field>
      </div>
    );
  }

  if (section.type === "contactCTA") {
    const p = section.props;
    return (
      <div className="space-y-3">
        <Field label="Title">
          <Input value={p.title} onChange={(e) => patch({ title: e.target.value })} />
        </Field>
        <Field label="Description">
          <Textarea value={p.description} onChange={(e) => patch({ description: e.target.value })} rows={3} />
        </Field>
        <Field label="Primary label">
          <Input value={p.primaryLabel} onChange={(e) => patch({ primaryLabel: e.target.value })} />
        </Field>
        <Field label="Primary URL">
          <Input value={p.primaryHref} onChange={(e) => patch({ primaryHref: e.target.value })} />
        </Field>
        <Field label="Phone">
          <Input value={p.phone ?? ""} onChange={(e) => patch({ phone: e.target.value })} />
        </Field>
      </div>
    );
  }

  if (section.type === "richText") {
    const p = section.props;
    return (
      <div className="space-y-3">
        <Field label="Title">
          <Input value={p.title} onChange={(e) => patch({ title: e.target.value })} />
        </Field>
        <Field label="Body">
          <Textarea value={p.body} onChange={(e) => patch({ body: e.target.value })} rows={10} />
        </Field>
      </div>
    );
  }

  if (section.type === "seoMeta") {
    const p = section.props;
    return (
      <div className="space-y-3">
        <Field label="Page title" tooltip={FORM_TOOLTIPS.seoTitle} example={SEO_GUIDANCE.metaTitle.placeholder}>
          <Input value={p.pageTitle} onChange={(e) => patch({ pageTitle: e.target.value })} placeholder={SEO_GUIDANCE.metaTitle.placeholder} />
        </Field>
        <Field label="Meta description" tooltip={FORM_TOOLTIPS.seoDescription} example={SEO_GUIDANCE.metaDescription.placeholder}>
          <Textarea value={p.metaDescription} onChange={(e) => patch({ metaDescription: e.target.value })} rows={3} placeholder={SEO_GUIDANCE.metaDescription.placeholder} />
        </Field>
        <Field label="Keywords" helper="Comma-separated terms for search engines." example="hvac, aircon, laguna">
          <Input value={p.keywords} onChange={(e) => patch({ keywords: e.target.value })} placeholder="hvac, aircon cleaning, laguna" />
        </Field>
        <Field label="OG image URL" tooltip={FORM_TOOLTIPS.fallbackImage} example="https://example.com/og-image.jpg">
          <Input value={p.ogImage} onChange={(e) => patch({ ogImage: e.target.value })} placeholder="https://example.com/og-image.jpg" />
        </Field>
      </div>
    );
  }

  if (section.type === "spacer") {
    const p = section.props;
    return (
      <Field label="Height">
        <select
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          value={p.height}
          onChange={(e) => patch({ height: e.target.value })}
        >
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
          <option value="xl">Extra large</option>
        </select>
      </Field>
    );
  }

  return (
    <p className="text-sm text-muted-foreground">
      Use Advanced developer mode for full JSON control of this {BLOCK_LABELS[section.type]} block.
    </p>
  );
}

function Field({
  label,
  children,
  helper,
  tooltip,
  example,
  placeholder,
}: {
  label: string;
  children: React.ReactNode;
  helper?: string;
  tooltip?: string;
  example?: string;
  placeholder?: string;
}) {
  const child = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
        placeholder: placeholder ?? (children as React.ReactElement<{ placeholder?: string }>).props.placeholder,
      })
    : children;

  return (
    <AdminFormField id={`pb-${label.replace(/\s+/g, "-").toLowerCase()}`} label={label} helper={helper} tooltip={tooltip} example={example}>
      {child}
    </AdminFormField>
  );
}

export function PageBuilderEditor({
  pageKey,
  publishedData,
  draftData,
  previewCtx,
  showDeveloperMode = false,
}: {
  pageKey: CmsPageKey;
  publishedData: string;
  draftData: string | null;
  previewCtx: PageBuilderPreviewContext;
  showDeveloperMode?: boolean;
}) {
  const router = useRouter();
  const previewScrollRef = React.useRef<HTMLDivElement | null>(null);
  const [doc, setDoc] = React.useState<PageBuilderDocument>(() =>
    createInitialDocument(pageKey, publishedData, draftData),
  );
  const [baselineJson, setBaselineJson] = React.useState<string>(() =>
    canonicalDocJson(createInitialDocument(pageKey, publishedData, draftData)),
  );
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);
  const [ribbon, setRibbon] = React.useState<"idle" | "draft_saved" | "published_live" | "failed" | "reverted">("idle");
  const [activeLibraryDrag, setActiveLibraryDrag] = React.useState<BuilderBlockType | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [resetConfirmOpen, setResetConfirmOpen] = React.useState(false);
  const [viewport, setViewport] = React.useState<"desktop" | "tablet" | "mobile">("desktop");
  const [previewTheme, setPreviewTheme] = React.useState<"light" | "dark">("light");
  const [addType, setAddType] = React.useState<BuilderBlockType>("hero");
  const [blockSearch, setBlockSearch] = React.useState("");
  const [publishConfirmOpen, setPublishConfirmOpen] = React.useState(false);
  const publishedBlockCountRef = React.useRef(
    tryParsePageBuilderJson(publishedData)?.sections.length ?? 0,
  );

  const filteredCatalog = React.useMemo(() => {
    const q = blockSearch.trim().toLowerCase();
    if (!q) return BLOCK_CATALOG;
    return BLOCK_CATALOG.filter(
      (e) =>
        e.label.toLowerCase().includes(q) ||
        e.blurb.toLowerCase().includes(q) ||
        e.type.toLowerCase().includes(q) ||
        BLOCK_CATEGORY_LABELS[e.category].toLowerCase().includes(q),
    );
  }, [blockSearch]);

  const catalogByCategory = React.useMemo(() => {
    const map = new Map<BlockCategory, typeof BLOCK_CATALOG>();
    for (const entry of filteredCatalog) {
      const list = map.get(entry.category) ?? [];
      list.push(entry);
      map.set(entry.category, list);
    }
    return map;
  }, [filteredCatalog]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const selected = doc.sections.find((s) => s.id === selectedId) ?? null;

  const dirty = canonicalDocJson(doc) !== baselineJson;

  React.useEffect(() => {
    if (dirty && (ribbon === "draft_saved" || ribbon === "published_live")) setRibbon("idle");
  }, [dirty, ribbon]);

  React.useEffect(() => {
    if (!selectedId) return;
    const node = previewScrollRef.current?.querySelector<HTMLElement>(`[data-builder-section="${selectedId}"]`);
    node?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedId, doc.sections]);

  const isHome = pageKey === CMS_PAGE_KEYS.home;

  const docRef = React.useRef(doc);
  docRef.current = doc;

  function persistDoc(updater: PageBuilderDocument | ((prev: PageBuilderDocument) => PageBuilderDocument)) {
    setDoc((prev) => {
      const resolved = typeof updater === "function" ? updater(prev) : updater;
      return { ...resolved, sections: normalizeSectionOrders(resolved.sections) };
    });
  }

  function handleDragStart(e: DragStartEvent) {
    const data = e.active.data.current as { kind?: string; blockType?: BuilderBlockType } | undefined;
    if (data?.kind === "library" && data.blockType) {
      setActiveLibraryDrag(data.blockType);
    }
  }

  function handleDragEnd(e: DragEndEvent) {
    setActiveLibraryDrag(null);
    const { active, over } = e;

    const activeData = active.data.current as { kind?: string; blockType?: BuilderBlockType } | undefined;

    if (activeData?.kind === "library" && activeData.blockType) {
      if (!over) return;
      const type = activeData.blockType;
      const newId = newSectionId();
      const inserted: BuilderSection = {
        id: newId,
        type,
        visible: true,
        order: 0,
        props: defaultPropsForBlockType(type),
      } as BuilderSection;

      persistDoc((prev) => {
        const list = [...prev.sections];
        const target = String(over.id);
        let insertIdx = list.length;

        if (target === CANVAS_TAIL_ID || target === CANVAS_EMPTY_ID) {
          insertIdx = list.length;
        } else {
          const hit = list.findIndex((section) => section.id === target);
          if (hit >= 0) insertIdx = hit;
        }

        list.splice(insertIdx, 0, inserted);
        return { v: 2, sections: normalizeSectionOrders(list) };
      });

      setSelectedId(newId);
      return;
    }

    if (!over || active.id === over.id) return;

    const overStr = String(over.id);
    const sectionIds = docRef.current.sections.map((s) => s.id);

    if (overStr === CANVAS_TAIL_ID) {
      persistDoc((d) => {
        const idx = d.sections.findIndex((s) => s.id === active.id);
        if (idx < 0) return d;
        return {
          v: 2,
          sections: normalizeSectionOrders(arrayMove(d.sections, idx, d.sections.length - 1)),
        };
      });
      return;
    }

    if (!sectionIds.includes(overStr)) return;

    persistDoc((d) => {
      const oldIndex = d.sections.findIndex((s) => s.id === active.id);
      const newIndex = d.sections.findIndex((s) => s.id === over.id);
      if (oldIndex < 0 || newIndex < 0) return d;
      return { v: 2, sections: normalizeSectionOrders(arrayMove(d.sections, oldIndex, newIndex)) };
    });
  }

  function insertSectionQuick(type: BuilderBlockType, select = true) {
    const id = newSectionId();
    persistDoc((prev) => {
      const next: BuilderSection = {
        id,
        type,
        visible: true,
        order: prev.sections.length,
        props: defaultPropsForBlockType(type),
      } as BuilderSection;
      return { v: 2, sections: [...prev.sections, next] };
    });
    if (select) setSelectedId(id);
  }

  async function saveDraft() {
    if (DEBUG_PAGE_BUILDER) console.log("Save button clicked");
    setPending(true);
    try {
      const builderState = docRef.current;
      const activeSection = selectedId ? builderState.sections.find((s) => s.id === selectedId) ?? null : null;
      if (DEBUG_PAGE_BUILDER || (HOME_BUILDER_DEV_AUDIT && isHome)) {
        console.log("pageKey:", pageKey);
        console.log("sections before save:", builderState.sections);
        console.log("active section:", activeSection);
      }

      let validatedSections: BuilderSection[];
      try {
        validatedSections = validateBlocksForSave(builderState.sections, {
          confirmedReset: isHome && builderState.sections.length === 0,
        });
      } catch (e) {
        setRibbon("failed");
        toast.error(e instanceof CmsBlocksValidationError ? e.message : "Invalid CMS blocks");
        return;
      }
      const normalized: PageBuilderDocument = { v: 2, sections: validatedSections };
      const r = validatePageBuilderDocument(normalized);
      if (!r.success) {
        setRibbon("failed");
        toast.error(r.error.issues[0]?.message ?? "Validation failed — fix fields before saving");
        return;
      }
      const json = JSON.stringify(r.data);
      const payload = { pageKey, publishedData, draftData: json, status: "DRAFT" as const };
      if (DEBUG_PAGE_BUILDER || (HOME_BUILDER_DEV_AUDIT && isHome)) {
        console.log("payload being saved:", payload);
      }

      const res = await upsertPageContentAction(payload);
      if (!res.ok) {
        setRibbon("failed");
        toast.error(isHome ? "Failed to save homepage. Existing live page was not changed." : (res.error ?? "Failed to save changes"));
        return;
      }
      setBaselineJson(canonicalDocJson(r.data));
      setRibbon("draft_saved");
      toast.success(isHome ? "Homepage draft saved successfully." : "Draft saved successfully");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  async function publish(confirmedLargeRemoval = false) {
    if (DEBUG_PAGE_BUILDER) console.log("Publish button clicked");
    const builderState = docRef.current;
    const priorCount = publishedBlockCountRef.current;
    if (
      !confirmedLargeRemoval &&
      priorCount > 2 &&
      builderState.sections.length < priorCount - 2
    ) {
      setPublishConfirmOpen(true);
      return;
    }
    setPending(true);
    try {
      if (DEBUG_PAGE_BUILDER || (HOME_BUILDER_DEV_AUDIT && isHome)) {
        console.log("pageKey:", pageKey);
        console.log("sections before publish:", builderState.sections);
        console.log("active section:", selectedId ? builderState.sections.find((s) => s.id === selectedId) : null);
      }

      let validatedSections: BuilderSection[];
      try {
        validatedSections = validateBlocksForSave(builderState.sections, {
          confirmedReset: isHome && builderState.sections.length === 0,
        });
      } catch (e) {
        setRibbon("failed");
        toast.error(e instanceof CmsBlocksValidationError ? e.message : "Invalid CMS blocks");
        return;
      }
      const normalized: PageBuilderDocument = { v: 2, sections: validatedSections };
      const r = validatePageBuilderDocument(normalized);
      if (!r.success) {
        setRibbon("failed");
        toast.error(r.error.issues[0]?.message ?? "Validation failed — fix fields before publishing");
        return;
      }

      if (!isHome && r.data.sections.length === 0) {
        setRibbon("failed");
        toast.error("Cannot publish — add at least one section.");
        return;
      }

      let publishedPayload: string;
      try {
        if (isHome) {
          publishedPayload = mergeHomePublishedJsonWithOverlay(publishedData, r.data);
        } else {
          publishedPayload = JSON.stringify(r.data);
        }
      } catch (e) {
        setRibbon("failed");
        toast.error(e instanceof Error ? e.message : "Failed to prepare homepage publish payload");
        return;
      }

      const json = JSON.stringify(r.data);
      const payload = { pageKey, publishedData: publishedPayload, draftData: json, status: "PUBLISHED" as const };
      if (DEBUG_PAGE_BUILDER || (HOME_BUILDER_DEV_AUDIT && isHome)) {
        console.log("payload being published:", payload);
      }

      const res = await upsertPageContentAction(payload);
      if (!res.ok) {
        setRibbon("failed");
        toast.error(isHome ? "Failed to publish homepage. Existing live page was not changed." : (res.error ?? "Failed to publish changes"));
        return;
      }
      setBaselineJson(canonicalDocJson(r.data));
      publishedBlockCountRef.current = r.data.sections.length;
      setRibbon("published_live");
      toast.success(
        isHome
          ? r.data.sections.length === 0
            ? "Published — homepage builder blocks removed from the live site."
            : "Homepage published — legacy layout is preserved and builder sections are live."
          : "Published to live — changes are live on the site",
      );
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  function revertPublished() {
    const parsed = tryParsePageBuilderJson(publishedData);
    const nextDoc = parsed
      ? ({ v: 2 as const, sections: normalizeSectionsFromStorage(parsed.sections) } satisfies PageBuilderDocument)
      : getDefaultPageBuilderDocument(pageKey);
    persistDoc(nextDoc);
    setBaselineJson(canonicalDocJson(nextDoc));
    setRibbon("idle");
    setSelectedId(null);
    setRibbon("reverted");
    toast.message("Reverted to published");
  }

  function resetDefault() {
    if (isHome) {
      setResetConfirmOpen(true);
      return;
    }
    persistDoc(getDefaultPageBuilderDocument(pageKey));
    toast.message("Reset to default template");
  }

  function applyResetDefault() {
    persistDoc(getDefaultPageBuilderDocument(pageKey));
    setResetConfirmOpen(false);
    toast.message("Reset to default template");
  }

  const previewWidth =
    viewport === "mobile" ? "max-w-[390px]" : viewport === "tablet" ? "max-w-[768px]" : "max-w-full";

  const statusRibbonText = pending
    ? ribbon === "published_live"
      ? "Publishing..."
      : "Saving..."
    : dirty
      ? "Unsaved changes"
      : ribbon === "failed"
        ? "Save failed"
        : ribbon === "draft_saved"
          ? "Draft saved"
          : ribbon === "published_live"
            ? "Published live"
            : ribbon === "reverted"
              ? "Reverted to published"
              : "Synced";

  const editingLabel = selected ? `Currently editing: ${BLOCK_LABELS[selected.type]}` : "Currently editing: —";

  const sortableSectionIds = doc.sections.map((s) => s.id);
  const sortableSectionIdsRef = React.useRef(sortableSectionIds);
  sortableSectionIdsRef.current = sortableSectionIds;

  const collisionDetection = React.useCallback<CollisionDetection>((args) => {
    const activeId = String(args.active.id);
    if (activeId.startsWith("library:")) {
      return closestCenter(args);
    }
    const sectionIds = new Set(sortableSectionIdsRef.current);
    const filtered = {
      ...args,
      droppableContainers: args.droppableContainers.filter((container) => {
        const id = String(container.id);
        return sectionIds.has(id) || id === CANVAS_TAIL_ID || id === CANVAS_EMPTY_ID;
      }),
    };
    return closestCenter(filtered);
  }, []);

  const statusRibbonClass =
    pending
      ? "border-sky-500/40 bg-sky-500/12 text-sky-900 dark:text-sky-100"
      : dirty
        ? "border-amber-400/35 bg-amber-500/10 text-amber-950 dark:text-amber-100"
        : ribbon === "failed"
          ? "border-destructive/40 bg-destructive/10 text-destructive"
          : ribbon === "draft_saved"
            ? "border-emerald-500/40 bg-emerald-500/12 text-emerald-900 dark:text-emerald-100"
            : ribbon === "published_live"
              ? "border-accent/35 bg-accent/12 text-accent-foreground"
              : "border-border bg-muted/50 text-muted-foreground";

  return (
    <DndContext sensors={sensors} collisionDetection={collisionDetection} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="space-y-4">
        <AdminCard className="p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-lg font-semibold">Visual builder studio</h2>
                <span className={cn("rounded-full border px-3 py-0.5 text-[11px] font-semibold", statusRibbonClass)}>
                  {statusRibbonText}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {!pending && dirty ? (
                  <>
                    Draft has not reached the CMS yet — press <strong>Save draft</strong> frequently.
                  </>
                ) : null}
                {!dirty && ribbon === "draft_saved" ? <>Safe copy stored as draft JSON — publishers still need to push live.</> : null}
                {!dirty && ribbon === "published_live" ? <>Latest builder JSON is synced with visitors on the targeted marketing route.</> : null}
              </p>
              <p className="text-sm font-semibold text-foreground">{editingLabel}</p>
              {isHome ? (
                <p className="max-w-3xl text-xs text-muted-foreground">
                  Homepage builder blocks stitch <strong>after</strong> the legacy hero + services rails. Saving never deletes that core marketing
                  stack — it only swaps the supplemental JSON appended to{" "}
                  <code className="rounded-md bg-muted px-1 py-0.5 text-[11px]">home</code> content.
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" disabled={pending} onClick={() => void saveDraft()}>
                Save draft
              </Button>
              <Button type="button" variant="secondary" size="sm" disabled={pending} onClick={() => void publish()}>
                Publish draft → live
              </Button>
              <Button type="button" variant="ghost" size="sm" disabled={pending} onClick={revertPublished}>
                Revert to published
              </Button>
              <Button type="button" variant="ghost" size="sm" disabled={pending} onClick={resetDefault}>
                Reset to default
              </Button>
            </div>
          </div>
        </AdminCard>

        <div className="grid gap-6 xl:grid-cols-[minmax(260px,0.35fr)_minmax(0,1fr)_minmax(300px,0.42fr)]">
          <aside className="xl:sticky xl:top-4 xl:h-fit">
            <AdminCard className="p-4">
              <h3 className="font-display text-sm font-semibold">Block library</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Drag blocks into the canvas or use Quick add.</p>
              <div className="relative mt-3">
                <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={blockSearch}
                  onChange={(e) => setBlockSearch(e.target.value)}
                  placeholder="Search blocks…"
                  className="h-9 rounded-lg pl-8 text-sm"
                />
              </div>
              <div className="mt-4 max-h-[min(52vh,480px)] space-y-4 overflow-y-auto border-t border-border/60 pt-4">
                {([...catalogByCategory.entries()] as [BlockCategory, typeof BLOCK_CATALOG][]).map(([cat, entries]) =>
                  entries.length ? (
                    <div key={cat}>
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {BLOCK_CATEGORY_LABELS[cat]}
                      </p>
                      {entries.map((entry) => (
                        <LibraryDraggableRow key={entry.type} entry={entry} />
                      ))}
                    </div>
                  ) : null,
                )}
              </div>
              <div className="mt-6 space-y-2 border-t border-border/60 pt-4">
                <Label className="text-xs font-semibold">Quick add section</Label>
                <select
                  className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                  value={addType}
                  onChange={(e) => setAddType(e.target.value as BuilderBlockType)}
                >
                  {BUILDER_BLOCK_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {BLOCK_LABELS[t]}
                    </option>
                  ))}
                </select>
                <Button type="button" size="sm" className="w-full" variant="outline" onClick={() => insertSectionQuick(addType)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add selected block
                </Button>
              </div>
            </AdminCard>
          </aside>

          <div ref={previewScrollRef} className="min-h-[520px] min-w-0 space-y-3">
            <AdminCard className="p-4">
              <div className="flex flex-wrap items-center gap-2">
                <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-semibold">Live preview</p>
                  <p className="text-[11px] text-muted-foreground">Drag blocks onto the dashed targets or reorder using the grips.</p>
                </div>
                <div className="ml-auto flex flex-wrap gap-1">
                  <Button type="button" size="sm" variant={viewport === "desktop" ? "secondary" : "ghost"} onClick={() => setViewport("desktop")}>
                    <Monitor className="h-4 w-4" />
                  </Button>
                  <Button type="button" size="sm" variant={viewport === "tablet" ? "secondary" : "ghost"} onClick={() => setViewport("tablet")}>
                    <Tablet className="h-4 w-4" />
                  </Button>
                  <Button type="button" size="sm" variant={viewport === "mobile" ? "secondary" : "ghost"} onClick={() => setViewport("mobile")}>
                    <Smartphone className="h-4 w-4" />
                  </Button>
                  <Button type="button" size="sm" variant={previewTheme === "light" ? "secondary" : "ghost"} onClick={() => setPreviewTheme("light")}>
                    <Sun className="h-4 w-4" />
                  </Button>
                  <Button type="button" size="sm" variant={previewTheme === "dark" ? "secondary" : "ghost"} onClick={() => setPreviewTheme("dark")}>
                    <Moon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <SortableContext items={sortableSectionIds} strategy={verticalListSortingStrategy}>
                <div className={cn("mx-auto mt-4 overflow-x-clip overflow-y-visible rounded-2xl border border-border bg-background", previewWidth)}>
                  <div className={cn("origin-top scale-100", previewTheme === "dark" ? "dark" : "")}>
                    {isHome ? (
                      <p className="border-b border-border/60 bg-muted/40 px-3 py-2 text-[11px] text-muted-foreground">
                        Preview shows builder-only blocks. The flagship homepage still renders the hero + rails above whatever you compose here.
                      </p>
                    ) : null}
                    <CmsCanvasPreview
                      blocks={doc.sections}
                      ctx={previewCtx}
                      selectedBlockId={selectedId}
                      previewTheme={previewTheme}
                      emptyPlaceholder={<EmptyCanvasDropArea />}
                      adminPreview={{
                        wrapSection: ({ section, node }) => (
                          <SortablePreviewChrome
                            section={section}
                            selected={selectedId === section.id}
                            onSelect={() => setSelectedId(section.id)}
                            onToggleVisible={() =>
                              persistDoc((prev) => ({
                                v: 2,
                                sections: prev.sections.map((x) => (x.id === section.id ? { ...x, visible: !x.visible } : x)),
                              }))
                            }
                            onMoveUp={() => {
                              const idx = docRef.current.sections.findIndex((s) => s.id === section.id);
                              if (idx <= 0) return;
                              persistDoc((prev) => ({
                                v: 2,
                                sections: normalizeSectionOrders(arrayMove(prev.sections, idx, idx - 1)),
                              }));
                            }}
                            onMoveDown={() => {
                              const idx = docRef.current.sections.findIndex((s) => s.id === section.id);
                              if (idx < 0 || idx >= docRef.current.sections.length - 1) return;
                              persistDoc((prev) => ({
                                v: 2,
                                sections: normalizeSectionOrders(arrayMove(prev.sections, idx, idx + 1)),
                              }));
                            }}
                            onDuplicate={() => {
                              const newId = newSectionId();
                              const clone = structuredClone(section) as BuilderSection;
                              clone.id = newId;
                              persistDoc((prev) => ({
                                v: 2,
                                sections: normalizeSectionOrders([...prev.sections, clone]),
                              }));
                              setSelectedId(newId);
                            }}
                            onRequestDelete={() => setDeleteId(section.id)}
                          >
                            {node}
                          </SortablePreviewChrome>
                        ),
                      }}
                    />
                    <CanvasTailDropArea />
                  </div>
                </div>
              </SortableContext>
            </AdminCard>
          </div>

          <aside className="min-h-[520px] w-full xl:sticky xl:top-4">
            <AdminCard className="h-full p-4">
              <div className="sticky top-0 max-h-[calc(100vh-6rem)] space-y-3 overflow-y-auto">
                <h3 className="font-display text-sm font-semibold">Section settings</h3>
                {selected ? (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground">
                      Updating these fields pushes straight into the centered preview canvas.
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2">
                      <Checkbox
                        id="vis-studio"
                        checked={selected.visible}
                        onCheckedChange={(c) =>
                          persistDoc((prev) => ({
                            v: 2,
                            sections: prev.sections.map((x) => (x.id === selected.id ? { ...x, visible: Boolean(c) } : x)),
                          }))
                        }
                      />
                      <Label htmlFor="vis-studio" className="text-sm">
                        Visible on page
                      </Label>
                    </div>
                    <SectionFields
                      section={selected}
                      onChange={(next) =>
                        persistDoc((prev) => ({
                          v: 2,
                          sections: prev.sections.map((x) => (x.id === next.id ? next : x)),
                        }))
                      }
                    />
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 p-4 text-sm text-muted-foreground">
                    Select a preview block via <strong>Select</strong> in the toolbar to surface its typography, imagery, CTAs, and visibility
                    knobs here.
                  </div>
                )}
              </div>
            </AdminCard>
          </aside>
        </div>

        <DeveloperJsonPanel
          json={JSON.stringify(doc, null, 2)}
          defaultOpen={showDeveloperMode}
          onApply={(raw) => {
            const parsed = safeJsonParse<PageBuilderDocument | null>(raw, null);
            if (!parsed) {
              toast.error("Invalid JSON");
              return;
            }
            const r = validatePageBuilderDocument(parsed);
            if (!r.success) {
              toast.error(r.error.issues[0]?.message ?? "Invalid page JSON");
              return;
            }
            persistDoc(r.data);
            toast.message("Applied JSON to canvas");
          }}
        />
      </div>

      <DragOverlay dropAnimation={{ duration: 180, easing: "ease-out" }}>
        {activeLibraryDrag ? (
          <div className="w-[280px] rounded-xl border bg-card p-3 shadow-2xl">
            <p className="text-sm font-semibold">{BLOCK_LABELS[activeLibraryDrag]}</p>
            <p className="mt-1 text-xs text-muted-foreground">Dragging from library…</p>
          </div>
        ) : null}
      </DragOverlay>

      <AlertDialog open={resetConfirmOpen} onOpenChange={setResetConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset homepage builder sections?</AlertDialogTitle>
            <AlertDialogDescription>
              This replaces every builder block with the default template in the editor only until you save. Your published marketing homepage
              (hero, services, etc.) is not removed — save draft or publish to update stored builder JSON.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={applyResetDefault}>Reset builder template</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={publishConfirmOpen} onOpenChange={setPublishConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish with fewer blocks?</AlertDialogTitle>
            <AlertDialogDescription>
              You are publishing significantly fewer blocks than the last live version. Confirm to replace the public page content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setPublishConfirmOpen(false);
                void publish(true);
              }}
            >
              Publish anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={Boolean(deleteId)} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this section?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone in one click — keep JSON backups handy if experimenting.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (!deleteId) return;
                persistDoc((prev) => ({ v: 2, sections: prev.sections.filter((x) => x.id !== deleteId) }));
                setSelectedId(null);
                setDeleteId(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DndContext>
  );
}

