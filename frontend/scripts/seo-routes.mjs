import { readFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const envFiles = [
  ".env.production.local",
  ".env.local",
  ".env.production",
  ".env",
];

export const STATIC_SEO_ENTRIES = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/profiles", changefreq: "daily", priority: "0.9" },
  { path: "/about", changefreq: "monthly", priority: "0.6" },
  { path: "/safety", changefreq: "monthly", priority: "0.6" },
  { path: "/contact", changefreq: "monthly", priority: "0.5" },
  { path: "/registro-anunciante", changefreq: "weekly", priority: "0.4" },
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

export async function loadEnv() {
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

export function normalizeUrl(url, fallback) {
  const candidate = (url || fallback || "https://dubaiec.net").trim();

  if (!candidate) {
    return "";
  }

  const withProtocol = /^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`;
  return withProtocol.replace(/\/+$/, "");
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

function buildDynamicEntry(prefix, item) {
  return {
    path: `/profile/${prefix}-${item.id}`,
    lastmod: item.updated_at || item.created_at,
    changefreq: "daily",
    priority: "0.8",
  };
}

export async function getDynamicEntries(apiBaseUrl) {
  if (!apiBaseUrl) {
    return [];
  }

  const [modelos, anuncios] = await Promise.all([
    fetchJson(`${apiBaseUrl}/api/modelos`),
    fetchJson(`${apiBaseUrl}/api/anuncios`),
  ]);

  if (!modelos) {
    console.warn(`[seo] No se pudieron obtener modelos desde ${apiBaseUrl}/api/modelos`);
  }

  if (!anuncios) {
    console.warn(`[seo] No se pudieron obtener anuncios desde ${apiBaseUrl}/api/anuncios`);
  }

  const modeloEntries = (modelos?.items || []).map((item) => buildDynamicEntry("m", item));
  const anuncioEntries = (anuncios?.items || []).map((item) => buildDynamicEntry("a", item));

  return [...modeloEntries, ...anuncioEntries];
}

function dedupeEntries(entries) {
  return Array.from(
    entries.reduce((accumulator, entry) => {
      accumulator.set(entry.path, entry);
      return accumulator;
    }, new Map()).values()
  );
}

export async function getSeoEntries() {
  const env = await loadEnv();
  const siteUrl = normalizeUrl(
    process.env.VITE_SITE_URL || process.env.SITE_URL || env.VITE_SITE_URL,
    "https://dubaiec.net"
  );
  const apiBaseUrl = normalizeUrl(
    process.env.VITE_API_BASE_URL || process.env.API_BASE_URL || env.VITE_API_BASE_URL,
    ""
  );
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")}`;

  const staticEntries = STATIC_SEO_ENTRIES.map((entry) => ({
    ...entry,
    lastmod: today,
  }));
  const dynamicEntries = await getDynamicEntries(apiBaseUrl);

  return {
    apiBaseUrl,
    siteUrl,
    today,
    entries: dedupeEntries([...staticEntries, ...dynamicEntries]),
  };
}

export async function getPrerenderRoutes() {
  const { entries } = await getSeoEntries();
  return entries.map((entry) => entry.path);
}
