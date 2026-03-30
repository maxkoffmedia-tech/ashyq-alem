'use client'

import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import Link from "next/link"

export default function AddictionSlugPage() {
  const params = useParams();
  
  // Безопасно получаем slug как строку
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  // Формируем ключ для перевода (например, "alcohol" -> "Alcohol")
  const translationKey = slug 
    ? slug.charAt(0).toUpperCase() + slug.slice(1) 
    : 'Default';

  const t = useTranslations(translationKey);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-12"
    >
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/resources/addictions" 
          className="text-primary hover:underline mb-8 inline-block"
        >
          ← {useTranslations('Common')('back')}
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
          {t('title')}
        </h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            {t('description')}
          </p>
          
          {/* Здесь можно добавить дополнительный контент из словаря, если он есть */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-4">{t('symptoms_title' as any)}</h2>
            <p>{t('symptoms_text' as any)}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}