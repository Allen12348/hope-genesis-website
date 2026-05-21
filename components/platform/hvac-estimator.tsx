"use client";

import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Factory,
  Home,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { StepPanel } from "@/components/motion/step-panel";
import { serviceAreas } from "@/data/service-areas";
import {
  type AcPreference,
  type BudgetRange,
  type EstimateInput,
  type InverterPreference,
  buildEstimate,
} from "@/lib/hvac-estimate-engine";
import {
  isValidPositiveDecimalInput,
  parsePositiveMeasurement,
  sanitizePositiveDecimalInput,
} from "@/lib/numeric-input";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const steps = [
  "Property",
  "Spaces",
  "Preferences",
  "Location",
  "Results",
] as const;

const initial: EstimateInput = {
  propertyType: "residential",
  roomSizeSqm: 20,
  roomCount: 1,
  ceilingHeightM: 2.7,
  acPreference: "split-inverter",
  inverterPreference: "inverter",
  budget: "balanced",
  location: "",
  serviceAreaId: serviceAreas[0]?.id ?? "calamba",
};

const cardTitle = "font-display text-lg font-semibold text-slate-950 dark:text-white";
const cardCopy = "mt-2 text-sm text-slate-600 dark:text-slate-300";
const stepHeading = "font-display text-base font-semibold text-slate-950 dark:text-white";
const fieldLabel = "text-sm font-medium text-slate-950 dark:text-white";

