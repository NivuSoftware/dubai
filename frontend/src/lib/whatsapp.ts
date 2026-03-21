import { absoluteUrl } from "./seo";

function normalizeWhatsAppUrl(rawUrl: string) {
  const value = rawUrl.trim();

  if (!value) {
    return "";
  }

  if (/^https?:\/\/(wa\.me|api\.whatsapp\.com)\//i.test(value)) {
    return value;
  }

  if (/^(wa\.me|api\.whatsapp\.com\/)/i.test(value)) {
    return `https://${value.replace(/^\/+/, "")}`;
  }

  const digits = value.replace(/\D/g, "");
  if (digits.length >= 8) {
    return `https://wa.me/${digits}`;
  }

  return value;
}

export function withPrefilledMessage(baseUrl: string, message: string) {
  const normalizedBaseUrl = normalizeWhatsAppUrl(baseUrl);

  try {
    const url = new URL(normalizedBaseUrl);
    url.searchParams.set("text", message);
    return url.toString();
  } catch {
    return normalizedBaseUrl;
  }
}

export function getCurrentPageUrl(pageUrl?: string) {
  if (pageUrl) {
    if (/^https?:\/\//i.test(pageUrl)) {
      return pageUrl;
    }

    return absoluteUrl(pageUrl);
  }

  if (typeof window !== "undefined" && window.location.href) {
    return window.location.href;
  }

  return absoluteUrl("/");
}

export function buildServiceInquiryMessage(pageUrl?: string) {
  return `Hola! te he visto en ${getCurrentPageUrl(pageUrl)}, me gustaría saber sobre tu servicio`;
}
