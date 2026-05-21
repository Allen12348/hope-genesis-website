import fs from "fs";

const closeDiv = "</" + "motion.div>".replace("motion.", "");

for (const p of [
  "components/home/hero-services-strip.tsx",
  "components/home/business-trust-section.tsx",
]) {
  let s = fs.readFileSync(p, "utf8");
  const wrong = "</" + "motion.div>";
  const right = "</" + "div>";
  // Only fix pattern: open div for text block
  s = s.replace(
    /<div>\s*\n\s*<h3[\s\S]*?<\/motion\.div>\s*\n\s*<\/Link>/g,
    (m) => m.replace(wrong, right),
  );
  s = s.replace(
    /<motion\.div className="flex items-center gap-3">[\s\S]*?<\/motion\.motion\.div>/g,
    (m) => m.replace(wrong, right),
  );
  s = s.replace(
    /<div className="flex items-center gap-3">[\s\S]*?<\/motion\.div>/g,
    (m) => m.replace(wrong, right),
  );
  s = s.replace(/\n      <\/motion\.div>\n    <\/SectionShell>/, `\n      ${right}\n    </SectionShell>`);
  fs.writeFileSync(p, s);
  console.log("fixed", p);
}