export function HvacEstimator({ embedded }: { embedded?: boolean }) {
  const [step, setStep] = React.useState(0);
  /** Highest step index the user has reached — enables tab navigation without jumping ahead blindly. */
  const [furthestStep, setFurthestStep] = React.useState(0);
  const [data, setData] = React.useState<EstimateInput>(initial);
  /** Decimal fields use string drafts so edits like “2.” are visible before parsing. */
  const [measurementDrafts, setMeasurementDrafts] = React.useState({
    roomSizeSqm: String(initial.roomSizeSqm),
    ceilingHeightM: String(initial.ceilingHeightM),
  });
  const [locationError, setLocationError] = React.useState<string | null>(null);

  function applyMeasurementDraft(
    field: "roomSizeSqm" | "ceilingHeightM",
    raw: string,
  ) {
    const sanitized = sanitizePositiveDecimalInput(raw);
    setMeasurementDrafts((d) => ({ ...d, [field]: sanitized }));
    if (field === "roomSizeSqm") {
      setData((d) => ({ ...d, roomSizeSqm: parsePositiveMeasurement(sanitized) }));
      return;
    }
    setData((d) => ({ ...d, ceilingHeightM: parsePositiveMeasurement(sanitized) }));
  }
  const result = React.useMemo(() => buildEstimate(data), [data]);

  React.useEffect(() => {
    setFurthestStep((f) => Math.max(f, step));
  }, [step]);

  const progress = ((step + 1) / steps.length) * 100;

  const next = () => {
    if (step === 3 && data.location.trim().length <= 2) {
      setLocationError("Enter your city or barangay (at least 3 characters).");
      return;
    }
    setLocationError(null);
    setStep((s) => Math.min(steps.length - 1, s + 1));
  };
  const back = () => {
    setLocationError(null);
    setStep((s) => Math.max(0, s - 1));
  };

  const canNext =
    step === 0 ||
    (step === 1 &&
      data.roomSizeSqm > 0 &&
      data.roomCount > 0 &&
      data.ceilingHeightM > 0) ||
    step === 2 ||
    (step === 3 && data.location.trim().length > 2) ||
    step === 4;

  const selectedArea = serviceAreas.find((a) => a.id === data.serviceAreaId);

  return (
    <div className={cn(!embedded && "mx-auto max-w-3xl")}>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Instant estimate
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
            HVAC sizing &amp; budget planner
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Premium stepper experience — indicative numbers only until a formal site survey.
          </p>
        </div>
        <Badge variant="outline" className="hidden rounded-full sm:inline-flex">
          {steps[step]}
        </Badge>
      </div>

      <div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {steps.map((label, i) => {
          const reachable = i <= furthestStep;
          return (
            <button
              key={label}
              type="button"
              disabled={!reachable}
              title={
                !reachable
                  ? "Complete the current step to unlock this section"
                  : i === step
                    ? "Current step"
                    : `Go to ${label}`
              }
              onClick={() => {
                if (reachable) setStep(i);
              }}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                !reachable && "cursor-not-allowed opacity-45",
                i === step
                  ? "border-primary bg-primary text-primary-foreground"
                  : i < step
                    ? "border-slate-200 bg-slate-100 text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                    : "border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-300",
              )}
            >
              {i + 1}. {label}
            </button>
          );
        })}
      </div>

      <Card className="mt-6 overflow-hidden rounded-3xl border-slate-200 bg-white p-6 shadow-glass backdrop-blur dark:border-slate-800 dark:bg-slate-950 sm:p-8">
        <StepPanel stepKey={step}>
          {step === 0 && (
            <div className="space-y-4">
              <p className={stepHeading}>Select property type</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Load factors differ for homes, retail, and industrial plants.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                {(
                  [
                    { id: "residential" as const, title: "Residential", icon: Home, copy: "Homes, condos, villas" },
                    { id: "commercial" as const, title: "Commercial", icon: Building2, copy: "Retail, offices, clinics" },
                    { id: "industrial" as const, title: "Industrial", icon: Factory, copy: "Plants, warehouses, MUA" },
                  ] as const
                ).map((opt) => {
                  const Icon = opt.icon;
                  const active = data.propertyType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setData((d) => ({ ...d, propertyType: opt.id }))}
                      className={cn(
                        "rounded-2xl border p-5 text-left transition-all hover:-translate-y-0.5",
                        active
                          ? "border-accent/70 bg-gradient-to-br from-accent/15 to-transparent shadow-sm"
                          : "border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700",
                      )}
                    >
                      <Icon className="h-6 w-6 text-accent" />
                      <div className={cardTitle}>{opt.title}</div>
                      <p className={cardCopy}>{opt.copy}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <p className={stepHeading}>Room &amp; space details</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Used for rule-of-thumb tonnage — a site survey refines this.
              </p>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sqm" className={fieldLabel}>Room size (sqm)</Label>
                  <Input
                    id="sqm"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step={0.1}
                    value={measurementDrafts.roomSizeSqm}
                    onChange={(e) => applyMeasurementDraft("roomSizeSqm", e.target.value)}
                    className="rounded-2xl border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                  />
                  {!isValidPositiveDecimalInput(measurementDrafts.roomSizeSqm) ? (
                    <p className="text-xs text-destructive">Enter a room size greater than 0.</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rooms" className={fieldLabel}>Number of rooms</Label>
                  <Input
                    id="rooms"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    step={1}
                    value={data.roomCount}
                    onChange={(e) =>
                      setData((d) => ({ ...d, roomCount: Math.max(1, Number(e.target.value) || 1) }))
                    }
                    className="rounded-2xl border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="ceiling" className={fieldLabel}>Ceiling height (meters)</Label>
                  <Input
                    id="ceiling"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step={0.1}
                    value={measurementDrafts.ceilingHeightM}
                    onChange={(e) =>
                      applyMeasurementDraft("ceilingHeightM", e.target.value)
                    }
                    className="rounded-2xl border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                  />
                  {!isValidPositiveDecimalInput(measurementDrafts.ceilingHeightM) ? (
                    <p className="text-xs text-destructive">Enter a valid ceiling height.</p>
                  ) : null}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <p className={stepHeading}>Equipment &amp; budget preferences</p>
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-3">
                  <Label className={fieldLabel}>Preferred AC type</Label>
                  <div className="grid gap-2">
                    {(
                      [
                        ["split-inverter", "Wall split (inverter)"],
                        ["window", "Window-type"],
                        ["ducted", "Concealed ducted"],
                        ["vrf", "VRF / VRV"],
                        ["unsure", "Not sure — recommend for me"],
                      ] as const
                    ).map(([id, label]) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setData((d) => ({ ...d, acPreference: id as AcPreference }))}
                        className={cn(
                          "rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition-colors",
                          data.acPreference === id
                            ? "border-primary bg-primary/10 text-slate-950 dark:text-white"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800",
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className={fieldLabel}>Inverter preference</Label>
                  <div className="grid gap-2">
                    {(
                      [
                        ["inverter", "Inverter (efficiency priority)"],
                        ["non-inverter", "Non-inverter (lower upfront)"],
                        ["unsure", "Recommend based on budget"],
                      ] as const
                    ).map(([id, label]) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() =>
                          setData((d) => ({ ...d, inverterPreference: id as InverterPreference }))
                        }
                        className={cn(
                          "rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition-colors",
                          data.inverterPreference === id
                            ? "border-accent bg-accent/15 text-slate-950 dark:text-white"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800",
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <Label className={cn(fieldLabel, "pt-2")}>Budget range</Label>
                  <div className="grid gap-2">
                    {(
                      [
                        ["economy", "Value-first"],
                        ["balanced", "Balanced performance"],
                        ["premium", "Premium efficiency & aesthetics"],
                      ] as const
                    ).map(([id, label]) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setData((d) => ({ ...d, budget: id as BudgetRange }))}
                        className={cn(
                          "rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition-colors",
                          data.budget === id
                            ? "border-accent bg-accent/15 text-slate-950 dark:text-white"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800",
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <p className={stepHeading}>Location &amp; service area</p>
              <div className="space-y-3">
                <Label htmlFor="loc" className={fieldLabel}>Location (city / barangay)</Label>
                <Input
                  id="loc"
                  placeholder="e.g., Calamba, Laguna — Bucal"
                  value={data.location}
                  onChange={(e) => {
                    setLocationError(null);
                    setData((d) => ({ ...d, location: e.target.value }));
                  }}
                  className="rounded-2xl border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                  aria-invalid={Boolean(locationError)}
                />
                {locationError ? (
                  <p className="text-xs text-destructive">{locationError}</p>
                ) : (
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Used for dispatch planning — minimum 3 characters to continue.
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <Label className={fieldLabel}>Service area</Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {serviceAreas.map((area) => (
                    <button
                      key={area.id}
                      type="button"
                      onClick={() => setData((d) => ({ ...d, serviceAreaId: area.id }))}
                      className={cn(
                        "rounded-2xl border px-4 py-3 text-left transition-colors",
                        data.serviceAreaId === area.id
                          ? "border-primary bg-primary/10 text-slate-950 dark:text-white"
                          : "border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800",
                      )}
                    >
                      <div className="text-sm font-semibold text-slate-950 dark:text-white">{area.name}</div>
                      <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">{area.tagline}</div>
                    </button>
                  ))}
                </div>
                {selectedArea ? (
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Selected zone:{" "}
                    <span className="font-semibold text-slate-950 dark:text-white">{selectedArea.name}</span>
                  </p>
                ) : null}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-start gap-3 rounded-2xl border border-accent/30 bg-accent/10 p-4">
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <div className={cn(cardTitle, "text-lg")}>{result.solutionTitle}</div>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    {result.solutionBullets.map((b) => (
                      <li key={b}>— {b}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <ResultTile
                  label="Recommended HP (rule-of-thumb)"
                  value={`${result.recommendedHp} HP`}
                  detail={result.recommendedAcLabel}
                />
                <ResultTile
                  label="Suggested AC type"
                  value={result.recommendedAcLabel}
                  detail={`${data.inverterPreference} · ${data.acPreference.replace("-", " ")}`}
                />
                <ResultTile
                  label="Installation (indicative)"
                  value={`₱${result.installPriceLow.toLocaleString("en-PH")} – ₱${result.installPriceHigh.toLocaleString("en-PH")}`}
                  detail="Equipment, labor, and standard line sets — site survey required."
                  className="sm:col-span-2"
                />
                <ResultTile
                  label="Estimated annual PMS (preventive)"
                  value={`₱${result.pmsAnnualLow.toLocaleString("en-PH")} – ₱${result.pmsAnnualHigh.toLocaleString("en-PH")}`}
                  detail="Planned preventive maintenance cadence (visits + consumables band)."
                />
                <ResultTile
                  label="Estimated annual deep cleaning"
                  value={`₱${result.cleaningAnnualLow.toLocaleString("en-PH")} – ₱${result.cleaningAnnualHigh.toLocaleString("en-PH")}`}
                  detail="Coil treatment, chemical wash, and hygiene-focused cleaning bands."
                />
                <ResultTile
                  label="Indicative monthly kWh"
                  value={`~${result.kwhMonthApprox}`}
                  detail="Ballpark for continuous comfort use — varies with tariff and insulation."
                  className="sm:col-span-2"
                />
              </div>

              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">{result.disclaimer}</p>

              <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-6 dark:border-slate-800">
                <Button asChild className="rounded-2xl">
                  <Link href="/contact">Request site survey</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-2xl">
                  <Link href="/contact">Talk to an engineer</Link>
                </Button>
              </div>
            </div>
          )}
        </StepPanel>

        {!canNext && step !== steps.length - 1 ? (
          <p className="mt-6 text-xs text-slate-600 dark:text-slate-300" role="status">
            {step === 1
              ? "Set room size, room count, and ceiling height to values greater than 0 to continue."
              : step === 3
                ? "Enter at least 3 characters for your city or barangay before viewing results."
                : null}
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            className="rounded-2xl border-slate-200 dark:border-slate-800"
            onClick={back}
            disabled={step === 0}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          {step < steps.length - 1 ? (
            <Button
              type="button"
              className="rounded-2xl"
              onClick={next}
              disabled={!canNext}
              title={
                !canNext && step === 3
                  ? "Enter your location (3+ characters) to continue"
                  : !canNext && step === 1
                    ? "Complete all space fields to continue"
                    : undefined
              }
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="secondary"
              className="rounded-2xl"
              onClick={() => {
                setData(initial);
                setMeasurementDrafts({
                  roomSizeSqm: String(initial.roomSizeSqm),
                  ceilingHeightM: String(initial.ceilingHeightM),
                });
                setStep(0);
                setFurthestStep(0);
                setLocationError(null);
              }}
            >
              Reset planner
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

function ResultTile({
  label,
  value,
  detail,
  className,
}: {
  label: string;
  value: string;
  detail: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900",
        className,
      )}
    >
      <div className="text-xs font-semibold uppercase tracking-wide text-accent">{label}</div>
      <div className="mt-2 font-display text-2xl font-semibold text-slate-950 dark:text-white sm:text-3xl">{value}</div>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{detail}</p>
    </div>
  );
}
