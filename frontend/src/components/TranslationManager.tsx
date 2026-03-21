import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AppLanguage, normalizeLanguage } from "../i18n";
import {
  ensureGoogleTranslateScript,
  observeTranslationTargets,
  scheduleGoogleTranslate,
  subscribeToNavigationChanges,
} from "../lib/googleTranslate";

function getLanguage(value?: string): AppLanguage {
  return normalizeLanguage(value);
}

export default function TranslationManager() {
  const { i18n } = useTranslation();
  const language = getLanguage(i18n.resolvedLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    ensureGoogleTranslateScript();
    scheduleGoogleTranslate(language, [50, 500, 1200]);
  }, [language]);

  useEffect(() => {
    return subscribeToNavigationChanges(() => {
      scheduleGoogleTranslate(getLanguage(i18n.resolvedLanguage), [120, 700, 1800]);
    });
  }, [i18n.resolvedLanguage]);

  useEffect(() => {
    return observeTranslationTargets(() => {
      if (getLanguage(i18n.resolvedLanguage) === "en") {
        scheduleGoogleTranslate("en", [150, 900]);
      }
    });
  }, [i18n.resolvedLanguage]);

  return <div id="google_translate_element" className="hidden skiptranslate" aria-hidden="true" />;
}
