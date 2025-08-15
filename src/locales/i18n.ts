import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en";
import vn from "./vn";

// the translations
const resources = {
  en: {
    translation: en,
  },
  vn: {
    translation: vn,
  },
};

// Get saved language from localStorage or default to 'en'
const savedLanguage = localStorage.getItem("language") || "en";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: "en",

    keySeparator: ".", // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
