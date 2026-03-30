'use client'

import { useEffect, useState, useCallback } from 'react'
import IconCircle from '@/components/IconCircle'
import AuthModal from '@/components/AuthModal'
import DayCounter from '@/components/DayCounter'
import MapSection from '@/components/MapSection'
import PathSection from '@/components/PathSection'
import TreeSection from '@/components/TreeSection'
import AksakalSection from '@/components/AksakalSection'
import AoulSection from '@/components/AoulSection'
import TrialSection from '@/components/TrialSection'
import { useAuth } from '@/hooks/useAuth'
import TotemSpirit from '@/components/TotemSpirit'
import { translations, type Locale } from '@/i18n/translations'

type ActiveSection = 'map' | 'path' | 'tree' | 'mentor' | 'aoul' | 'trial' | null

export default function LocalePage({ params }: { params: { locale: string } }) {
  const locale: Locale = params.locale === 'kz' ? 'kz' : 'ru'
  const t = translations[locale]

  const { user, loading, register, resetPath } = useAuth()
  const [showAuth, setShowAuth] = useState(false)
  const [activeSection, setActiveSection] = useState<ActiveSection>(null)
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [quoteFade, setQuoteFade] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteFade(false)
      setTimeout(() => {
        setQuoteIndex(v => (v + 1) % t.quotes.length)
        setQuoteFade(true)
      }, 450)
    }, 9000)
    return () => clearInterval(interval)
  }, [t.quotes.length])

  const handleSectionClick = useCallback((sectionId: string) => {
    // Карта — открыта всем
    if (sectionId === 'map') { setActiveSection('map'); return }
    // Остальные — требуют авторизации
    if (!user) { setShowAuth(true); return }
    setActiveSection(sectionId as ActiveSection)
  }, [user])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActiveSection(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (loading) return null

  return (
    <>
      {/* ══ ТОТЕМ — дух-хранитель, всегда в углу ══ */}
      {activeSection === null && (
        <TotemSpirit
          user={user}
          locale={locale}
          onOpenSection={(section) => handleSectionClick(section)}
          onRegister={() => setShowAuth(true)}
        />
      )}

      {/* ══ ОВЕРЛЕИ z:50 — не влияют на поток хаба ══ */}

      {showAuth && (
        <AuthModal
          locale={locale}
          onRegister={(name, type, loc, date) => {
            register(name, type, loc, date)
            setShowAuth(false)
          }}
          onClose={() => setShowAuth(false)}
        />
      )}

      {/* Карта */}
      {activeSection === 'map' && (
        <MapSection
          locale={locale}
          onClose={() => setActiveSection(null)}
        />
      )}

      {/* Путь */}
      {activeSection === 'path' && user && (
        <PathSection
          user={user}
          locale={locale}
          onBack={() => setActiveSection(null)}
          onResetPath={() => { resetPath(); setActiveSection(null) }}
        />
      )}

      {/* Древо */}
      {activeSection === 'tree' && user && (
        <TreeSection
          user={user}
          locale={locale}
          onBack={() => setActiveSection(null)}
        />
      )}

      {/* Ақсақал */}
      {activeSection === 'mentor' && user && (
        <AksakalSection
          user={user}
          locale={locale}
          onBack={() => setActiveSection(null)}
        />
      )}

      {/* Аул */}
      {activeSection === 'aoul' && user && (
        <AoulSection
          user={user}
          locale={locale}
          onBack={() => setActiveSection(null)}
        />
      )}

      {/* Испытания */}
      {activeSection === 'trial' && user && (
        <TrialSection
          user={user}
          locale={locale}
          onBack={() => setActiveSection(null)}
        />
      )}

      {/* Заглушки — больше нет, все разделы готовы */}
      {([] as const).map(sec => (
        activeSection === sec && (
          <ComingSoon
            key={sec}
            locale={locale}
            section={sec}
            onBack={() => setActiveSection(null)}
          />
        )
      ))}

      {/* ══ ХАБ — три блока в потоке ══ */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          width: '100%',
          height: '100%',
          padding: '0 16px',
          boxSizing: 'border-box',
          overflow: 'hidden',
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        {/* Блок 1: Текст */}
        <div style={{
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          width: '100%',
        }}>
          <h1 style={{
            margin: 0,
            fontSize: 'clamp(0.95rem, 2.4vw, 1.6rem)',
            fontWeight: 700,
            letterSpacing: '0.02em',
            lineHeight: 1.2,
            textShadow: '0 2px 20px rgba(0,0,0,0.75)',
            textAlign: 'center',
          }}>
            {t.title}
          </h1>
          <p style={{
            margin: 0,
            fontSize: 'clamp(0.65rem, 1.3vw, 0.82rem)',
            color: 'rgba(255,242,195,0.84)',
            lineHeight: 1.4,
            textAlign: 'center',
            textShadow: '0 1px 8px rgba(0,0,0,0.65)',
          }}>
            {t.subtitle}
          </p>
          <div style={{
            marginTop: '3px',
            padding: '3px 12px',
            borderRadius: '18px',
            background: 'rgba(0,0,0,0.28)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            border: '1px solid rgba(255,210,80,0.18)',
            transition: 'opacity 0.45s ease',
            opacity: quoteFade ? 1 : 0,
            maxWidth: '380px',
          }}>
            <p style={{
              margin: 0,
              fontStyle: 'italic',
              fontSize: 'clamp(0.62rem, 1.2vw, 0.78rem)',
              color: 'rgba(255,232,140,0.92)',
              textAlign: 'center',
              lineHeight: 1.45,
            }}>
              «{t.quotes[quoteIndex]}»
            </p>
          </div>
        </div>

        {/* Блок 2: DayCounter / кнопка */}
        <div style={{ flexShrink: 0 }}>
          {user ? (
            <DayCounter user={user} locale={locale} onResetPath={resetPath} />
          ) : (
            <StartButton locale={locale} onClick={() => setShowAuth(true)} />
          )}
        </div>

        {/* Блок 3: Иконки */}
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconCircle locale={locale} onSectionClick={handleSectionClick} />
        </div>
      </div>
    </>
  )
}

// ── Заглушка для разделов в разработке ──────────────────────────────────────
import SectionShell from '@/components/SectionShell'

const SECTION_META: Record<string, { icon: string; nameRu: string; nameKz: string; soon: string; soonKz: string }> = {
  tree:   { icon: '🌳', nameRu: 'Древо',       nameKz: 'Ағаш',         soon: 'Восстановление здоровья — скоро',   soonKz: 'Денсаулықты қалпына келтіру — жақында' },
  mentor: { icon: '🧠', nameRu: 'Ақсақал',     nameKz: 'Ақсақал',      soon: 'AI-наставник — скоро',              soonKz: 'AI-тәлімгер — жақында' },
  aoul:   { icon: '👥', nameRu: 'Сообщество',  nameKz: 'Қауымдастық',  soon: 'Цифровой аул — скоро',             soonKz: 'Цифрлық ауыл — жақында' },
  trial:  { icon: '⚔️', nameRu: 'Испытания',   nameKz: 'Сынақтар',     soon: 'Ежедневные ритуалы — скоро',       soonKz: 'Күнделікті рәсімдер — жақында' },
}

function ComingSoon({ locale, section, onBack }: { locale: Locale; section: string; onBack: () => void }) {
  const isKz = locale === 'kz'
  const meta = SECTION_META[section]

  return (
    <SectionShell
      locale={locale}
      title={isKz ? meta.nameKz : meta.nameRu}
      icon={meta.icon}
      onBack={onBack}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: '16px',
        padding: '40px 20px',
        textAlign: 'center',
      }}>
        <span style={{ fontSize: '64px', opacity: 0.6 }}>{meta.icon}</span>
        <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>
          {isKz ? meta.soonKz : meta.soon}
        </h3>
        <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.35)', maxWidth: '280px', lineHeight: 1.6 }}>
          {isKz
            ? 'Бұл бөлім қазір жасалуда. Жол жалғасуда.'
            : 'Этот раздел сейчас строится. Путь продолжается.'}
        </p>
      </div>
    </SectionShell>
  )
}

// ── Кнопка старта ────────────────────────────────────────────────────────────
function StartButton({ locale, onClick }: { locale: Locale; onClick: () => void }) {
  const isKz = locale === 'kz'
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 28px',
        borderRadius: '22px',
        border: '1px solid rgba(255,210,80,0.40)',
        background: 'rgba(255,200,60,0.12)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        color: 'rgba(255,225,110,1)',
        fontSize: '13px',
        fontWeight: 600,
        cursor: 'pointer',
        letterSpacing: '0.07em',
        textTransform: 'uppercase',
        boxShadow: '0 0 20px rgba(255,180,0,0.14)',
        outline: 'none',
        fontFamily: 'inherit',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(255,200,60,0.22)'
        e.currentTarget.style.borderColor = 'rgba(255,210,80,0.65)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255,200,60,0.12)'
        e.currentTarget.style.borderColor = 'rgba(255,210,80,0.40)'
      }}
    >
      🏕️ {isKz ? 'Жолды бастау' : 'Начать путь'}
    </button>
  )
}