import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

export const LANGUAGE_STORAGE_KEY = "dubai_site_language";

export type AppLanguage = "es" | "en";

export function normalizeLanguage(value?: string | null): AppLanguage {
  return value === "en" ? "en" : "es";
}

export function getPreferredLanguage(): AppLanguage {
  if (typeof window === "undefined") {
    return "es";
  }

  return normalizeLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY));
}

const resources = {
  es: {
    translation: {
      language: {
        label: "Idioma",
        short: {
          es: "ES",
          en: "EN",
        },
      },
      ageGate: {
        rejectedTitle: "Este sitio web solo esta dirigido a usuarios mayores de 18 anos",
        exit: "Salir",
        brandSubtitle: "Dubai | Escorts Ecuador",
        modalTitle: "Este es un sitio web para adultos",
        modalDescription:
          "Este sitio web contiene material restringido para menores de edad, que incluyen desnudez y representaciones explicitas de actividad sexual. Al entrar, afirma que tiene por lo menos 18 anos de edad o la mayoria de edad en la jurisdiccion desde que esta accediendo al sitio web y que da consentimiento en ver contenido sexualmente explicito.",
        accept: "Tengo 18 anos o mas - Ingresar",
        reject: "Soy menor de 18 anos - Salir",
      },
      whatsapp: {
        defaultMessage: "Hola, quiero mas informacion sobre Dubai",
        inquiry:
          "Hola! te he visto en {{url}}, me gustaria saber sobre tu servicio",
      },
    },
  },
  en: {
    translation: {
      language: {
        label: "Language",
        short: {
          es: "ES",
          en: "EN",
        },
      },
      ageGate: {
        rejectedTitle: "This website is intended only for users over 18 years old",
        exit: "Exit",
        brandSubtitle: "Dubai | Escorts Ecuador",
        modalTitle: "This is an adult website",
        modalDescription:
          "This website contains material restricted to minors, including nudity and explicit depictions of sexual activity. By entering, you confirm that you are at least 18 years old or of legal age in the jurisdiction from which you access this website and that you consent to viewing sexually explicit content.",
        accept: "I am 18 or older - Enter",
        reject: "I am under 18 years old - Exit",
      },
      whatsapp: {
        defaultMessage: "Hi, I want more information about Dubai",
        inquiry:
          "Hi! I found you on {{url}} and I would like to know more about your service",
      },
    },
  },
};

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "es",
    supportedLngs: ["es", "en"],
    load: "languageOnly",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "htmlTag", "navigator"],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      caches: ["localStorage"],
    },
  });

export default i18n;
