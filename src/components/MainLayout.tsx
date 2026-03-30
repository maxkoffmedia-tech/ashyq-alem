'use client'

import { usePathname } from 'next/navigation'
import DynamicBackground from './DynamicBackground'
import WorldLayer from './WorldLayer'
import MusicToggle from './MusicToggle'
import LanguageSwitcher from './LanguageSwitcher'
import { translations } from '@/i18n/translations'

/**
 * Z-INDEX HIERARCHY (строгая, не менять):
 *  -20  DynamicBackground (фон)
 *  -15  Gradient overlays (читаемость header/footer)
 *  -10  WorldLayer canvas (частицы)
 *   10  UI content (header, center, footer)
 *   50  Modals / overlays (AuthModal, MapSection)
 *  100  Critical popups (toasts, alerts)
 */

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const locale = pathname.startsWith('/kz') ? 'kz' : 'ru'
  const t = translations[locale]

  return (
    // Корневой контейнер: фиксированный, покрывает весь viewport включая safe-area
    <div
      style={{
        position: 'fixed',
        inset: 0,
        // 100dvh = реальная высота на мобильных (учитывает браузерный chrome)
        width: '100dvw',
        height: '100dvh',
        overflow: 'hidden',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* ── СЛОИ ФОНА (z: -20 .. -10) ── */}
      <DynamicBackground />
      <WorldLayer />

      {/* ── UI SHELL (z: 10) — строгий flex-col, justify-between ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          // justify-between = Header прижат к верху, Footer к низу, Center занимает остаток
          justifyContent: 'space-between',
          // Безопасные отступы для iPhone notch / Android навигации
          paddingTop: 'env(safe-area-inset-top, 0px)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          paddingLeft: 'env(safe-area-inset-left, 0px)',
          paddingRight: 'env(safe-area-inset-right, 0px)',
          boxSizing: 'border-box',
        }}
      >

        {/* ══ ЗОНА 1: HEADER — фиксированная высота 56px ══ */}
        <header
          style={{
            flexShrink: 0,
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            gap: '12px',
          }}
        >
          <LanguageSwitcher />
          <MusicToggle />
        </header>

        {/* ══ ЗОНА 2: CENTER — занимает всё свободное пространство ══ */}
        {/*
          overflow: hidden — дочерние элементы не могут вылезти за пределы зоны.
          Это ключевой фикс: IconCircle, DayCounter и AuthModal
          физически ограничены этим контейнером (кроме Modal у которого z:50 и fixed).
        */}
        <main
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // Критично: обрезаем всё что выходит за рамки центральной зоны
            overflow: 'hidden',
            // Горизонтальный padding чтобы контент не прилипал к краям
            padding: '0 16px',
            // Минимальная высота — защита от схлопывания на очень маленьких экранах
            minHeight: 0,
          }}
        >
          {children}
        </main>

        {/* ══ ЗОНА 3: FOOTER — фиксированная высота 38px ══ */}
        <footer
          style={{
            flexShrink: 0,
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 20px',
            // Подложка для читаемости на любом фоне
            background: 'rgba(0,0,0,0.28)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            fontSize: '11px',
            letterSpacing: '0.04em',
            color: 'rgba(255,255,255,0.72)',
            textAlign: 'center',
            // Не уменьшаем текст ниже 10px
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {t.disclaimer}
        </footer>

      </div>
    </div>
  )
}