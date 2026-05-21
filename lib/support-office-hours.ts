/** HGE Support widget — office hours (Asia/Manila). */

export const HGE_SUPPORT_TIMEZONE = "Asia/Manila";

export const HGE_OFFICE_HOURS = {
  /** Monday = 1 … Saturday = 6 (Sunday = 0, closed). */
  openWeekdays: [1, 2, 3, 4, 5, 6] as const,
  openHour: 8,
  openMinute: 0,
  closeHour: 17,
  closeMinute: 0,
} as const;

export const HGE_OFFICE_HOURS_DISPLAY = {
  title: "Office Hours",
  schedule: "Mon – Sat • 8:00 AM – 5:00 PM",
  sundayNote: "Closed on Sundays",
} as const;

export const HGE_OFFICE_CLOSED_MESSAGE =
  "Thank you for contacting Hope Genesis Enterprises. Our office is currently closed. Messages sent now will be answered during business hours.";

const WEEKDAY_TO_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

export type ManilaDateTimeParts = {
  weekdayIndex: number;
  hour: number;
  minute: number;
};

/** Current date/time parts in Asia/Manila (timezone-safe via Intl). */
export function getManilaDateTimeParts(date: Date = new Date()): ManilaDateTimeParts {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: HGE_SUPPORT_TIMEZONE,
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  let weekdayShort = "";
  let hour = 0;
  let minute = 0;

  for (const part of parts) {
    if (part.type === "weekday") weekdayShort = part.value;
    if (part.type === "hour") hour = Number.parseInt(part.value, 10);
    if (part.type === "minute") minute = Number.parseInt(part.value, 10);
  }

  const weekdayIndex = WEEKDAY_TO_INDEX[weekdayShort] ?? 0;

  return { weekdayIndex, hour, minute };
}

function minutesSinceMidnight(hour: number, minute: number): number {
  return hour * 60 + minute;
}

/** True Mon–Sat 8:00 AM–5:00 PM Manila (online until 5:00 PM, exclusive). */
export function isWithinOfficeHours(date: Date = new Date()): boolean {
  const { weekdayIndex, hour, minute } = getManilaDateTimeParts(date);

  if (weekdayIndex < 1 || weekdayIndex > 6) {
    return false;
  }

  const now = minutesSinceMidnight(hour, minute);
  const open = minutesSinceMidnight(HGE_OFFICE_HOURS.openHour, HGE_OFFICE_HOURS.openMinute);
  const close = minutesSinceMidnight(HGE_OFFICE_HOURS.closeHour, HGE_OFFICE_HOURS.closeMinute);

  return now >= open && now < close;
}

/** Formatted office-hours blurb for chat / quick actions. */
export function formatOfficeHoursReply(): string {
  return [
    `🕒 ${HGE_OFFICE_HOURS_DISPLAY.title}`,
    HGE_OFFICE_HOURS_DISPLAY.schedule,
    HGE_OFFICE_HOURS_DISPLAY.sundayNote,
    "",
    "For urgent concerns outside these hours, use Emergency Support or call our office.",
  ].join("\n");
}
