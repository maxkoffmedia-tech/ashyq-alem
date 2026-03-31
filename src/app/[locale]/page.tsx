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
import DynamicBackground from '@/components/DynamicBackground'

export default function LocalePage({ params: { locale } }: { params: { locale: string } }) {
  const { user } = useAuth()
  const isAuth = Boolean(user)
  
  const currentLocale = locale as "ru" | "kz"
  const { days } = useDayCounter((user as any)?.startDate || '') 
  
  const [activeSection, setActiveSection] = useState<string | null>(null)
  
  const t = translations[currentLocale] || translations.ru
  
  const randomQuote = useMemo(() => {
    return t.quotes[Math.floor(Math.random() * t.quotes.length)]
  }, [t.quotes])

  return (
    <main className="relative flex flex-col items-center justify-between min-h-screen w-full py-6 px-4 overflow-hidden">
      
      <DynamicBackground />

      <div className="flex flex-col items-center text-center space-y-4 z-10 mt-4">
        <h1 className="text-4xl font-black text-red-500 z-50">
  HELLO: {t.title}
</h1>
        <p className="text-[14px] md:text-lg text-white/80 font-medium italic max-w-[300px] md:max-w-xl text-center">
          {t.subtitle}
        </p>
        <div className="px-6 py-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl max-w-[90%]">
          <p className="text-[12px] md:text-sm text-amber-200/90 italic leading-relaxed text-center">
            &ldquo;{randomQuote}&rdquo;
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full relative z-10">
        {isAuth && (
          <div className="mb-8 z-20 scale-110">
            <DayCounter locale={currentLocale} />
          </div>
        )}

        <div className="relative transform scale-[0.85] md:scale-100 transition-all duration-700">
          <IconCircle locale={currentLocale} onSectionClick={setActiveSection} />
        </div>

        {!isAuth && (
          <button 
            onClick={() => setActiveSection('auth')}
            className="mt-8 px-12 py-4 bg-amber-600/30 hover:bg-amber-600/50 backdrop-blur-2xl border-2 border-amber-400/40 text-amber-50 rounded-full font-bold uppercase tracking-widest transition-all active:scale-95 shadow-[0_0_30px_rgba(251,191,36,0.2)]"
          >
            {t.startPath || 'Начать путь'}
          </button>
        )}
      </div>

      <div className="z-10 pb-4 text-center">
        <p className="text-[10px] md:text-xs text-white/40 tracking-[0.2em] uppercase">
          {t.disclaimer}
        </p>
      </div>

      {/* МОДАЛКИ С ОБХОДОМ СТРОГИХ ТИПОВ ДЛЯ СКОРОСТИ ДЕПЛОЯ */}
      {activeSection === 'auth' && (
        <AuthModal 
          locale={currentLocale} 
          onClose={() => setActiveSection(null)} 
          onRegister={() => setActiveSection(null)}
        />
      )}
      
      {activeSection === 'map' && <MapSection locale={currentLocale} {...({ onClose: () => setActiveSection(null) } as any)} />}
      {activeSection === 'path' && <PathSection locale={currentLocale} {...({ onClose: () => setActiveSection(null) } as any)} />}
      {activeSection === 'tree' && <TreeSection locale={currentLocale} {...({ onClose: () => setActiveSection(null) } as any)} />}
      {activeSection === 'mentor' && <AksakalSection locale={currentLocale} {...({ onClose: () => setActiveSection(null) } as any)} />}
      {activeSection === 'community' && <AoulSection locale={currentLocale} {...({ onClose: () => setActiveSection(null) } as any)} />}
      {activeSection === 'trials' && <TrialSection locale={currentLocale} {...({ onClose: () => setActiveSection(null) } as any)} />}
    </main>
  )
}