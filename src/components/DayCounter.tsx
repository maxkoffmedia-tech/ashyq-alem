'use client'
import { useDayCounter } from '@/hooks/useDayCounter'
import { useAuth } from '@/hooks/useAuth'
import { translations } from '@/i18n/translations'

export default function DayCounter({ locale }: { locale: string }) {
  const { user } = useAuth()
  
  // Передаем дату юзера, приводим к any чтобы не спотыкаться о типы
  const { days, milestone, progressToNext } = useDayCounter((user as any)?.startDate || '')
  
  const t = translations[locale as keyof typeof translations] || translations.ru

  return (
    <div className="flex flex-col items-center space-y-2 animate-fade-in">
      <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
        <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-2xl animate-pulse" />
        
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="48%"
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            className="text-white/5"
          />
          <circle
            cx="50%"
            cy="50%"
            r="48%"
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            strokeDasharray="300"
            strokeDashoffset={300 - (300 * (progressToNext || 0)) / 100}
            className="text-amber-500 transition-all duration-1000 ease-out"
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute flex flex-col items-center">
          <span className="text-4xl md:text-5xl font-black text-white drop-shadow-lg leading-none">
            {days}
          </span>
          {/* ИСПРАВЛЕНО: используем t.dayLabel вместо t.daysCount */}
          <span className="text-[10px] md:text-xs text-amber-200/70 uppercase tracking-widest font-bold mt-1">
            {t.dayLabel}
          </span>
        </div>
      </div>

      <div className="px-4 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-full">
        <p className="text-[10px] md:text-xs text-white/60 uppercase tracking-widest">
          {milestone}
        </p>
      </div>
    </div>
  )
}