import fs from "node:fs/promises";
import path from "node:path";

const repoRoot = process.cwd();
const publicDir = path.join(repoRoot, "public");
const institutionsPath = path.join(repoRoot, "src", "data", "institutions.json");

const siteUrl = "https://wxgpt.fangxiashouji.com/riscvscholars";
const today = new Date().toISOString().slice(0, 10);

const staticRoutes = [
  { path: "", priority: "1.0", changefreq: "weekly" },
  { path: "directory", priority: "0.9", changefreq: "weekly" },
  { path: "research-lines", priority: "0.8", changefreq: "monthly" },
  { path: "collaboration", priority: "0.8", changefreq: "monthly" },
  { path: "claim-profile", priority: "0.6", changefreq: "monthly" },
  { path: "submit-request", priority: "0.7", changefreq: "monthly" },
  { path: "about", priority: "0.6", changefreq: "monthly" },
];

function buildUrl(routePath) {
  return routePath ? `${siteUrl}/${routePath}` : `${siteUrl}/`;
}

function urlEntry({ loc, lastmod, changefreq, priority }) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function main() {
  await fs.mkdir(publicDir, { recursive: true });
  const institutions = JSON.parse(await fs.readFile(institutionsPath, "utf8"));

  const staticEntries = staticRoutes.map((route) =>
    urlEntry({
      loc: buildUrl(route.path),
      lastmod: today,
      changefreq: route.changefreq,
      priority: route.priority,
    }),
  );

  const profileEntries = institutions.map((profile) =>
    urlEntry({
      loc: buildUrl(`directory/${profile.slug}`),
      lastmod: profile.lastUpdated || today,
      changefreq: "monthly",
      priority: "0.7",
    }),
  );

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticEntries, ...profileEntries].join("\n")}
</urlset>
`;

  const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

  await fs.writeFile(path.join(publicDir, "sitemap.xml"), sitemap);
  await fs.writeFile(path.join(publicDir, "robots.txt"), robots);

  console.log("Generated public/sitemap.xml and public/robots.txt");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
