'use client'

import { useRouter } from 'next/navigation'
import type { Locale } from '@/i18n/translations'

interface Props {
  locale: Locale
  title: string        // заголовок раздела
  icon: string         // эмодзи иконка
  children: React.ReactNode
  onBack?: () => void  // если передан — используем, иначе router.back()
  // Цветовой акцент раздела (для border и glow)
  accentColor?: string
}

export default function SectionShell({
  locale,
  title,
  icon,
  children,
  onBack,
  accentColor = 'rgba(255,200,60,0.6)',
}: Props) {
  const router = useRouter()
  const isKz = locale === 'kz'

  function handleBack() {
    if (onBack) { onBack(); return }
    router.push(`/${locale}`)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(4,12,6,0.88)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        color: 'white',
        overflow: 'hidden',
        // Safe areas
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {/* ── Header раздела ── */}
      <div
        style={{
          flexShrink: 0,
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: '12px',
          borderBottom: `1px solid ${accentColor.replace('0.6','0.15')}`,
          background: 'rgba(0,0,0,0.20)',
        }}
      >
        {/* Кнопка назад */}
        <button
          onClick={handleBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.06)',
            color: 'rgba(255,255,255,0.75)',
            fontSize: '13px',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.18s',
            flexShrink: 0,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
            e.currentTarget.style.color = 'white'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
            e.currentTarget.style.color = 'rgba(255,255,255,0.75)'
          }}
          aria-label={isKz ? 'Артқа' : 'Назад'}
        >
          ← {isKz ? 'Артқа' : 'Назад'}
        </button>

        {/* Заголовок раздела */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flex: 1,
          }}
        >
          <span style={{ fontSize: '20px' }}>{icon}</span>
          <h2
            style={{
              margin: 0,
              fontSize: '1rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              color: 'white',
              textShadow: `0 0 20px ${accentColor}`,
            }}
          >
            {title}
          </h2>
        </div>
      </div>

      {/* ── Контент раздела — скроллируемый ── */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          // Кастомный скроллбар
          scrollbarWidth: 'thin',
          scrollbarColor: `${accentColor.replace('0.6','0.3')} transparent`,
        }}
      >
        {children}
      </div>
    </div>
  )
}