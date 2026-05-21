import fs from "fs";

const p = "components/sections/hero-background.tsx";
let s = fs.readFileSync(p, "utf8");
const d = "</" + "div>";

s = s.replace(
  "        ) : null}\n      </motion.div>\n\n      {/* z-10 — dark cinematic overlays */}",
  `        ) : null}\n      ${d}\n\n      {/* z-10 — dark cinematic overlays */}`,
);

s = s.replace(
  "        ) : null}\n      </motion.div>\n\n      {/* z-20 — atmospheric / airflow */}",
  `        ) : null}\n      ${d}\n\n      {/* z-20 — atmospheric / airflow */}`,
);

s = s.replace(
  "            ))}\n          </motion.div>\n        ) : null}\n\n        <motion.div className=\"absolute inset-0 [background-image:",
  `            ))}\n          ${d}\n        ) : null}\n\n        <div className=\"absolute inset-0 [background-image:`,
);

s = s.replace(
  "[background-size:44px_44px]\" />\n      </motion.div>\n    </>",
  `[background-size:44px_44px]\" />\n      ${d}\n    </>`,
);

fs.writeFileSync(p, s);
console.log("fixed");
