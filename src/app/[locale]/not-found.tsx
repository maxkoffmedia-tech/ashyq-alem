'use client'

import Link from 'next/link'
import { Home } from 'lucide-react'
import { useParams } from 'next/navigation'

export default function NotFound() {
  const params = useParams()
  const locale = params?.locale || 'ru'

  return (
    // Добавляем bg-[#0a0a0a] для единства стиля
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 text-center">
      <div className="space-y-8 max-w-lg animate-fade-in">
        
        {/* Стилизованное число 404 в золотых тонах */}
        <h1 className="text-8xl md:text-9xl font-black text-amber-500/20 tracking-tighter drop-shadow-[0_0_40px_rgba(245,158,11,0.15)] relative">
          404
          <span className="absolute inset-0 text-amber-500/10 blur-xl">404</span>
        </h1>

        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-widest">
             Жол жоғалды / Путь потерян
          </h2>
          <p className="text-white/40 italic text-sm md:text-base leading-relaxed">
            «Тот, кто ищет истину, не боится сбиться с пути, но всегда находит дорогу домой».
          </p>
        </div>

        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-3 px-10 py-4 bg-amber-600/20 border border-amber-500/40 text-amber-50 rounded-full font-bold uppercase tracking-[0.2em] hover:bg-amber-600/40 transition-all active:scale-95 shadow-[0_0_30px_rgba(251,191,36,0.1)]"
        >
          <Home size={20} className="text-amber-400" />
          Оралу / Вернуться
        </Link>
      </div>
    </div>
  )
}