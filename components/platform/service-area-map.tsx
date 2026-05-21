"use client";

import { MapPinned } from "lucide-react";
import { serviceAreas } from "@/data/service-areas";
import { cn } from "@/lib/utils";

function MapPinMarker({
  name,
  x,
  y,
  labelSide = "right",
}: {
  name: string;
  x: number;
  y: number;
  labelSide?: "right" | "left";
}) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-[100%]"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <div className="relative">
        <div className="relative grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-[#06162b]/75 shadow-sm backdrop-blur">
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 22s7-5.05 7-12a7 7 0 1 0-14 0c0 6.95 7 12 7 12Z"
              fill="#f5c542"
              opacity={0.92}
            />
            <circle cx="12" cy="10" r="2.25" fill="#0b1324" opacity={0.85} />
          </svg>
          <span className="absolute inset-0 rounded-full ring-1 ring-[#f5c542]/20" />
        </div>

        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-white/10 bg-[#06162b]/85 px-2.5 py-1 text-[11px] font-semibold text-white/85 shadow-sm backdrop-blur",
            labelSide === "right"
              ? "left-[calc(100%+10px)]"
              : "right-[calc(100%+10px)]",
          )}
        >
          {name}
        </div>
      </div>
    </div>
  );
}

export function ServiceAreaMap({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-card via-background to-muted/25 p-6 shadow-card-hge",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Coverage
          </p>
          <h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-primary">
            Southern Luzon service footprint
          </h3>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Animated markers show active dispatch zones. Metro Manila and Batangas
            programs are scheduled with enterprise lead times.
          </p>
        </div>
        <div className="hidden items-center gap-2 rounded-2xl border border-border/70 bg-card/70 px-3 py-2 text-xs font-semibold text-muted-foreground shadow-sm backdrop-blur sm:flex">
          <MapPinned className="h-4 w-4 text-accent" />
          Site surveys available
        </div>
      </div>

      <div className="relative mt-8 aspect-[16/10] w-full">
        <div className="relative h-full w-full overflow-hidden rounded-2xl border border-border/60 bg-[#06162b]">
          <iframe
            title="Southern Luzon map"
            src="https://www.openstreetmap.org/export/embed.html?bbox=120.85%2C13.70%2C121.35%2C14.45&layer=mapnik"
            className="absolute inset-0 h-full w-full"
            style={{
              border: 0,
              filter: "grayscale(1) invert(1) contrast(1.1) brightness(0.75)",
              opacity: 0.55,
              borderRadius: "inherit",
            }}
            loading="lazy"
            referrerPolicy="no-referrer"
          />

          <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_20%_10%,rgba(245,197,66,0.16),transparent_40%),radial-gradient(900px_circle_at_80%_70%,rgba(99,102,241,0.12),transparent_45%)]" />
          <div className="absolute inset-0 opacity-[0.28] [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:28px_28px]" />

          {/* Route lines from Calamba HQ */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
            preserveAspectRatio="none"
          >
            <path
              d="M62 58 L58 52 L52 48"
              fill="none"
              stroke="rgba(245,197,66,0.38)"
              strokeWidth="0.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1.2 1.4"
            />
            <path
              d="M62 58 L38 68"
              fill="none"
              stroke="rgba(245,197,66,0.24)"
              strokeWidth="0.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1.2 1.8"
            />
            <path
              d="M62 58 L72 38"
              fill="none"
              stroke="rgba(245,197,66,0.24)"
              strokeWidth="0.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1.2 2.2"
            />
          </svg>

          {/* Pins */}
          <div className="absolute inset-0">
            {serviceAreas
              .filter(
                (a) =>
                  a.id === "calamba" ||
                  a.id === "cabuyao" ||
                  a.id === "sta-rosa" ||
                  a.id === "batangas" ||
                  a.id === "metro-manila",
              )
              .map((a) => (
                <MapPinMarker
                  key={a.id}
                  name={a.id === "calamba" ? "Calamba HQ" : a.name}
                  x={a.x}
                  y={a.y}
                  labelSide={a.id === "metro-manila" ? "left" : "right"}
                />
              ))}
          </div>

          {/* Region labels */}
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute text-[11px] font-semibold text-white/60"
              style={{ left: "56%", top: "64%" }}
            >
              Laguna
            </div>
          </div>

          <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-[#06162b]/80 px-3 py-1.5 text-xs font-semibold text-white/80 shadow-sm backdrop-blur">
            Calamba HQ → Dispatch routes
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 grid gap-2 p-3 sm:grid-cols-2 lg:grid-cols-3">
          {serviceAreas.map((a) => (
            <div
              key={a.id}
              className="glass-panel rounded-2xl px-3 py-2 text-xs text-foreground"
            >
              <div className="font-semibold">{a.name}</div>
              <div className="text-[11px] text-muted-foreground">{a.tagline}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
