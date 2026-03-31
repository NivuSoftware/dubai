import { useLayoutEffect } from "react";
import {
  absoluteUrl,
  buildPageTitle,
  cleanDescription,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
} from "../lib/seo";

type JsonLd = Record<string, unknown> | Array<Record<string, unknown>>;

interface SeoProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: string;
  robots?: string;
  jsonLd?: JsonLd;
}

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
}

function upsertLink(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector(selector) as HTMLLinkElement | null;

  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
}

export default function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = DEFAULT_OG_IMAGE,
  type = "website",
  robots = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  jsonLd,
}: SeoProps) {
  const canonicalUrl = absoluteUrl(path);
  const ogImage = absoluteUrl(image);
  const resolvedTitle = buildPageTitle(title);
  const resolvedDescription = cleanDescription(description);

  useLayoutEffect(() => {
    document.title = resolvedTitle;

    upsertMeta('meta[name="description"]', {
      name: "description",
      content: resolvedDescription,
    });
    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: robots,
    });
    upsertMeta('meta[name="googlebot"]', {
      name: "googlebot",
      content: robots,
    });
    upsertMeta('meta[property="og:site_name"]', {
      property: "og:site_name",
      content: "Dubai Ecuador",
    });
    upsertMeta('meta[property="og:type"]', {
      property: "og:type",
      content: type,
    });
    upsertMeta('meta[property="og:title"]', {
      property: "og:title",
      content: resolvedTitle,
    });
    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: resolvedDescription,
    });
    upsertMeta('meta[property="og:url"]', {
      property: "og:url",
      content: canonicalUrl,
    });
    upsertMeta('meta[property="og:image"]', {
      property: "og:image",
      content: ogImage,
    });
    upsertMeta('meta[property="og:image:alt"]', {
      property: "og:image:alt",
      content: resolvedTitle,
    });
    upsertMeta('meta[property="og:locale"]', {
      property: "og:locale",
      content: "es_EC",
    });
    upsertMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });
    upsertMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: resolvedTitle,
    });
    upsertMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: resolvedDescription,
    });
    upsertMeta('meta[name="twitter:image"]', {
      name: "twitter:image",
      content: ogImage,
    });
    upsertMeta('meta[name="twitter:image:alt"]', {
      name: "twitter:image:alt",
      content: resolvedTitle,
    });
    upsertLink('link[rel="canonical"]', {
      rel: "canonical",
      href: canonicalUrl,
    });

    const scriptId = "seo-json-ld";
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = scriptId;
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [canonicalUrl, jsonLd, ogImage, resolvedDescription, resolvedTitle, robots, type]);

  return null;
}
