'use client'
import DynamicBackground from './DynamicBackground'
import WorldLayer from './WorldLayer'
import MusicToggle from './MusicToggle'
import LanguageSwitcher from './LanguageSwitcher'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#000', color: '#fff' }}>
      <DynamicBackground />
      <WorldLayer />

      {/* Хедер — LanguageSwitcher и Music справа */}
      <header style={{ position: 'fixed', top: 0, right: 0, height: '52px', zIndex: 49, display: 'flex', alignItems: 'center', gap: '10px', padding: '0 16px' }}>
        <LanguageSwitcher />
        <MusicToggle />
      </header>

      <main style={{ position: 'fixed', top: '52px', left: 0, right: 0, bottom: '32px', zIndex: 10, overflow: 'hidden' }}>
        {children}
      </main>

      <footer style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '32px', zIndex: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ margin: 0, fontSize: '9px', color: 'rgba(255,255,255,0.20)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
          {'\u04b0\u043b\u044b \u0414\u0430\u043b\u0430 \u0416\u043e\u043b\u044b \u00a9 2026 \u00b7 \u041d\u0435 \u044f\u0432\u043b\u044f\u0435\u0442\u0441\u044f \u043c\u0435\u0434\u0438\u0446\u0438\u043d\u0441\u043a\u043e\u0439 \u0443\u0441\u043b\u0443\u0433\u043e\u0439'}
        </p>
      </footer>
    </div>
  )
}