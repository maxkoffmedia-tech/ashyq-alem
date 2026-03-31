'use client'
import { useDayCounter } from '@/hooks/useDayCounter'
import { translations } from '@/i18n/translations'

export default function DayCounter({ locale }: { locale: string }) {
  const { days, milestone, progressToNext } = useDayCounter()
  const t = translations[locale as keyof typeof translations] || translations.ru

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="flex items-center space-x-4 bg-black/30 backdrop-blur-xl border border-white/10 p-2 pl-4 rounded-full shadow-2xl">
        <div className="flex items-center space-x-2">
          <span className="text-2xl animate-pulse" title={milestone.name}>{milestone.icon}</span>
          <div className="flex flex-col leading-none">
            <span className={`text-2xl font-black text-transparent bg-clip-text bg-gradient-to-b ${milestone.color}`}>
              {days}
            </span>
            <span className="text-[10px] text-white/50 uppercase tracking-tighter">
              {t.dayOfPath}
            </span>
          </div>
        </div>
        
        <div className="h-8 w-px bg-white/10" />
        
        <div className="flex flex-col w-24">
          <div className="flex justify-between text-[9px] text-white/40 mb-1 uppercase">
            <span>Next</span>
            <span>{Math.round(progressToNext)}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 bg-gradient-to-r ${milestone.color}`}
              style={{ width: `${progressToNext}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}