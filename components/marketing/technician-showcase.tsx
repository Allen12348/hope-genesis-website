"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Award, Hammer } from "lucide-react";
import { technicians } from "@/data/technicians";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function TechnicianShowcase() {
  const reduce = useReducedMotion();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {technicians.map((t, i) => (
        <motion.div
          key={t.id}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card className="group h-full overflow-hidden rounded-3xl border-border/70 bg-card/80 shadow-glass backdrop-blur transition-transform hover:-translate-y-1">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={t.photo}
                alt={t.photoAlt}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.04]"
                sizes="(min-width: 768px) 33vw, 100vw"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <Badge variant="outline" className="rounded-full border-white/20 bg-black/40 text-white backdrop-blur">
                  {t.yearsExperience}+ yrs field
                </Badge>
                <div className="mt-3 font-display text-xl font-semibold text-white">{t.name}</div>
                <div className="text-sm text-white/80">{t.role}</div>
              </div>
            </div>
            <div className="space-y-4 p-6">
              <p className="text-sm leading-relaxed text-muted-foreground">{t.bio}</p>
              <div className="flex flex-wrap gap-2">
                {t.specialties.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-border/70 bg-muted/30 px-3 py-1 text-xs font-semibold"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Award className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <div>
                  <div className="font-semibold text-foreground">Certifications</div>
                  <ul className="mt-1 space-y-1">
                    {t.certifications.map((c) => (
                      <li key={c}>— {c}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Hammer className="h-4 w-4 text-accent" />
                {t.completedProjects}+ documented completions
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
