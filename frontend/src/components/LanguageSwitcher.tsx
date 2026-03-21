import { useTranslation } from "react-i18next";
import { AppLanguage, normalizeLanguage } from "../i18n";

const LANGUAGES: AppLanguage[] = ["es", "en"];

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const activeLanguage = normalizeLanguage(i18n.resolvedLanguage);

  const handleLanguageChange = (language: AppLanguage) => {
    if (language === activeLanguage) {
      return;
    }

    void i18n.changeLanguage(language);
  };

  return (
    <div className="notranslate fixed right-4 top-4 z-[140] rounded-full border border-white/15 bg-black/80 p-1 shadow-[0_18px_45px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      <div className="flex items-center gap-1">
        <span className="px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400 sm:px-3">
          {t("language.label")}
        </span>
        {LANGUAGES.map((language) => {
          const isActive = language === activeLanguage;
          return (
            <button
              key={language}
              type="button"
              onClick={() => handleLanguageChange(language)}
              aria-pressed={isActive}
              className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                isActive
                  ? "bg-[#a83d8e] text-white shadow-[0_0_22px_rgba(168,61,142,0.45)]"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {t(`language.short.${language}`)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
