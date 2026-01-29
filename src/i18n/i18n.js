import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ko from './translations/ko.json';
import en from './translations/en.json';

const resources = {
  ko: { translation: ko },
  en: { translation: en }
};

// 로컬 스토리지에서 저장된 언어 가져오기, 없으면 한국어 기본값
const savedLanguage = localStorage.getItem('language') || 'ko';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'ko',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
