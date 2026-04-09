export const SITE_NAME = "Dubai Escorts Ecuador";
export const DEFAULT_OG_IMAGE = "/images/logo.png";
export const DEFAULT_TITLE = "Dubai Escorts Ecuador | Prepagos y acompañantes verificadas en Quito y Guayaquil";
export const DEFAULT_DESCRIPTION =
  "Dubai Escorts Ecuador — Directorio de prepagos, escorts y acompañantes verificadas en Quito, Guayaquil y Cuenca. Perfiles reales con contacto directo por WhatsApp. Discreción garantizada.";

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
