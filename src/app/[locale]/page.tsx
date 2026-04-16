'use client'
import { useState, useMemo, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { translations } from '@/i18n/translations'
import IconCircle from '@/components/IconCircle'
import AuthModal from '@/components/AuthModal'
import DayCounter from '@/components/DayCounter'
import JarvisGreeting from '@/components/JarvisGreeting'
import MapSection from '@/components/MapSection'
import PathSection from '@/components/PathSection'
import TreeSection from '@/components/TreeSection'
import AksakalSection from '@/components/AksakalSection'
import AoulSection from '@/components/AoulSection'
import TrialSection from '@/components/TrialSection'
import MusicToggle from '@/components/MusicToggle'

export default function LocalePage({ params }: { params: { locale: string } }) {
  const { user, register, resetPath } = useAuth()
  const currentLocale = params.locale as 'ru' | 'kz'
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => { setMounted(true) }, [])

  const t = translations[currentLocale] || translations.ru
  const randomQuote = useMemo(() => {
    if (!mounted) return ''
    const quotes = t.quotes || []
    return quotes[Math.floor(Math.random() * quotes.length)] || ''
  }, [t.quotes, mounted])

  function switchLocale(locale: 'ru' | 'kz') {
    if (locale === currentLocale) return
    const newPath = pathname.replace(/^\/(ru|kz)/, `/${locale}`)
    router.push(newPath)
  }

  if (!mounted) return null

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box', overflow: 'hidden' }}>

      {/* RUS/КАЗ + Music — поверх всего */}
      {!activeSection && (
        <div style={{ position: 'absolute', top: '8px', right: '12px', zIndex: 50, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.40)', backdropFilter: 'blur(8px)', borderRadius: '20px', padding: '4px 6px', border: '1px solid rgba(255,255,255,0.12)' }}>
            {(['ru', 'kz'] as const).map(loc => (
              <button key={loc} onClick={() => switchLocale(loc)}
                style={{ padding: '4px 10px', borderRadius: '14px', border: 'none', cursor: loc === currentLocale ? 'default' : 'pointer', fontSize: '12px', fontWeight: loc === currentLocale ? 700 : 400, textTransform: 'uppercase', letterSpacing: '0.05em', background: loc === currentLocale ? 'rgba(255,220,100,0.85)' : 'transparent', color: loc === currentLocale ? '#3d2500' : 'rgba(255,255,255,0.70)', transition: 'all 0.2s', fontFamily: 'inherit' }}>
                {loc === 'ru' ? 'РУС' : 'ҚАЗ'}
              </button>
            ))}
          </div>
          <MusicToggle />
        </div>
      )}

      {/* Ақсақал */}
      <JarvisGreeting user={user} locale={currentLocale} onOpenSection={setActiveSection} onRegister={() => setActiveSection('auth')} />

      {/* Секции */}
      {activeSection === 'auth' && (
        <AuthModal locale={currentLocale} onClose={() => setActiveSection(null)} onRegister={(name, type, loc, date) => { register(name, type, loc, date); setActiveSection(null) }} />
      )}
      {activeSection === 'path' && user && (
        <PathSection user={user} locale={currentLocale} onBack={() => setActiveSection(null)} onResetPath={resetPath} />
      )}
      {activeSection === 'map' && (
        <MapSection locale={currentLocale} onBack={() => setActiveSection(null)} />
      )}
      {activeSection === 'tree' && user && (
        <TreeSection user={user} locale={currentLocale} onBack={() => setActiveSection(null)} />
      )}
      {activeSection === 'mentor' && user && (
        <AksakalSection user={user} locale={currentLocale} onBack={() => setActiveSection(null)} />
      )}
      {activeSection === 'community' && user && (
        <AoulSection user={user} locale={currentLocale} onBack={() => setActiveSection(null)} />
      )}
      {activeSection === 'trials' && user && (
        <TrialSection user={user} locale={currentLocale} onBack={() => setActiveSection(null)} />
      )}

      {/* ВЕРХНИЙ БЛОК — заголовок */}
      <div style={{ textAlign: 'center', flexShrink: 0, paddingTop: '44px', paddingLeft: '16px', paddingRight: '16px' }}>
        <div style={{ fontSize: '9px', letterSpacing: '0.4em', color: 'rgba(255,200,60,0.55)', textTransform: 'uppercase', marginBottom: '2px' }}>
          {currentLocale === 'kz' ? '\u2756 \u04b0\u043b\u044b \u0414\u0430\u043b\u0430 \u2756' : '\u2756 \u0412\u0435\u043b\u0438\u043a\u0430\u044f \u0421\u0442\u0435\u043f\u044c \u2756'}
        </div>
        <h1 style={{ margin: '0 0 2px', fontSize: 'clamp(1.6rem, 5vw, 2.2rem)', fontWeight: 900, background: 'linear-gradient(180deg,#fff 0%,#ffd060 60%,#f4a230 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '0.04em', textTransform: 'uppercase', lineHeight: 1.1 }}>
          {'\u04b0\u043b\u044b \u0414\u0430\u043b\u0430 \u0416\u043e\u043b\u044b'}
        </h1>
        <p style={{ margin: '0 0 6px', fontSize: 'clamp(0.6rem, 1.5vw, 0.72rem)', color: 'rgba(255,235,180,0.45)', letterSpacing: '0.06em' }}>
          {currentLocale === 'kz' ? '\u0422\u04d9\u0443\u0435\u043b\u0434\u0456\u043b\u0456\u043a\u0442\u0435\u043d \u0430\u0437\u0430\u0442\u0442\u044b\u049b \u0436\u043e\u043b\u044b' : '\u041f\u0443\u0442\u044c \u043e\u0441\u0432\u043e\u0431\u043e\u0436\u0434\u0435\u043d\u0438\u044f \u043e\u0442 \u0437\u0430\u0432\u0438\u0441\u0438\u043c\u043e\u0441\u0442\u0438'}
        </p>

        {/* Цитата */}
        <div style={{ display: 'inline-block', padding: '5px 14px', background: 'rgba(0,0,0,0.28)', backdropFilter: 'blur(8px)', borderRadius: '18px', border: '1px solid rgba(255,200,60,0.12)', maxWidth: '320px' }}>
          <p style={{ margin: 0, fontStyle: 'italic', fontSize: 'clamp(0.70rem, 1.8vw, 0.86rem)', color: 'rgba(255,228,140,0.80)', lineHeight: 1.4 }}>
            {'\u00ab'}{randomQuote}{'\u00bb'}
          </p>
          <p style={{ margin: '1px 0 0', fontSize: '8px', color: 'rgba(255,200,60,0.40)', textAlign: 'right', letterSpacing: '0.08em' }}>
            {'\u2014'} {'\u0410\u0431\u0430\u0439 \u049a\u04b1\u043d\u0430\u043d\u0431\u0430\u0435\u0432'}
          </p>
        </div>
      </div>

      {/* СЧЁТЧИК ДНЕЙ */}
      <div style={{ flexShrink: 0, marginTop: '8px' }}>
        {user ? (
          <DayCounter locale={currentLocale} />
        ) : (
          <button onClick={() => setActiveSection('auth')}
            style={{ padding: '10px 28px', borderRadius: '26px', border: '1px solid rgba(255,200,60,0.35)', background: 'rgba(255,180,30,0.10)', backdropFilter: 'blur(12px)', color: 'rgba(255,220,100,1)', fontSize: '13px', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'inherit' }}>
            {currentLocale === 'kz' ? '\u2694\ufe0f \u0416\u043e\u043b\u0434\u044b \u0431\u0430\u0441\u0442\u0430\u0443' : '\u2694\ufe0f \u041d\u0430\u0447\u0430\u0442\u044c \u043f\u0443\u0442\u044c'}
          </button>
        )}
      </div>

      {/* ИКОНКИ — занимают оставшееся место */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: 0 }}>
        <IconCircle locale={currentLocale} onSectionClick={setActiveSection} />
      </div>

      {/* ФУТЕР */}
      <div style={{ flexShrink: 0, textAlign: 'center', padding: '4px 16px 6px' }}>
        <p style={{ margin: 0, fontSize: '9px', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          {'\u04b0\u043b\u044b \u0414\u0430\u043b\u0430 \u0416\u043e\u043b\u044b \u00a9 2026 \u00b7 \u041d\u0435 \u044f\u0432\u043b\u044f\u0435\u0442\u0441\u044f \u043c\u0435\u0434\u0438\u0446\u0438\u043d\u0441\u043a\u043e\u0439 \u0443\u0441\u043b\u0443\u0433\u043e\u0439'}
        </p>
      </div>
    </div>
  )
}