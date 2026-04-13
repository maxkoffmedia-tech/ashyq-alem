'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Логируем ошибку для отладки
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 text-center">
      <div className="space-y-8 max-w-lg animate-fade-in">
        {/* Вместо смайлика можно поставить стилизованный элемент */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl animate-pulse" />
          <span className="text-6xl relative z-10">🌙</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-widest drop-shadow-lg">
            Жол кесілді
          </h1>
          <p className="text-amber-200/60 italic text-sm md:text-base leading-relaxed">
            «Степь велика, но даже в тумане есть тропа». <br />
            Произошла ошибка, но мы уже ищем путь назад.
          </p>
        </div>

        <div className="flex flex-col space-y-3 items-center">
          <button
            onClick={() => reset()}
            className="px-10 py-4 bg-amber-600/20 hover:bg-amber-600/40 border border-amber-500/40 text-amber-50 rounded-full font-bold uppercase tracking-[0.2em] transition-all active:scale-95 shadow-[0_0_30px_rgba(251,191,36,0.1)]"
          >
            Қайталау / Попробовать снова
          </button>
          
          <button 
            onClick={() => window.location.href = '/'}
            className="text-white/40 text-xs uppercase tracking-widest hover:text-white/80 transition-colors"
          >
            На главную
          </button>
        </div>
      </div>
    </div>
  )
}