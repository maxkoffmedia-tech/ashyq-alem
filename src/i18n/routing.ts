// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ru', 'kz'],
  defaultLocale: 'ru',
  pathnames: {
    '/': '/',
    // если будут другие страницы — добавишь потом
  }
});