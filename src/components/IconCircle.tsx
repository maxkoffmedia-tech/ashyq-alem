'use client'
import { translations } from '@/i18n/translations'
import Image from 'next/image'

interface IconCircleProps {
  locale: string
  onSectionClick: (id: string) => void
}

export default function IconCircle({ locale, onSectionClick }: IconCircleProps) {
  const t = translations[locale as keyof typeof translations] || translations.ru
  
  // Строго твои названия файлов из папки public/
  const icons = [
    { id: 'path', label: t.icons.path, src: '/path.png', angle: -90 },
    { id: 'tree', label: t.icons.tree, src: '/tree.png', angle: -30 },
    { id: 'mentor', label: t.icons.mentor, src: '/mentor.png', angle: 30 },
    { id: 'community', label: t.icons.aoul, src: '/aoul.png', angle: 90 },
    { id: 'map', label: t.icons.map, src: '/map.png', angle: 150 },
    { id: 'trials', label: t.icons.trial, src: '/trial.png', angle: 210 },
  ]

  return (
    <div className="relative w-[340px] h-[340px] md:w-[420px] md:h-[420px] flex items-center justify-center">
      {/* Декоративные кольца */}
      <div className="absolute inset-0 border-2 border-white/5 rounded-full animate-[spin_120s_linear_infinite]" />
      <div className="absolute inset-12 border border-amber-400/10 rounded-full animate-[spin_90s_linear_infinite_reverse]" />
      
      {icons.map((item) => (
        <button
          key={item.id}
          onClick={() => onSectionClick(item.id)}
          className="absolute flex flex-col items-center group transition-all duration-300 hover:scale-110 active:scale-95"
          style={{
            transform: `rotate(${item.angle}deg) translate(160px) md:translate(190px) rotate(-${item.angle}deg)`
          }}
        >
          {/* Контейнер иконки */}
          <div className="relative w-20 h-20 md:w-24 md:h-24 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-full flex items-center justify-center shadow-2xl group-hover:border-amber-400/50 transition-all overflow-hidden p-0.5">
            <Image 
              src={item.src} 
              alt={item.label} 
              fill
              className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
              sizes="(max-width: 768px) 80px, 96px"
            />
            {/* Легкий градиент поверх для глубины */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 group-hover:to-amber-500/10 transition-colors" />
          </div>
          
          {/* Текст под иконкой */}
          <span className="mt-3 text-[10px] md:text-[11px] text-white/60 font-bold uppercase tracking-[0.2em] drop-shadow-lg group-hover:text-amber-200 transition-all">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  )
}