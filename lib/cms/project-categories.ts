/** Project categories shown in admin and validated on save. */

export const PROJECT_CATEGORIES = [

  "Residential",

  "Commercial",

  "VRF/VRV",

  "Refrigeration",

  "Preventive Maintenance",

  "AC Cleaning",

  "Installation",

] as const;



export type ProjectCategoryValue = (typeof PROJECT_CATEGORIES)[number];



/** Maps legacy DB values to the current taxonomy for public display. */

export const LEGACY_PROJECT_CATEGORY_MAP: Record<string, ProjectCategoryValue> = {
  Industrial: "Commercial",
  "Cold Storage": "Refrigeration",
  "Cleaning Service": "AC Cleaning",
  Cleaning: "AC Cleaning",
};



export function normalizeProjectCategory(raw: string): ProjectCategoryValue {

  if ((PROJECT_CATEGORIES as readonly string[]).includes(raw)) {

    return raw as ProjectCategoryValue;

  }

  return LEGACY_PROJECT_CATEGORY_MAP[raw] ?? "Commercial";

}


