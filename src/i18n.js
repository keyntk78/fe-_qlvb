import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en.json';
import viTranslation from './locales/vi.json';

// Cấu hình i18n
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslation
    },
    vi: {
      translation: viTranslation
    }
  },
  lng: 'vi', // Ngôn ngữ mặc định
  fallbackLng: 'en', // Ngôn ngữ dự phòng nếu không tìm thấy ngôn ngữ được yêu cầu
  interpolation: {
    escapeValue: false // Cho phép sử dụng các biểu thức trong các chuỗi dịch
  }
});

export default i18n;
