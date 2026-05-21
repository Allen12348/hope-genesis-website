import fs from "fs";

const path = "components/sections/hero-section.tsx";
const s = fs.readFileSync(path, "utf8");
const marker = '          <div className="grid w-full grid-cols-2';
const idx = s.indexOf(marker);
if (idx === -1) throw new Error("marker not found");

const tail = `          <div className="grid w-full grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {hero.stats.map((s) => {
              const StatIcon = statIconFor(s.label, s.icon);
              return (
                <div
                  key={s.label}
                  className="group relative min-h-0 overflow-hidden rounded-2xl border border-white/20 bg-white/[0.12] p-4 text-white shadow-[0_8px_32px_-12px_rgba(15,23,42,0.2)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-sky-300/30 hover:bg-white/[0.16] hover:shadow-[0_16px_48px_-16px_rgba(56,189,248,0.28)] sm:p-5 [@media(max-height:800px)]:p-3"
                >
                  <span
                    className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full bg-primary/15 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"
                    aria-hidden
                  />
                  <StatIcon className="mb-2 h-4 w-4 text-[hsl(var(--primary))]" aria-hidden />
                  <motion.div className="font-display text-[clamp(1.65rem,2.8vw,2.75rem)] font-bold leading-none tracking-tight">
                    <AnimatedStatValue end={s.value} suffix={s.suffix} startOnMount className="text-white" />
                  </motion.div>
                  <motion.div className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/72 sm:text-xs [@media(max-height:800px)]:mt-1">
                    {s.label}
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            className={cn(
              "flex flex-wrap gap-2 text-sm text-white/78 sm:gap-2.5",
              isCentered ? "justify-center" : "sm:justify-start",
            )}
            style={textLift}
          >
            {hero.bottomBadges.map((line) => (
              <motion.div
                key={line}
                className="inline-flex min-h-0 items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-3 py-1.5 backdrop-blur-md [@media(max-height:800px)]:py-1 sm:py-2"
              >
                <BadgeCheck className="h-4 w-4 text-[hsl(var(--primary))]" />
                {line}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {isSplit ? (
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.98 }}
            animate={reduce ? undefined : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative mt-8 hidden lg:block"
            aria-hidden
          >
            <motion.div className="aspect-[4/5] overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-md">
              <motion.div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: \`url(\${heroSrc})\`, backgroundPosition }}
              />
              <motion.div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </motion.div>
          </motion.div>
        ) : null}
      </motion.div>
    </section>
  );
}
`;

// Fix motion.div typos in tail - use div for static wrappers
const fixed = tail
  .replace(/<motion\.div className="font-display/g, '<div className="font-display')
  .replace(
    /<motion\.motion\.div className="mt-1\.5/g,
    '<div className="mt-1.5',
  )
  .replace(/<motion\.div className="mt-1\.5/g, '<div className="mt-1.5')
  .replace(/<\/motion\.div>\n                <\/motion\.motion\.motion\.div>/g, '</div>\n                </div>')
  .replace(/<\/motion\.div>\n                <\/motion\.div>/g, '</motion.div>\n                </motion.div>');

// Simpler: write tail with correct tags from scratch
const goodTail = `          <div className="grid w-full grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {hero.stats.map((s) => {
              const StatIcon = statIconFor(s.label, s.icon);
              return (
                <div
                  key={s.label}
                  className="group relative min-h-0 overflow-hidden rounded-2xl border border-white/20 bg-white/[0.12] p-4 text-white shadow-[0_8px_32px_-12px_rgba(15,23,42,0.2)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-sky-300/30 hover:bg-white/[0.16] hover:shadow-[0_16px_48px_-16px_rgba(56,189,248,0.28)] sm:p-5 [@media(max-height:800px)]:p-3"
                >
                  <span
                    className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full bg-primary/15 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"
                    aria-hidden
                  />
                  <StatIcon className="mb-2 h-4 w-4 text-[hsl(var(--primary))]" aria-hidden />
                  <div className="font-display text-[clamp(1.65rem,2.8vw,2.75rem)] font-bold leading-none tracking-tight">
                    <AnimatedStatValue end={s.value} suffix={s.suffix} startOnMount className="text-white" />
                  </motion.div>
                  <motion.div className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/72 sm:text-xs [@media(max-height:800px)]:mt-1">
                    {s.label}
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            className={cn(
              "flex flex-wrap gap-2 text-sm text-white/78 sm:gap-2.5",
              isCentered ? "justify-center" : "sm:justify-start",
            )}
            style={textLift}
          >
            {hero.bottomBadges.map((line) => (
              <motion.div
                key={line}
                className="inline-flex min-h-0 items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-3 py-1.5 backdrop-blur-md [@media(max-height:800px)]:py-1 sm:py-2"
              >
                <BadgeCheck className="h-4 w-4 text-[hsl(var(--primary))]" />
                {line}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {isSplit ? (
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.98 }}
            animate={reduce ? undefined : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative mt-8 hidden lg:block"
            aria-hidden
          >
            <motion.div className="aspect-[4/5] overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-md">
              <motion.div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: \`url(\${heroSrc})\`, backgroundPosition }}
              />
              <motion.div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </motion.div>
          </motion.div>
        ) : null}
      </motion.div>
    </section>
  );
}
`;

console.log("Use manual fix - script has typos too");
