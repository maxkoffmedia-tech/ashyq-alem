import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import MainLayout from "@/components/MainLayout";

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  let messages;
  try {
    // Безопасный импорт: пробуем найти папку messages в src
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    // Если по этому пути не нашло, пробуем альтернативный (через алиас @)
    try {
      messages = (await import(`@/messages/${locale}.json`)).default;
    } catch (e2) {
      console.error("Критическая ошибка: Файлы переводов не найдены в src/messages/", e2);
      notFound();
    }
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <MainLayout>
        {children}
      </MainLayout>
    </NextIntlClientProvider>
  );
}