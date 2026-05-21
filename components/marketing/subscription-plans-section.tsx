"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import * as React from "react";
import { subscriptionPlans } from "@/data/subscription-plans";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export function SubscriptionPlansSection() {
  const reduce = useReducedMotion();

  return (
    <div className="space-y-10">
      <div className="grid gap-4 lg:grid-cols-3">
        {subscriptionPlans.map((p, i) => (
          <motion.div
            key={p.id}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <Card
              className={cn(
                "relative h-full overflow-hidden rounded-3xl border-border/70 bg-card/80 p-6 shadow-glass backdrop-blur transition-transform hover:-translate-y-1 sm:p-7",
                p.recommended && "border-accent/50 ring-1 ring-accent/30",
              )}
            >
              {p.recommended ? (
                <Badge className="absolute right-5 top-5 rounded-full">Recommended</Badge>
              ) : null}
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                {p.tagline}
              </div>
              <div className="mt-3 font-display text-2xl font-semibold">{p.name}</div>
              <div className="mt-4 flex items-baseline gap-2">
                {p.monthlyPrice > 0 ? (
                  <>
                    <div className="font-display text-4xl font-semibold tracking-tight">
                      ₱{p.monthlyPrice.toLocaleString("en-PH")}
                    </div>
                    <div className="text-sm text-muted-foreground">/ month</div>
                  </>
                ) : (
                  <div className="font-display text-3xl font-semibold tracking-tight">Custom</div>
                )}
              </div>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                {p.included.map((item) => (
                  <li key={item} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 space-y-2 rounded-2xl border border-border/70 bg-muted/20 p-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Priority repair:</span>{" "}
                  <span className="font-semibold text-foreground">{p.priorityRepair}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Scheduled PMS:</span>{" "}
                  <span className="font-semibold text-foreground">{p.scheduledPms}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Discounts:</span>{" "}
                  <span className="font-semibold text-foreground">{p.discounts}</span>
                </div>
              </div>
              <Button asChild className="mt-6 w-full rounded-2xl" variant={p.recommended ? "default" : "outline"}>
                <Link href="/contact">Talk to contracts</Link>
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="overflow-hidden rounded-3xl border-border/70 bg-muted/10 p-0">
        <div className="border-b border-border/70 bg-card/60 px-6 py-4 backdrop-blur">
          <div className="font-display text-lg font-semibold">Plan comparison</div>
          <p className="text-sm text-muted-foreground">
            Enterprise row is intentionally bespoke — scope varies by asset register and SLA.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-6 py-3">Capability</th>
                <th className="px-6 py-3">Residential</th>
                <th className="px-6 py-3">Business</th>
                <th className="px-6 py-3">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {[
                ["Response SLA", "48h target", "24h target", "Contracted"],
                ["Reporting", "Digital history", "Monthly snapshot", "Executive pack"],
                ["Discounts", "5% parts", "8% labor", "Volume / fleet"],
                ["After hours", "Add-on", "Optional", "Included (SLA)"],
              ].map(([a, b, c, d]) => (
                <tr key={a as string} className="bg-background/40">
                  <td className="px-6 py-4 font-semibold">{a}</td>
                  <td className="px-6 py-4 text-muted-foreground">{b}</td>
                  <td className="px-6 py-4 text-muted-foreground">{c}</td>
                  <td className="px-6 py-4 text-muted-foreground">{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
