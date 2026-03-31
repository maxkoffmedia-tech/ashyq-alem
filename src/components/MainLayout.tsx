'use client'
import DynamicBackground from './DynamicBackground'
import WorldLayer from './WorldLayer'
import MusicToggle from './MusicToggle'
import LanguageSwitcher from './LanguageSwitcher'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-black text-white selection:bg-amber-500/30">
      <DynamicBackground />
      <WorldLayer />
      
      {/* СЛОЙ ИНТЕРФЕЙСА */}
      <div className="relative z-10 flex flex-col h-full w-full pointer-events-none">
        {/* HEADER: Языки и Музыка */}
        <header className="flex-none h-14 flex items-center justify-between px-6 pointer-events-auto">
          <LanguageSwitcher />
          <MusicToggle />
        </header>

        {/* CENTER: Весь контент страницы */}
        <div className="flex-1 w-full pointer-events-auto overflow-hidden">
          {children}
        </div>

        {/* FOOTER: Дисклеймер */}
        <footer className="flex-none h-10 flex items-center justify-center bg-black/40 backdrop-blur-sm border-t border-white/5 px-4 pointer-events-auto text-center">
          <p className="text-[10px] md:text-xs text-white/40 font-light tracking-wide max-w-3xl truncate">
            &copy; 2026 ASHYQ ALEM • 18+ • НЕ ЯВЛЯЕТСЯ МЕДИЦИНСКОЙ УСЛУГОЙ • ПУТЬ К СВОБОДЕ НАЧИНАЕТСЯ С ТЕБЯ
          </p>
        </footer>
      </div>
    </div>
  )
}