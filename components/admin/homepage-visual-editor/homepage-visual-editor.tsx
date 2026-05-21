"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ExternalLink, Monitor, Moon, Smartphone, Sun, Tablet } from "lucide-react";
import {
  DEFAULT_HOME_PAGE_PUBLISHED,
  type HomePagePublishedV1,
} from "@/lib/cms/marketing-cms-defaults";
import {
  serializeSiteLayoutPayload,
  type HomeLegacySectionId,
} from "@/lib/cms/homepage-sections";
import type { HomepageCanvasSectionId, HomepageEditorState } from "@/lib/cms/homepage-visual-editor/types";
import {
  canonicalEditorStateJson,
  resetEditorToDefaults,
  serializeHomepageEditorDraft,
  serializeHomePublishedPreservingOverlay,
} from "@/lib/cms/homepage-visual-editor/draft";
import { HOMEPAGE_BLOCK_BY_ID } from "@/lib/cms/homepage-visual-editor/registry";
import { validateHomepageForDraft, validateHomepageForPublish } from "@/lib/cms/homepage-visual-editor/validation";
import type { PublicMarketingCmsBundle } from "@/lib/cms/merge-public-marketing-cms";
import type { PageBuilderPreviewContext } from "@/lib/cms/page-builder/preview-data";
import { upsertPageContentAction, upsertSiteSettingsCmsAction } from "@/lib/actions/cms-site";
import { CMS_PAGE_KEYS } from "@/lib/domain/cms/page-keys";
import { HomepageContentSubnav } from "@/components/admin/cms/homepage-content-subnav";
import { HomepageVisualPreview } from "@/components/admin/homepage-visual-editor/homepage-visual-preview";
import { HomepageSectionDrawer } from "@/components/admin/homepage-visual-editor/homepage-section-drawer";
import { HomepageSortableRail } from "@/components/admin/homepage-visual-editor/homepage-sortable-rail";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { Button } from "@/components/ui/button";
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

type Props = {
  publishedHomeJson: string;
  homeRowUpdatedAt: string | null;
  initialState: HomepageEditorState;
  publishedBaseline: HomepageEditorState;
  baseCms: PublicMarketingCmsBundle;
  previewCtx: PageBuilderPreviewContext;
  canEdit: boolean;
};

