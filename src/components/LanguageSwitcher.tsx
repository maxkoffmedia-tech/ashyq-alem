'use client'

import { useRouter, usePathname } from 'next/navigation'

export default function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()

  // Определяем текущую локаль из пути: /ru/... или /kz/...
  const currentLocale = pathname.startsWith('/kz') ? 'kz' : 'ru'

  function switchLocale(locale: 'ru' | 'kz') {
    if (locale === currentLocale) return
    // Заменяем префикс локали в пути
    const newPath = pathname.replace(/^\/(ru|kz)/, `/${locale}`)
    router.push(newPath)
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        background: 'rgba(0,0,0,0.30)',
        backdropFilter: 'blur(8px)',
        borderRadius: '20px',
        padding: '4px 6px',
        border: '1px solid rgba(255,255,255,0.15)',
      }}
    >
      {(['ru', 'kz'] as const).map((locale) => {
        const isActive = locale === currentLocale
        return (
          <button
            key={locale}
            onClick={() => switchLocale(locale)}
            style={{
              padding: '4px 12px',
              borderRadius: '16px',
              border: 'none',
              cursor: isActive ? 'default' : 'pointer',
              fontSize: '13px',
              fontWeight: isActive ? 700 : 400,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              transition: 'all 0.2s ease',
              background: isActive
                ? 'rgba(255, 220, 100, 0.85)'
                : 'transparent',
              color: isActive ? '#3d2500' : 'rgba(255,255,255,0.75)',
              boxShadow: isActive
                ? '0 2px 8px rgba(255,180,0,0.4)'
                : 'none',
            }}
          >
            {locale === 'ru' ? 'РУС' : 'ҚАЗ'}
          </button>
        )
      })}
    </div>
  )
}