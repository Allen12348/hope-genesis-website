import fs from "fs";

const fixes = [
  {
    path: "components/home/business-trust-section.tsx",
    replacements: [
      [
        `              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/12">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">{group.title}</h3>
              </motion.div>`,
        `              <motion.div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/12">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">{group.title}</h3>
              </motion.div>`,
      ],
    ],
  },
];

// Manual string fixes with proper div tags
const files = {
  "components/home/business-trust-section.tsx": (s) => {
    s = s.replace(
      /<div className="flex items-center gap-3">([\s\S]*?)<\/motion\.motion\.div>/,
      '<div className="flex items-center gap-3">$1</div>',
    );
    s = s.replace(
      /<div className="flex items-center gap-3">([\s\S]*?)<\/motion\.div>/,
      '<motion.div className="flex items-center gap-3">$1</motion.div>',
    );
    // Simpler fixes
    s = s.replace(
      `                <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">{group.title}</h3>
              </motion.div>`,
      `                <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">{group.title}</h3>
              </motion.div>`,
    );
    return s;
  },
};

// Direct fix
for (const [path, fn] of Object.entries(files)) {
  let s = fs.readFileSync(path, "utf8");
  const before = s;
  s = fn(s);
  if (s === before) {
    // brute force line fixes for business-trust
    s = s.replace(
      "{group.title}</h3>\n              </motion.div>",
      "{group.title}</h3>\n              </motion.div>",
    );
    s = s.replace("      </motion.div>\n    </SectionShell>", "      </motion.div>\n    </SectionShell>");
  }
  fs.writeFileSync(path, s);
}

// business trust - use explicit
let bt = fs.readFileSync("components/home/business-trust-section.tsx", "utf8");
bt = bt.replace(
  /(<div className="flex items-center gap-3">[\s\S]*?<\/)(motion\.div)(>)/,
  "$1motion.div$3",
);
// wrong - fix header close
bt = bt.replace(
  "{group.title}</h3>\n              </motion.div>",
  "{group.title}</h3>\n              </motion.div>".replace("</motion.div>", "</" + "motion.div>"),
);
console.log("skip");
