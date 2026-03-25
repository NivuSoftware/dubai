import i18n, { getPreferredLanguage } from "../i18n";

export const CONTACT_PHONE_DISPLAY = '+593 0963633858';
export const CONTACT_PHONE_TEL = '+593963633858';
export const CONTACT_WHATSAPP_NUMBER = '593963633858';
export const CONTACT_TELEGRAM_URL = 'https://t.me/DBE593';

export function getContactWhatsAppDefaultMessage() {
  return i18n.t("whatsapp.defaultMessage", {
    lng: getPreferredLanguage(),
  });
}

export function getContactWhatsAppUrl() {
  return `https://wa.me/${CONTACT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    getContactWhatsAppDefaultMessage()
  )}`;
}

export const CONTACT_WHATSAPP_DEFAULT_MESSAGE = getContactWhatsAppDefaultMessage();
export const CONTACT_WHATSAPP_URL = getContactWhatsAppUrl();
