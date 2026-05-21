/** HVAC project lifecycle statuses stored on `Project.status`. */

export const PROJECT_STATUSES = ["completed", "in_progress", "planned"] as const;



export type ProjectStatusValue = (typeof PROJECT_STATUSES)[number];



export const PROJECT_STATUS_LABELS: Record<ProjectStatusValue, string> = {

  completed: "Completed",

  in_progress: "In progress",

  planned: "Planned",

};



export function normalizeProjectStatus(raw: string | null | undefined): ProjectStatusValue {

  if (raw && (PROJECT_STATUSES as readonly string[]).includes(raw)) {

    return raw as ProjectStatusValue;

  }

  return "completed";

}


