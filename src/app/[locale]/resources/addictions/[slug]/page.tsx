'use client'

import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

export default function AddictionSlugPage() {
  const params = useParams();
  // Гарантируем, что slug — это строка, а не массив
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  // Если slug пустой (на всякий случай), задаем дефолтное значение, чтобы useTranslations не упал
  const translationKey = slug 
    ? slug.charAt(0).toUpperCase() + slug.slice(1) 
    : 'Default';

  const t = useTranslations(translationKey);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-10"
    >
      <h1 className="text-4xl font-bold mb-6">{t('title')}</h1>
      <div className="prose prose-invert max-w-none">
        <p className="text-xl text-gray-300">{t('description')}</p>
        {/* Здесь остальной твой контент страницы */}
      </div>
    </motion.div>
  )
}