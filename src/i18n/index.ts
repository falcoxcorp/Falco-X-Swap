import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import es from './locales/es.json';
import zh from './locales/zh.json';
import pt from './locales/pt.json';
import ja from './locales/ja.json';
import hi from './locales/hi.json';
import yo from './locales/yo.json';
import el from './locales/el.json';
import fr from './locales/fr.json';
import ru from './locales/ru.json';

export const languages = {
  en: { name: 'English', nativeName: 'English' },
  es: { name: 'Spanish', nativeName: 'Español' },
  zh: { name: 'Chinese', nativeName: '中文' },
  pt: { name: 'Portuguese', nativeName: 'Português' },
  ja: { name: 'Japanese', nativeName: '日本語' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी' },
  yo: { name: 'Yoruba', nativeName: 'Yorùbá' },
  el: { name: 'Greek', nativeName: 'Ελληνικά' },
  fr: { name: 'French', nativeName: 'Français' },
  ru: { name: 'Russian', nativeName: 'Русский' }
};

const savedLanguage = localStorage.getItem('preferred_language');

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      zh: { translation: zh },
      pt: { translation: pt },
      ja: { translation: ja },
      hi: { translation: hi },
      yo: { translation: yo },
      el: { translation: el },
      fr: { translation: fr },
      ru: { translation: ru }
    },
    lng: savedLanguage || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;