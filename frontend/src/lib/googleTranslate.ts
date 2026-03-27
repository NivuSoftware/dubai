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
const DEFAULT_TRANSLATE_DELAYS = [0, 250, 900, 1800];
const TRANSLATE_SELECT_TIMEOUT_MS = 10_000;
const TRANSLATE_SELECT_POLL_MS = 150;

let googleTranslateScriptPromise: Promise<void> | null = null;
let googleTranslateReadyPromise: Promise<void> | null = null;
let resolveGoogleTranslateReady: (() => void) | null = null;
let latestRequestedLanguage: AppLanguage = "es";

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

function getGoogleTranslateReadyPromise() {
  if (window.__dubaiGoogleTranslateReady) {
    return Promise.resolve();
  }

  if (!googleTranslateReadyPromise) {
    googleTranslateReadyPromise = new Promise<void>((resolve) => {
      resolveGoogleTranslateReady = resolve;
    });
  }

  return googleTranslateReadyPromise;
}

function markGoogleTranslateReady() {
  window.__dubaiGoogleTranslateReady = true;
  resolveGoogleTranslateReady?.();
  resolveGoogleTranslateReady = null;
  googleTranslateReadyPromise = Promise.resolve();
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

  const targetValue =
    language === "es" && !select.querySelector('option[value="es"]') ? "" : language;

  if (getActiveTranslateLanguage() === language) {
    return true;
  }

  select.value = targetValue;
  select.dispatchEvent(new Event("change", { bubbles: true }));
  return true;
}

function initializeGoogleTranslateElement() {
  if (!window.google?.translate?.TranslateElement) {
    return false;
  }

  const host = document.getElementById(GOOGLE_TRANSLATE_ELEMENT_ID);
  if (!host) {
    return false;
  }

  if (!getTranslateSelect()) {
    host.replaceChildren();

    new window.google.translate.TranslateElement(
      {
        pageLanguage: "es",
        includedLanguages: "es,en",
        autoDisplay: false,
      },
      GOOGLE_TRANSLATE_ELEMENT_ID
    );
  }

  markGoogleTranslateReady();
  return true;
}

async function waitForTranslateSelect(timeoutMs = TRANSLATE_SELECT_TIMEOUT_MS) {
  const startedAt = window.performance.now();

  while (window.performance.now() - startedAt < timeoutMs) {
    const select = getTranslateSelect();
    if (select) {
      return select;
    }

    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, TRANSLATE_SELECT_POLL_MS);
    });
  }

  return null;
}

export function getStoredLanguage(): AppLanguage {
  if (typeof window === "undefined") {
    return "es";
  }

  return normalizeLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY));
}

export async function applyGoogleTranslateLanguage(language: AppLanguage) {
  if (typeof window === "undefined") {
    return false;
  }

  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  document.documentElement.lang = language;
  syncTranslateCookie(language);
  await ensureGoogleTranslateScript();

  const select = await waitForTranslateSelect();
  if (!select || latestRequestedLanguage !== language) {
    return false;
  }

  return dispatchTranslate(language);
}

export function scheduleGoogleTranslate(
  language: AppLanguage,
  delays = DEFAULT_TRANSLATE_DELAYS
) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  latestRequestedLanguage = language;

  const timerIds = delays.map((delay) =>
    window.setTimeout(() => {
      void applyGoogleTranslateLanguage(language);
    }, delay)
  );

  return () => {
    timerIds.forEach((timerId) => {
      window.clearTimeout(timerId);
    });
  };
}

export function ensureGoogleTranslateScript() {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  window.googleTranslateElementInit = () => {
    if (!initializeGoogleTranslateElement()) {
      return;
    }

    scheduleGoogleTranslate(getStoredLanguage(), [150, 700, 1400]);
  };

  if (initializeGoogleTranslateElement()) {
    return Promise.resolve();
  }

  if (googleTranslateScriptPromise) {
    return googleTranslateScriptPromise;
  }

  const existingScript = document.getElementById(
    GOOGLE_TRANSLATE_SCRIPT_ID
  ) as HTMLScriptElement | null;
  if (existingScript) {
    googleTranslateScriptPromise = Promise.race([
      getGoogleTranslateReadyPromise(),
      new Promise<void>((resolve) => {
        window.setTimeout(resolve, TRANSLATE_SELECT_TIMEOUT_MS);
      }),
    ]);

    if (window.google?.translate?.TranslateElement) {
      window.googleTranslateElementInit?.();
    } else {
      existingScript.addEventListener("load", window.googleTranslateElementInit, { once: true });
    }

    return googleTranslateScriptPromise;
  }

  googleTranslateScriptPromise = new Promise<void>((resolve) => {
    const script = document.createElement("script");
    script.id = GOOGLE_TRANSLATE_SCRIPT_ID;
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.googleTranslateElementInit?.();
    };
    script.onerror = () => {
      googleTranslateScriptPromise = null;
      resolve();
    };
    document.body.appendChild(script);

    void getGoogleTranslateReadyPromise().then(resolve);
  });

  return googleTranslateScriptPromise;
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
