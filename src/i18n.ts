import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      dashboard: 'Dashboard',
      scheduler: 'Scheduler',
      users: 'Users',
      reports: 'Reports',
      settings: 'Settings'
    }
  },
  ar: {
    translation: {
      dashboard: 'لوحة القيادة',
      scheduler: 'الجدول الزمني',
      users: 'المستخدمين',
      reports: 'التقارير',
      settings: 'الإعدادات'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;