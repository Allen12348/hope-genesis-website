"use client";

import { useReportWebVitals } from "next/web-vitals";

export function WebVitals() {
  useReportWebVitals((metric) => {
    console.log("[Web Vital]", {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
    });

    if (process.env.NODE_ENV === "production") {
      navigator.sendBeacon(
        "/api/metrics/web-vitals",
        JSON.stringify(metric),
      );
    }
  });

  return null;
}
