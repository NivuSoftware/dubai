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
    void ensureGoogleTranslateScript();
    const cancelScheduledTranslation = scheduleGoogleTranslate(language, [0, 400, 1200]);

    return () => {
      cancelScheduledTranslation();
    };
  }, [language]);

  useEffect(() => {
    let cancelScheduledTranslation = () => undefined;

    const unsubscribe = subscribeToNavigationChanges(() => {
      cancelScheduledTranslation();
      cancelScheduledTranslation = scheduleGoogleTranslate(
        getLanguage(i18n.resolvedLanguage),
        [120, 700, 1800]
      );
    });

    return () => {
      cancelScheduledTranslation();
      unsubscribe();
    };
  }, [i18n.resolvedLanguage]);

  useEffect(() => {
    let cancelScheduledTranslation = () => undefined;

    const unsubscribe = observeTranslationTargets(() => {
      if (getLanguage(i18n.resolvedLanguage) === "en") {
        cancelScheduledTranslation();
        cancelScheduledTranslation = scheduleGoogleTranslate("en", [150, 900]);
      }
    });

    return () => {
      cancelScheduledTranslation();
      unsubscribe();
    };
  }, [i18n.resolvedLanguage]);

  return <div id="google_translate_element" className="hidden skiptranslate" aria-hidden="true" />;
}
