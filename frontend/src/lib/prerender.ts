import { useEffect } from "react";

declare global {
  interface Window {
    __PRERENDER_INJECTED?: {
      prerender?: boolean;
      siteUrl?: string;
    };
  }
}

export function isPrerendering(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return Boolean(window.__PRERENDER_INJECTED?.prerender);
}

export function signalPrerenderReady() {
  if (typeof document === "undefined" || !isPrerendering()) {
    return;
  }

  window.setTimeout(() => {
    document.dispatchEvent(new Event("dubai:prerender-ready"));
  }, 0);
}

export function usePrerenderReady(ready: boolean) {
  useEffect(() => {
    if (!ready) {
      return;
    }

    signalPrerenderReady();
  }, [ready]);
}
