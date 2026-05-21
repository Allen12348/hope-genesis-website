import fs from "fs";

const path = "components/sections/hero-section.tsx";
let s = fs.readFileSync(path, "utf8");
const d = "</" + "motion.div>";
const div = "</" + "motion.div>".replace("motion.", "");

s = s.replace(
  `<motion.div className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/72 sm:text-xs [@media(max-height:800px)]:mt-1">
                    {s.label}
                  ${d}
                ${d}`,
  `<div className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/72 sm:text-xs [@media(max-height:800px)]:mt-1">
                    {s.label}
                  ${motion.div}
                ${motion.div}`,
);

// fix the botched replace above - div variable
const divClose = "</" + "div>";
s = fs.readFileSync(path, "utf8");
s = s.replace(
  `<motion.div className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/72 sm:text-xs [@media(max-height:800px)]:mt-1">
                    {s.label}
                  </motion.div>
                </motion.div>`,
  `<div className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/72 sm:text-xs [@media(max-height:800px)]:mt-1">
                    {s.label}
                  ${divClose}
                ${motion.div}`,
);

console.log("divClose=", divClose);
