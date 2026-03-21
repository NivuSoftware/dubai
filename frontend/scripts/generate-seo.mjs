import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const publicDir = path.join(projectRoot, "public");
const envFiles = [
  ".env.production.local",
  ".env.local",
  ".env.production",
  ".env",
];

function parseEnvFile(content) {
  return content
    .split(/\r?\n/)
    .filter((line) => line && !line.trim().startsWith("#"))
    .reduce((accumulator, line) => {
      const separatorIndex = line.indexOf("=");
      if (separatorIndex === -1) {
        return accumulator;
      }

      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");
      accumulator[key] = value;
      return accumulator;
    }, {});
}

async function loadEnv() {
  const values = {};

  for (const filename of envFiles) {
    try {
      const content = await readFile(path.join(projectRoot, filename), "utf8");
      Object.assign(values, parseEnvFile(content));
    } catch {
      // Ignore missing env files.
    }
  }

  return values;
}

function normalizeUrl(url, fallback) {
  const candidate = (url || fallback || "https://example.com").trim();
  const withProtocol = /^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`;
  return withProtocol.replace(/\/+$/, "");
}

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function fetchJson(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function getDynamicEntries(apiBaseUrl) {
  if (!apiBaseUrl) {
    return [];
  }

  const [modelos, anuncios] = await Promise.all([
    fetchJson(`${apiBaseUrl}/api/modelos`),
    fetchJson(`${apiBaseUrl}/api/anuncios`),
  ]);

  const modeloEntries = (modelos?.items || []).map((item) => ({
    path: `/profile/m-${item.id}`,
    lastmod: item.updated_at || item.created_at,
    changefreq: "daily",
    priority: "0.8",
  }));
  const anuncioEntries = (anuncios?.items || []).map((item) => ({
    path: `/profile/a-${item.id}`,
    lastmod: item.updated_at || item.created_at,
    changefreq: "daily",
    priority: "0.8",
  }));

  return [...modeloEntries, ...anuncioEntries];
}

const env = await loadEnv();
const siteUrl = normalizeUrl(process.env.VITE_SITE_URL || process.env.SITE_URL || env.VITE_SITE_URL);
const apiBaseUrl = normalizeUrl(
  process.env.VITE_API_BASE_URL || process.env.API_BASE_URL || env.VITE_API_BASE_URL,
  ""
);
const today = new Date().toISOString().slice(0, 10);

const staticEntries = [
  { path: "/", lastmod: today, changefreq: "daily", priority: "1.0" },
  { path: "/profiles", lastmod: today, changefreq: "daily", priority: "0.9" },
  { path: "/about", lastmod: today, changefreq: "monthly", priority: "0.6" },
  { path: "/safety", lastmod: today, changefreq: "monthly", priority: "0.6" },
  { path: "/contact", lastmod: today, changefreq: "monthly", priority: "0.5" },
];

const dynamicEntries = await getDynamicEntries(apiBaseUrl === "https://example.com" ? "" : apiBaseUrl);
const allEntries = [...staticEntries, ...dynamicEntries];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries
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

Sitemap: ${siteUrl}/sitemap.xml
`;

await mkdir(publicDir, { recursive: true });
await writeFile(path.join(publicDir, "sitemap.xml"), sitemap, "utf8");
await writeFile(path.join(publicDir, "robots.txt"), robots, "utf8");
