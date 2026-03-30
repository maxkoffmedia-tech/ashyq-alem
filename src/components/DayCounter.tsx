'use client'

import { useDayCounter, MILESTONES } from '@/hooks/useDayCounter'
import type { UserProfile } from '@/hooks/useAuth'

interface Props {
  user: UserProfile
  locale: 'ru' | 'kz'
  onResetPath: () => void
}

export default function DayCounter({ user, locale, onResetPath }: Props) {
  const { days, hours, minutes, milestone, nextMilestone, progressToNext } =
    useDayCounter(user.createdAt)

  const isKz = locale === 'kz'
  const glowColor = milestone?.color ?? '#ffd060'

  const dayWord = isKz
    ? 'күн'
    : days === 1 ? 'день'
    : days < 5  ? 'дня'
    : 'дней'

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 20px',
        borderRadius: '32px',
        background: 'rgba(5,15,5,0.55)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1px solid ${glowColor}40`,
        boxShadow: `0 0 24px ${glowColor}20`,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        maxWidth: '100%',
      }}
    >
      {/* Фоновое свечение */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse at 50% 0%, ${glowColor}14 0%, transparent 70%)`,
      }} />

      {/* Артефакт */}
      <span style={{ fontSize: '22px', flexShrink: 0, zIndex: 1 }}>
        {milestone?.artifact ?? '🌱'}
      </span>

      {/* Число дней */}
      <div style={{ zIndex: 1, lineHeight: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span style={{
            fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
            fontWeight: 800,
            color: glowColor,
            textShadow: `0 0 20px ${glowColor}80`,
            fontVariantNumeric: 'tabular-nums',
          }}>
            {days}
          </span>
          <span style={{
            fontSize: '12px',
            color: 'rgba(255,255,255,0.50)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}>
            {isKz ? 'жол ' : 'день пути · '}{dayWord}
          </span>
        </div>

        {/* Часы/минуты + прогресс */}
        <div style={{ marginTop: '5px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '10px',
            color: 'rgba(255,255,255,0.30)',
            marginBottom: '4px',
            gap: '8px',
          }}>
            <span>{String(hours).padStart(2,'0')}ч {String(minutes).padStart(2,'0')}м</span>
            <span>
              {nextMilestone.artifact} {isKz ? nextMilestone.labelKz : nextMilestone.labelRu} — {nextMilestone.days - days} {isKz ? 'күн' : 'дн.'}
            </span>
          </div>
          {/* Прогресс-бар */}
          <div style={{
            height: '2px', borderRadius: '1px',
            background: 'rgba(255,255,255,0.08)',
          }}>
            <div style={{
              height: '100%',
              width: `${progressToNext * 100}%`,
              background: `linear-gradient(90deg, ${glowColor}60, ${glowColor})`,
              borderRadius: '1px',
              transition: 'width 1s ease',
            }} />
          </div>
        </div>
      </div>

      {/* Кнопка сброса */}
      <button
        onClick={() => {
          if (window.confirm(isKz
            ? 'Жаңа бастау нүктесі? Жол жалғасады.'
            : 'Новая точка? Путь продолжается.'
          )) onResetPath()
        }}
        style={{
          zIndex: 1, flexShrink: 0,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: '12px',
          padding: '5px 9px',
          color: 'rgba(255,255,255,0.35)',
          fontSize: '11px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          fontFamily: 'inherit',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = 'rgba(255,255,255,0.35)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'
        }}
        title={isKz ? 'Жаңа бастау' : 'Новая точка'}
      >
        ↩
      </button>
    </div>
  )
}