import { getSiteUrl } from "./seo";

export function withPrefilledMessage(baseUrl: string, message: string) {
  try {
    const url = new URL(baseUrl);
    url.searchParams.set("text", message);
    return url.toString();
  } catch {
    return baseUrl;
  }
}

export function getCurrentDomain() {
  if (typeof window !== "undefined" && window.location.hostname) {
    return window.location.hostname;
  }

  try {
    return new URL(getSiteUrl()).hostname;
  } catch {
    return "example.com";
  }
}

export function buildServiceInquiryMessage() {
  return `Hola! te he visto en ${getCurrentDomain()}, me gustaría saber sobre tu servicio`;
}
