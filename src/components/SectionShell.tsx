'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import type { Locale } from '@/i18n/translations'

interface Props {
  locale: Locale
  title: string
  icon: string
  children: React.ReactNode
  onBack?: () => void
  accentColor?: string
}

export default function SectionShell({ locale, title, icon, children, onBack, accentColor = 'rgba(255,200,60,0.6)' }: Props) {
  const isKz = locale === 'kz'
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', color: 'white', overflow: 'hidden', opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.3s ease, transform 0.3s ease' }}>

      {/* ХЕДЕР */}
      <div style={{ flexShrink: 0, height: '60px', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.60)', zIndex: 600, position: 'relative' }}>

        {/* Кнопка назад */}
        <button
          onClick={() => { if (onBack) onBack() }}
          style={{ height: '36px', padding: '0 16px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.09)', color: 'white', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)' }}
        >
          {'\u2190'} {isKz ? '\u0410\u0440\u0442\u049b\u0430' : '\u041d\u0430\u0437\u0430\u0434'}
        </button>

        {/* Иконка + название */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: '20px', flexShrink: 0 }}>{icon}</span>
          <h2 style={{ margin: 0, fontSize: '13px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'white', textShadow: `0 0 16px ${accentColor}`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {title}
          </h2>
        </div>

        {/* Акцентная линия */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: `linear-gradient(to right, transparent, ${accentColor}, transparent)` }} />
      </div>

      {/* КОНТЕНТ */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {children}
      </div>
    </div>
  )
}