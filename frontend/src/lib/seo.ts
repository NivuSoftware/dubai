export const SITE_NAME = "Dubai Ecuador";
export const DEFAULT_OG_IMAGE = "/images/logo.png";
export const DEFAULT_TITLE = "Dubai Ecuador | Perfiles verificados y anuncios en Ecuador";
export const DEFAULT_DESCRIPTION =
  "Explora perfiles verificados y anuncios activos en Ecuador con contacto directo, información clara y un enfoque en seguridad.";

function ensureProtocol(url: string): string {
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return `https://${url}`;
}

export function getSiteUrl(): string {
  const siteUrl = import.meta.env.VITE_SITE_URL?.trim();

  if (siteUrl) {
    return ensureProtocol(siteUrl).replace(/\/+$/, "");
  }

  if (typeof window !== "undefined" && window.__PRERENDER_INJECTED?.siteUrl) {
    return ensureProtocol(window.__PRERENDER_INJECTED.siteUrl).replace(/\/+$/, "");
  }

  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin.replace(/\/+$/, "");
  }

  return "https://dubaiec.net";
}

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath}`;
}

export function buildPageTitle(title?: string): string {
  if (!title) {
    return DEFAULT_TITLE;
  }

  return title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
}

export function cleanDescription(text: string, maxLength = 160): string {
  const normalized = text.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}
