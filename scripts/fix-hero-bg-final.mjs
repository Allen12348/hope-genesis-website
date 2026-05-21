import fs from "fs";

const p = "components/sections/hero-background.tsx";
let s = fs.readFileSync(p, "utf8");

// Replace static motion.div wrappers with div (keep motion.div only for parallax + video is ok as div too)
const fromTo = [
  ['<motion.div className={cn("absolute inset-0", mediaScaleClass)}', '<div className={cn("absolute inset-0", mediaScaleClass)}'],
  ['<motion.div className="absolute inset-0" style={{ filter: mediaFilter }}>', '<motion.div className="absolute inset-0" style={{ filter: mediaFilter }}>'.replace("<motion.div", "<div")],
  ['<motion.div className="pointer-events-none absolute inset-0 z-10"', '<div className="pointer-events-none absolute inset-0 z-10"'],
  ['<motion.div className="pointer-events-none absolute inset-0 z-20"', '<div className="pointer-events-none absolute inset-0 z-20"'],
  ['<motion.div className="absolute inset-0 z-[1] overflow-hidden">', '<div className="absolute inset-0 z-[1] overflow-hidden">'],
];

for (const [from, to] of fromTo) {
  s = s.split(from).join(to);
}

// Fix filter wrapper - second item was wrong, do explicitly
s = s.replace(
  '<motion.div className="absolute inset-0" style={{ filter: mediaFilter }}>',
  '<div className="absolute inset-0" style={{ filter: mediaFilter }}>',
);

// Replace remaining static motion.div opens that are simple
s = s.replace(/<motion\.div className="absolute inset-y-0/g, '<div className="absolute inset-y-0');
s = s.replace(/<motion\.motion\.div className="absolute inset-x-0/g, '<div className="absolute inset-x-0');
s = s.replace(/<motion\.div className="absolute inset-x-0/g, '<div className="absolute inset-x-0');
s = s.replace(/<motion\.motion\.div className="noise-overlay/g, '<motion.div className="noise-overlay'.replace("<motion.div", "<motion.div"));
s = s.replace(/<motion\.div className="noise-overlay/g, '<div className="noise-overlay');
s = s.replace(/<motion\.motion\.div className="absolute inset-0 bg-\[radial-gradient/g, '<div className="absolute inset-0 bg-[radial-gradient');
s = s.replace(/<motion\.div className="absolute inset-0 bg-\[radial-gradient/g, '<div className="absolute inset-0 bg-[radial-gradient');
s = s.replace(/<motion\.div className="absolute inset-0 animate-hero-fog/g, '<div className="absolute inset-0 animate-hero-fog');
s = s.replace(/<motion\.div className="absolute inset-0 overflow-hidden">/g, '<div className="absolute inset-0 overflow-hidden">');
s = s.replace(
  /<motion\.div\n          className=\{cn\("absolute inset-0", !overlayHex/g,
  '<div\n          className={cn("absolute inset-0", !overlayHex',
);

// Close tags: within hero-background, after our opens are div, closes should be div
// But motion.div parallax layer still needs motion.div close - structure:
// z-0 outer div
//   motion.div parallax
//     div scale
//       div filter
//       /motion.div /motion.div /motion.div
//   div video...
// /motion.div for z-0 outer

// Replace wrong </motion.div> that close div - use stack-based approach
const lines = s.split("\n");
const stack = [];
const out = [];
for (const line of lines) {
  const openDiv = line.match(/^(\s*)<div(\s|>)/);
  const openMotion = line.match(/^(\s*)<motion\.div(\s|>)/);
  const closeDiv = line.match(/^(\s*)<\/motion\.div>/);
  const closeMotion = line.match(/^(\s*)<\/motion\.div>/);

  if (openDiv) stack.push("motion.div");
  if (openMotion) stack.push("motion.div");
  if (closeDiv || closeMotion) {
    const tag = stack.pop();
    if (tag === "motion.div") {
      out.push(line.replace("</motion.div>", "</motion.div>"));
    } else {
      out.push(line);
    }
    continue;
  }
  out.push(line);
}
s = out.join("\n");

fs.writeFileSync(p, s);
console.log("done");
