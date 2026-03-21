export const SITE_NAME = "Dubai Escorts Ecuador | Putas Prepagos Verificadas";
export const DEFAULT_OG_IMAGE = "/images/logo.png";
export const DEFAULT_TITLE = "Escorts Ecuador | Putas Quito Guayaquil Cuenca | Dubai Prepagos Verificadas";
export const DEFAULT_DESCRIPTION = "Escorts verificadas Ecuador: putas Quito, prepagos Guayaquil, damas Cuenca. Contacto WhatsApp directo Dubai Escorts. Fotos reales, servicios VIP eróticos seguros discretos en todo Ecuador.";

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

  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin.replace(/\/+$/, "");
  }

  return "https://example.com";
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
