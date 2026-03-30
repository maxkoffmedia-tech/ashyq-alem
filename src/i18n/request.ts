// src/i18n/request.ts — НОВАЯ РАБОЧАЯ ВЕРСИЯ БЕЗ notFound()
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  // Больше НЕ используем параметр {locale} и НЕ делаем notFound()
  // Просто всегда возвращаем русский по умолчанию
  // (потом добавим переключение, но сейчас — главное, чтобы сайт жил)

  return {
    messages: (await import('../messages/ru.json')).default,
    timeZone: 'Asia/Almaty',
  };
});