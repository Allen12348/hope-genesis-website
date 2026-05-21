import {
  HGE_OFFICE_HOURS_DISPLAY,
  HGE_SUPPORT_TIMEZONE,
  isWithinOfficeHours,
} from "@/lib/support-office-hours";

export type SupportAvailability = "online" | "offline";

export type SupportStatus = {
  availability: SupportAvailability;
  isOnline: boolean;
  label: string;
  /** Tailwind background class for status dot */
  dotClassName: string;
  timezone: string;
};

/** Dynamic HGE Support online / delayed-response status. */
export function getSupportStatus(date: Date = new Date()): SupportStatus {
  const isOnline = isWithinOfficeHours(date);

  if (isOnline) {
    return {
      availability: "online",
      isOnline: true,
      label: "Online now",
      dotClassName: "bg-emerald-500",
      timezone: HGE_SUPPORT_TIMEZONE,
    };
  }

  return {
    availability: "offline",
    isOnline: false,
    label: "Replies may be delayed",
    dotClassName: "bg-amber-500",
    timezone: HGE_SUPPORT_TIMEZONE,
  };
}

export { HGE_OFFICE_HOURS_DISPLAY, HGE_SUPPORT_TIMEZONE, isWithinOfficeHours };
