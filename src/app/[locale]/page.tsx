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
  // Исправлено: забираем user, так как isAuthenticated нет в типах хука
  const { user } = useAuth()
  const isAuth = !!user 

  const { days } = useDayCounter()
  const [activeSection, setActiveSection] = useState<string | null>(null)
  
  const t = translations[locale as keyof typeof translations] || translations.ru
  
  const randomQuote = useMemo(() => {
    return t.quotes[Math.floor(Math.random() * t.quotes.length)]
  }, [t.quotes])

  return (
    <main className="relative flex flex-col items-center justify-between min-h-screen w-full py-6 px-4 overflow-hidden">
      
      <DynamicBackground />

      {/* ШАПКА */}
      <div className="flex flex-col items-center text-center space-y-4 z-10 mt-4">
        <h1 className="text-2xl md:text-4xl font-black text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] tracking-tighter uppercase">
          {t.title}
        </h1>
        <p className="text-[14px] md:text-lg text-white/80 font-medium italic max-w-[300px] md:max-w-xl">
          {t.subtitle}
        </p>
        <div className="px-6 py-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
          <p className="text-[12px] md:text-sm text-amber-200/90 italic leading-relaxed">
            &ldquo;{randomQuote}&rdquo;
          </p>
        </div>
      </div>

      {/* ЦЕНТР */}
      <div className="flex-1 flex flex-col items-center justify-center w-full relative z-10">
        {isAuth && (
          <div className="mb-8 z-20 scale-110">
            <DayCounter locale={locale} />
          </div>
        )}

        <div className="relative transform scale-[0.85] md:scale-100 transition-all duration-700">
          <IconCircle locale={locale} onSectionClick={setActiveSection} />
        </div>

        {!isAuth && (
          <button 
            onClick={() => setActiveSection('auth')}
            className="mt-8 px-12 py-4 bg-amber-600/30 hover:bg-amber-600/50 backdrop-blur-2xl border-2 border-amber-400/40 text-amber-50 rounded-full font-bold uppercase tracking-widest transition-all active:scale-95 shadow-[0_0_30px_rgba(251,191,36,0.2)]"
          >
            {t.startPath}
          </button>
        )}
      </div>

      {/* ПОДВАЛ */}
      <div className="z-10 pb-4">
        <p className="text-[10px] md:text-xs text-white/40 tracking-[0.2em] uppercase">
          {t.disclaimer}
        </p>
      </div>

      {/* МОДАЛЬНЫЕ ОКНА */}
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