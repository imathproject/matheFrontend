import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslation from './locales/en.json';

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      }
    },
    partialBundledLanguages: true,
    supportedLngs: ['en', 'pt'],
    fallbackLng: 'en',
    debug: true,
    backend: {
      loadPath: `${process.env.PUBLIC_URL || ''}/locales/{{lng}}/{{ns}}.json`,
    },
    interpolation: {
      escapeValue: false, // React already does escaping
    }
  });

export default i18n;
