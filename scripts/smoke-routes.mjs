/**
 * Phase 16 route smoke test — run against `npm run start` (default http://localhost:3000).
 * Usage: node scripts/smoke-routes.mjs [baseUrl]
 */
const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");

const routes = [
  "/",
  "/about",
  "/services",
  "/projects",
  "/gallery",
  "/testimonials",
  "/blog",
  "/contact",
  "/admin",
  "/admin/settings",
  "/admin/content",
  "/admin/projects",
  "/admin/blog",
  "/admin/testimonials",
  "/admin/gallery",
  "/admin/login",
  "/robots.txt",
  "/sitemap.xml",
];

const okStatuses = new Set([200, 301, 302, 303, 307, 308]);

async function check(path) {
  const url = `${base}${path}`;
  try {
    const res = await fetch(url, { redirect: "manual" });
    const status = res.status;
    const pass = okStatuses.has(status);
    return { path, status, pass, error: pass ? null : await res.text().catch(() => "") };
  } catch (e) {
    return { path, status: 0, pass: false, error: e instanceof Error ? e.message : String(e) };
  }
}

async function main() {
  console.log(`Smoke test: ${base}\n`);
  const results = [];
  for (const path of routes) {
    const r = await check(path);
    results.push(r);
    const mark = r.pass ? "OK" : "FAIL";
    console.log(`${mark.padEnd(4)} ${r.status.toString().padStart(3)}  ${path}`);
    if (!r.pass && r.error) {
      const snippet = r.error.replace(/\s+/g, " ").slice(0, 120);
      console.log(`      ${snippet}`);
    }
  }
  const failed = results.filter((r) => !r.pass);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  if (failed.length > 0) process.exit(1);
}

main();
