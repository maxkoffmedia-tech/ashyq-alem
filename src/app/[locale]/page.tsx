'use client'
import { useState, useMemo } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useDayCounter } from '@/hooks/useDayCounter'
import { translations } from '@/i18n/translations'
import IconCircle from '@/components/IconCircle'
import AuthModal from '@/components/AuthModal'
import DayCounter from '@/components/DayCounter'
import MapSection from '@/components/MapSection'
import PathSection from '@/components/PathSection'
import TreeSection from '@/components/TreeSection'
import AksakalSection from '@/components/AksakalSection'
import AoulSection from '@/components/AoulSection'
import TrialSection from '@/components/TrialSection'

export default function LocalePage({ params: { locale } }: { params: { locale: string } }) {
  const { isAuthenticated } = useAuth()
  const { days } = useDayCounter()
  const [activeSection, setActiveSection] = useState<string | null>(null)
  
  // Берем переводы строго по твоему файлу
  const t = translations[locale as keyof typeof translations] || translations.ru
  
  // Выбираем случайную цитату, чтобы не менялась при каждом рендере
  const randomQuote = useMemo(() => {
    return t.quotes[Math.floor(Math.random() * t.quotes.length)]
  }, [t.quotes])

  return (
    <main className="relative flex flex-col items-center justify-between h-full w-full py-4 px-4 overflow-hidden">
      
      {/* 1. ВЕРХНЯЯ ЗОНА (Заголовок и Цитата) */}
      <div className="flex flex-col items-center text-center space-y-3 z-10 mt-2">
        <h1 className="text-xl md:text-3xl font-bold text-white drop-shadow-2xl tracking-wide uppercase">
          {t.title}
        </h1>
        <p className="text-[13px] md:text-base text-white/70 font-medium italic max-w-[280px] md:max-w-md">
          {t.subtitle}
        </p>
        <div className="px-5 py-2 bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl">
          <p className="text-[11px] md:text-sm text-amber-200/90 italic leading-tight">
            &ldquo;{randomQuote}&rdquo;
          </p>
        </div>
      </div>

      {/* 2. СРЕДНЯЯ ЗОНА (Центральный хаб) */}
      <div className="flex-1 flex flex-col items-center justify-center w-full relative -mt-4">
        {/* Счетчик дней теперь компактная таблетка СВЕРХУ над кругом */}
        {isAuthenticated && (
          <div className="mb-6 z-20">
            <DayCounter locale={locale} />
          </div>
        )}

        {/* Круг иконок */}
        <div className="relative transform scale-[0.82] md:scale-100 transition-transform duration-500">
          <IconCircle locale={locale} onSectionClick={setActiveSection} />
        </div>

        {/* Кнопка старта для новых */}
        {!isAuthenticated && (
          <button 
            onClick={() => setActiveSection('auth')}
            className="mt-6 px-10 py-3 bg-amber-600/20 hover:bg-amber-600/40 backdrop-blur-xl border border-amber-400/30 text-amber-50 rounded-full transition-all active:scale-95 shadow-lg"
          >
            🏕️ Начать путь
          </button>
        )}
      </div>

      {/* 3. НИЖНЯЯ ЗОНА (Пустое пространство для баланса над футером) */}
      <div className="h-4 w-full flex-none" />

      {/* ОВЕРЛЕИ (Секции открываются поверх всего) */}
      {activeSection === 'auth' && <AuthModal locale={locale} onClose={() => setActiveSection(null)} />}
      {activeSection === 'map' && <MapSection locale={locale} onClose={() => setActiveSection(null)} />}
      {activeSection === 'path' && <PathSection locale={locale} onClose={() => setActiveSection(null)} />}
      {activeSection === 'tree' && <TreeSection locale={locale} onClose={() => setActiveSection(null)} />}
      {activeSection === 'mentor' && <AksakalSection locale={locale} onClose={() => setActiveSection(null)} />}
      {activeSection === 'community' && <AoulSection locale={locale} onClose={() => setActiveSection(null)} />}
      {activeSection === 'trials' && <TrialSection locale={locale} onClose={() => setActiveSection(null)} />}
    </main>
  )
}