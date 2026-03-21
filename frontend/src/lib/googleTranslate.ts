import { AppLanguage, LANGUAGE_STORAGE_KEY, normalizeLanguage } from "../i18n";

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement?: new (
          options: Record<string, unknown>,
          elementId: string
        ) => unknown;
      };
    };
    googleTranslateElementInit?: () => void;
    __dubaiGoogleTranslateReady?: boolean;
    __dubaiHistoryPatched?: boolean;
  }
}

const GOOGLE_TRANSLATE_COOKIE = "googtrans";
const GOOGLE_TRANSLATE_SCRIPT_ID = "dubai-google-translate-script";
const GOOGLE_TRANSLATE_ELEMENT_ID = "google_translate_element";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function setCookie(name: string, value: string, domain?: string) {
  const parts = [
    `${name}=${value}`,
    "path=/",
    `max-age=${COOKIE_MAX_AGE}`,
    "SameSite=Lax",
  ];

  if (domain) {
    parts.push(`domain=${domain}`);
  }

  document.cookie = parts.join("; ");
}

function syncTranslateCookie(language: AppLanguage) {
  const cookieValue = `/es/${language}`;
  setCookie(GOOGLE_TRANSLATE_COOKIE, cookieValue);

  const hostname = window.location.hostname;
  if (hostname.includes(".")) {
    setCookie(GOOGLE_TRANSLATE_COOKIE, cookieValue, hostname);
    setCookie(GOOGLE_TRANSLATE_COOKIE, cookieValue, `.${hostname}`);
  }
}

function getTranslateSelect() {
  return document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
}

function getActiveTranslateLanguage() {
  const select = getTranslateSelect();
  return normalizeLanguage(select?.value);
}

function dispatchTranslate(language: AppLanguage) {
  const select = getTranslateSelect();
  if (!select) {
    return false;
  }

  if (getActiveTranslateLanguage() === language) {
    return true;
  }

  select.value = language;
  select.dispatchEvent(new Event("change", { bubbles: true }));
  return true;
}

export function getStoredLanguage(): AppLanguage {
  if (typeof window === "undefined") {
    return "es";
  }

  return normalizeLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY));
}

export function applyGoogleTranslateLanguage(language: AppLanguage) {
  if (typeof window === "undefined") {
    return false;
  }

  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  document.documentElement.lang = language;
  syncTranslateCookie(language);
  return dispatchTranslate(language);
}

export function scheduleGoogleTranslate(language: AppLanguage, delays = [0, 250, 900, 1800]) {
  delays.forEach((delay) => {
    window.setTimeout(() => {
      applyGoogleTranslateLanguage(language);
    }, delay);
  });
}

export function ensureGoogleTranslateScript() {
  if (typeof window === "undefined") {
    return;
  }

  if (document.getElementById(GOOGLE_TRANSLATE_SCRIPT_ID)) {
    return;
  }

  window.googleTranslateElementInit = () => {
    if (!window.google?.translate?.TranslateElement) {
      return;
    }

    const host = document.getElementById(GOOGLE_TRANSLATE_ELEMENT_ID);
    if (!host || host.childNodes.length > 0) {
      return;
    }

    new window.google.translate.TranslateElement(
      {
        pageLanguage: "es",
        includedLanguages: "es,en",
        autoDisplay: false,
      },
      GOOGLE_TRANSLATE_ELEMENT_ID
    );

    window.__dubaiGoogleTranslateReady = true;
    scheduleGoogleTranslate(getStoredLanguage(), [150, 700, 1400]);
  };

  const script = document.createElement("script");
  script.id = GOOGLE_TRANSLATE_SCRIPT_ID;
  script.src =
    "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  document.body.appendChild(script);
}

export function subscribeToNavigationChanges(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  if (!window.__dubaiHistoryPatched) {
    const { history } = window;
    const originalPushState = history.pushState.bind(history);
    const originalReplaceState = history.replaceState.bind(history);

    history.pushState = function pushState(...args) {
      const result = originalPushState(...args);
      window.dispatchEvent(new Event("dubai:locationchange"));
      return result;
    };

    history.replaceState = function replaceState(...args) {
      const result = originalReplaceState(...args);
      window.dispatchEvent(new Event("dubai:locationchange"));
      return result;
    };

    window.addEventListener("popstate", () => {
      window.dispatchEvent(new Event("dubai:locationchange"));
    });

    window.__dubaiHistoryPatched = true;
  }

  window.addEventListener("dubai:locationchange", callback);
  return () => {
    window.removeEventListener("dubai:locationchange", callback);
  };
}

function isMeaningfulNode(node: Node) {
  if (node.nodeType === Node.TEXT_NODE) {
    return Boolean(node.textContent?.trim());
  }

  if (!(node instanceof HTMLElement)) {
    return false;
  }

  if (
    node.id === GOOGLE_TRANSLATE_ELEMENT_ID ||
    node.tagName === "SCRIPT" ||
    node.tagName === "STYLE" ||
    node.tagName === "IFRAME"
  ) {
    return false;
  }

  const className = typeof node.className === "string" ? node.className : "";
  return !className.includes("goog-") && !className.includes("skiptranslate");
}

export function observeTranslationTargets(onChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const root = document.getElementById("root");
  if (!root) {
    return () => undefined;
  }

  let debounceTimer = 0;
  const observer = new MutationObserver((mutations) => {
    const shouldRefresh = mutations.some((mutation) =>
      [...mutation.addedNodes, ...mutation.removedNodes].some(isMeaningfulNode)
    );

    if (!shouldRefresh) {
      return;
    }

    window.clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(() => {
      onChange();
    }, 350);
  });

  observer.observe(root, {
    childList: true,
    subtree: true,
  });

  return () => {
    window.clearTimeout(debounceTimer);
    observer.disconnect();
  };
}
