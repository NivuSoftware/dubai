import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { getSeoEntries } from "./seo-routes.mjs";

const projectRoot = process.cwd();
const publicDir = path.join(projectRoot, "public");
const distDir = path.join(projectRoot, "dist");

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function pathExists(targetPath) {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function writeSeoArtifacts(targetDir, siteUrl, entries, today) {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `  <url>
    <loc>${escapeXml(`${siteUrl}${entry.path}`)}</loc>
    <lastmod>${escapeXml(String(entry.lastmod).slice(0, 10) || today)}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

  const robots = `User-agent: *
Allow: /

# Bloquear rutas privadas (paneles y autenticación)
Disallow: /admin/
Disallow: /admin/panel
Disallow: /admin/login
Disallow: /advertiser/panel
Disallow: /olvide-mi-contrasena
Disallow: /restablecer-contrasena

Sitemap: ${siteUrl}/sitemap.xml
`;

  await mkdir(targetDir, { recursive: true });
  await writeFile(path.join(targetDir, "sitemap.xml"), sitemap, "utf8");
  await writeFile(path.join(targetDir, "robots.txt"), robots, "utf8");
}

const { entries, siteUrl, today } = await getSeoEntries();

await writeSeoArtifacts(publicDir, siteUrl, entries, today);

if (await pathExists(distDir)) {
  await writeSeoArtifacts(distDir, siteUrl, entries, today);
}