function formatWhen(iso: string | null) {
  if (!iso) return "Never saved";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function HomepageVisualEditor({
  publishedHomeJson,
  homeRowUpdatedAt,
  initialState,
  publishedBaseline,
  baseCms,
  previewCtx,
  canEdit,
}: Props) {
  const router = useRouter();
  const [state, setState] = React.useState(initialState);
  const [baseline, setBaseline] = React.useState(() => canonicalEditorStateJson(initialState));
  const [selectedId, setSelectedId] = React.useState<HomepageCanvasSectionId | null>("hero");
  const [pending, setPending] = React.useState(false);
  const [lastSavedAt, setLastSavedAt] = React.useState<string | null>(homeRowUpdatedAt);
  const [viewport, setViewport] = React.useState<"desktop" | "tablet" | "mobile">("desktop");
  const [previewTheme, setPreviewTheme] = React.useState<"light" | "dark">("light");
  const [validationErrors, setValidationErrors] = React.useState<{ path: string; message: string }[]>([]);
  const [leaveOpen, setLeaveOpen] = React.useState(false);
  const [publishOpen, setPublishOpen] = React.useState(false);
  const pendingNavRef = React.useRef<string | null>(null);

  const dirty = canonicalEditorStateJson(state) !== baseline;

  React.useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  function moveSection(id: HomeLegacySectionId, dir: -1 | 1) {
    setState((prev) => {
      const i = prev.order.indexOf(id);
      if (i < 0) return prev;
      const j = i + dir;
      if (j < 0 || j >= prev.order.length) return prev;
      const order = [...prev.order];
      [order[i], order[j]] = [order[j]!, order[i]!];
      return { ...prev, order };
    });
  }

  function toggleVisible(id: HomeLegacySectionId) {
    const key = HOMEPAGE_BLOCK_BY_ID[id].visibilityKey;
    if (!key) return;
    setState((prev) => ({
      ...prev,
      visibility: { ...prev.visibility, [key]: !prev.visibility[key] },
    }));
  }

  function resetSection(id: HomepageCanvasSectionId) {
    const defaults = DEFAULT_HOME_PAGE_PUBLISHED;
    setState((prev) => {
      if (id === "hero") {
        return { ...prev, home: { ...prev.home, hero: structuredClone(defaults.hero) } };
      }
      const block = HOMEPAGE_BLOCK_BY_ID[id];
      if (id === "aboutPreview") {
        return { ...prev, home: { ...prev.home, aboutPreview: structuredClone(defaults.aboutPreview) } };
      }
      if (id === "customerPlatformStrip") {
        return { ...prev, home: { ...prev.home, customerPlatform: structuredClone(defaults.customerPlatform) } };
      }
      if (id === "contactCta") {
        return { ...prev, home: { ...prev.home, contactCta: structuredClone(defaults.contactCta) } };
      }
      const shellKey = block.fields[0]?.path.split(".")[0];
      if (shellKey === "homeSectionShells") {
        const shellName = block.fields[0]?.path.split(".")[1] as keyof HomePagePublishedV1["homeSectionShells"];
        if (shellName) {
          return {
            ...prev,
            home: {
              ...prev.home,
              homeSectionShells: {
                ...prev.home.homeSectionShells,
                [shellName]: structuredClone(defaults.homeSectionShells[shellName]),
              },
            },
          };
        }
      }
      return prev;
    });
    toast.message(`${HOMEPAGE_BLOCK_BY_ID[id].label} reset to defaults`);
  }

  function deleteSection(id: HomeLegacySectionId) {
    const block = HOMEPAGE_BLOCK_BY_ID[id];
    if (block.required) {
      toast.error("This section is required on the homepage.");
      return;
    }
    setState((prev) => ({
      ...prev,
      order: prev.order.filter((s) => s !== id),
      visibility: block.visibilityKey
        ? { ...prev.visibility, [block.visibilityKey]: false }
        : prev.visibility,
    }));
    if (selectedId === id) setSelectedId("hero");
  }

  async function saveDraft() {
    if (!canEdit) return;
    const draftCheck = validateHomepageForDraft(state);
    if (!draftCheck.ok) {
      toast.error("Draft could not be saved â€” fix errors first.");
      return;
    }
    setPending(true);
    const draftJson = serializeHomepageEditorDraft(state);
    const res = await upsertPageContentAction({
      pageKey: CMS_PAGE_KEYS.home,
      publishedData: publishedHomeJson,
      draftData: draftJson,
      status: "DRAFT",
    });
    setPending(false);
    if (!res.ok) {
      toast.error(res.error ?? "Failed to save draft");
      return;
    }
    setBaseline(canonicalEditorStateJson(state));
    setLastSavedAt(new Date().toISOString());
    toast.success("Homepage draft saved");
    router.refresh();
  }

  async function publishLive() {
    if (!canEdit) return;
    const check = validateHomepageForPublish(state);
    if (!check.ok) {
      setValidationErrors(check.errors);
      toast.error("Fix validation errors before publishing");
      return;
    }
    setValidationErrors([]);
    setPending(true);
    const publishedHome = serializeHomePublishedPreservingOverlay(publishedHomeJson, state.home);
    const layoutJson = serializeSiteLayoutPayload(state.visibility, state.order);
    const [pageRes, siteRes] = await Promise.all([
      upsertPageContentAction({
        pageKey: CMS_PAGE_KEYS.home,
        publishedData: publishedHome,
        draftData: serializeHomepageEditorDraft(state),
        status: "PUBLISHED",
      }),
      upsertSiteSettingsCmsAction({
        sectionVisibilityJson: layoutJson,
        floatingActionsJson: JSON.stringify(baseCms.floating, null, 2),
      }),
    ]);
    setPending(false);
    if (!pageRes.ok || !siteRes.ok) {
      const err = !pageRes.ok && "error" in pageRes ? pageRes.error : !siteRes.ok && "error" in siteRes ? siteRes.error : "Publish failed";
      toast.error(err);
      return;
    }
    setBaseline(canonicalEditorStateJson(state));
    setLastSavedAt(new Date().toISOString());
    toast.success("Homepage published â€” changes are live");
    router.refresh();
  }

  function revertPublished() {
    setState(structuredClone(publishedBaseline));
    setBaseline(canonicalEditorStateJson(publishedBaseline));
    toast.message("Reverted to last published version");
  }

  function resetAll() {
    const next = resetEditorToDefaults();
    setState(next);
    toast.message("Reset to defaults â€” save draft or publish to apply");
  }

  const statusLabel = pending
    ? "Savingâ€¦"
    : dirty
      ? "Unsaved changes"
      : "Synced";

  return (
    <div className="space-y-6">
      <HomepageContentSubnav active="visual" />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">Homepage visual editor</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Click sections to edit copy, drag to reorder, preview on desktop/tablet/mobile, then save draft or publish live.
            Legacy forms remain under{" "}
            <Link href="/admin/content/homepage/hero" className="font-medium text-sky-600 hover:underline">
              Hero settings
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" disabled={!canEdit || pending} onClick={() => void saveDraft()}>
            Save draft
          </Button>
          <Button type="button" size="sm" disabled={!canEdit || pending} onClick={() => setPublishOpen(true)}>
            Publish â†’ live
          </Button>
          <Button type="button" variant="ghost" size="sm" disabled={pending} onClick={revertPublished}>
            Revert
          </Button>
          <Button type="button" variant="ghost" size="sm" disabled={pending} onClick={resetAll}>
            Reset defaults
          </Button>
          <Button type="button" variant="outline" size="sm" asChild>
            <Link href="/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-1.5 h-4 w-4" />
              Open live site
            </Link>
          </Button>
        </div>
      </div>

      <AdminCard className="flex flex-wrap items-center justify-between gap-3 border-sky-200/50 bg-gradient-to-r from-sky-50/80 to-white p-4 dark:from-sky-950/20 dark:to-background">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={cn(
              "rounded-full border px-3 py-0.5 text-[11px] font-semibold",
              dirty
                ? "border-amber-400/50 bg-amber-500/10 text-amber-900"
                : "border-sky-300/50 bg-sky-500/10 text-sky-900 dark:text-sky-100",
            )}
          >
            {statusLabel}
          </span>
          <span className="text-xs text-muted-foreground">
            Last saved: <strong className="text-foreground">{formatWhen(lastSavedAt)}</strong>
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {(
            [
              ["desktop", Monitor],
              ["tablet", Tablet],
              ["mobile", Smartphone],
            ] as const
          ).map(([vp, Icon]) => (
            <Button
              key={vp}
              type="button"
              size="sm"
              variant={viewport === vp ? "secondary" : "ghost"}
              className="rounded-xl"
              onClick={() => setViewport(vp)}
            >
              <Icon className="mr-1.5 h-4 w-4" />
              {vp}
            </Button>
          ))}
          <span className="mx-1 h-6 w-px bg-border" />
          <Button
            type="button"
            size="sm"
            variant={previewTheme === "light" ? "secondary" : "ghost"}
            className="rounded-xl"
            onClick={() => setPreviewTheme("light")}
          >
            <Sun className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant={previewTheme === "dark" ? "secondary" : "ghost"}
            className="rounded-xl"
            onClick={() => setPreviewTheme("dark")}
          >
            <Moon className="h-4 w-4" />
          </Button>
        </div>
      </AdminCard>

      {!canEdit ? (
        <p className="text-sm text-amber-700 dark:text-amber-400">View-only â€” your role cannot edit homepage content.</p>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(220px,0.28fr)_minmax(0,1fr)]">
        <aside className="xl:sticky xl:top-4 xl:h-fit">
          <AdminCard className="p-4">
            <h2 className="font-display text-sm font-semibold text-foreground">Section order</h2>
            <p className="mt-1 text-xs text-muted-foreground">Drag to reorder homepage blocks.</p>
            <div className="mt-4">
              <HomepageSortableRail
                state={state}
                selectedId={selectedId}
                onSelect={(id) => setSelectedId(id)}
                onReorder={(order) => setState((s) => ({ ...s, order }))}
              />
            </div>
          </AdminCard>
          <div className="mt-3 space-y-2 text-xs text-muted-foreground">
            <Link href="/admin/content/builder/homepage" className="block font-medium text-sky-600 hover:underline">
              Extra page builder blocks â†’
            </Link>
            <Link href="/admin/content/site-settings" className="block font-medium text-sky-600 hover:underline">
              Mobile sticky bar â†’
            </Link>
          </div>
        </aside>

        <div className="min-w-0">
          <AdminCard className="overflow-hidden p-0">
            <div className="max-h-[min(85vh,1200px)] overflow-y-auto bg-muted/20 p-4 sm:p-6">
              <HomepageVisualPreview
                state={state}
                baseCms={baseCms}
                previewCtx={previewCtx}
                selectedId={selectedId}
                onSelectSection={setSelectedId}
                onMoveSection={moveSection}
                onToggleVisible={toggleVisible}
                onDuplicate={() => toast.message("Duplicate is not available for legacy homepage sections.")}
                onReset={resetSection}
                onDelete={deleteSection}
                viewport={viewport}
                previewTheme={previewTheme}
              />
            </div>
          </AdminCard>
        </div>
      </div>

      <HomepageSectionDrawer
        sectionId={selectedId}
        state={state}
        onChange={setState}
        onClose={() => setSelectedId(null)}
        validationErrors={validationErrors}
      />

      <AlertDialog open={publishOpen} onOpenChange={setPublishOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish homepage?</AlertDialogTitle>
            <AlertDialogDescription>
              This updates live copy and section order for all visitors. Draft content must pass validation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setPublishOpen(false);
                void publishLive();
              }}
            >
              Publish live
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={leaveOpen} onOpenChange={setLeaveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved changes</AlertDialogTitle>
            <AlertDialogDescription>Save a draft before leaving, or discard changes.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setLeaveOpen(false);
                if (pendingNavRef.current) window.location.href = pendingNavRef.current;
              }}
            >
              Leave without saving
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
