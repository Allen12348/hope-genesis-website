import type { HomePagePublishedV1 } from "@/lib/cms/marketing-cms-defaults";
import type { HomepageEditorState } from "@/lib/cms/homepage-visual-editor/types";

type PathSegment = string | number;

function parsePath(path: string): PathSegment[] {
  return path.split(".").filter(Boolean);
}

function getAtPath(obj: unknown, segments: PathSegment[]): unknown {
  let cur: unknown = obj;
  for (const seg of segments) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string | number, unknown>)[seg];
  }
  return cur;
}

function setAtPath(obj: Record<string, unknown>, segments: PathSegment[], value: unknown): void {
  let cur: Record<string, unknown> = obj;
  for (let i = 0; i < segments.length - 1; i++) {
    const seg = segments[i]!;
    const next = cur[seg];
    if (next == null || typeof next !== "object") {
      cur[seg] = {};
    }
    cur = cur[seg] as Record<string, unknown>;
  }
  cur[segments[segments.length - 1]!] = value;
}

export function readEditorFieldValue(state: HomepageEditorState, path: string): string {
  const root = { ...state, ...state.home, homeSectionShells: state.home.homeSectionShells };
  const val = getAtPath(root, parsePath(path));
  if (val == null) return "";
  if (typeof val === "number") return String(val);
  return String(val);
}

export function writeEditorFieldValue(
  state: HomepageEditorState,
  path: string,
  raw: string,
): HomepageEditorState {
  const segments = parsePath(path);
  const homeClone = structuredClone(state.home) as HomePagePublishedV1 & Record<string, unknown>;

  let value: string | number = raw;
  if (path.endsWith("heroOverlayOpacity")) {
    const n = Number.parseFloat(raw);
    value = Number.isFinite(n) ? Math.min(0.92, Math.max(0.15, n)) : 0.55;
  }

  const root: Record<string, unknown> = {
    home: homeClone,
    homeSectionShells: homeClone.homeSectionShells,
    aboutPreview: homeClone.aboutPreview,
    customerPlatform: homeClone.customerPlatform,
    contactCta: homeClone.contactCta,
    hero: homeClone.hero,
  };

  setAtPath(root, segments, value);

  return {
    ...state,
    home: {
      ...homeClone,
      hero: (root.hero as HomePagePublishedV1["hero"]) ?? homeClone.hero,
      homeSectionShells:
        (root.homeSectionShells as HomePagePublishedV1["homeSectionShells"]) ?? homeClone.homeSectionShells,
      aboutPreview: (root.aboutPreview as HomePagePublishedV1["aboutPreview"]) ?? homeClone.aboutPreview,
      customerPlatform:
        (root.customerPlatform as HomePagePublishedV1["customerPlatform"]) ?? homeClone.customerPlatform,
      contactCta: (root.contactCta as HomePagePublishedV1["contactCta"]) ?? homeClone.contactCta,
    },
  };
}
