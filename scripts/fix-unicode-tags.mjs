import fs from "fs";

const path = "components/sections/hero-section.tsx";
let s = fs.readFileSync(path, "utf8");
s = s.replace(/\\u003c\/div\\u003e/g, "</div>");
fs.writeFileSync(path, s);
console.log("fixed", (s.match(/<\/div>/g) || []).length, "div closes");
