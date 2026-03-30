import MainLayout from "@/components/MainLayout";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function ResourcesPage() {
  const { t } = useTranslation('common');
  return (
    <MainLayout title={t('resources')} background="/images/backgrounds/steppe_day.png">
      <section className="bg-black/40 p-6 rounded-lg max-w-2xl text-center">
        <p>Этот раздел находится в разработке.</p>
      </section>
    </MainLayout>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}