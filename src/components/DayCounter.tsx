'use client'
import { useDayCounter } from '@/hooks/useDayCounter'
import { useAuth } from '@/hooks/useAuth'

export default function DayCounter({ locale }: { locale: string }) {
  const { user } = useAuth()
  const isKz = locale === 'kz'
  const { days, milestone, progressToNext } = useDayCounter(user?.createdAt || '')

  const label = milestone
    ? (isKz ? milestone.labelKz : milestone.labelRu)
    : (isKz ? 'Жол басталды' : 'Путь начался')

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 18px', background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,200,60,0.20)', borderRadius: '40px' }}>
      <span style={{ fontSize: '22px', fontWeight: 900, color: '#ffd060', lineHeight: 1, textShadow: '0 0 12px rgba(255,200,60,0.5)' }}>
        {days}
      </span>
      <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.08)' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span style={{ fontSize: '9px', color: 'rgba(255,200,80,0.65)', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 600 }}>
          {isKz ? 'Жол күні' : 'День пути'}
        </span>
        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.55)' }}>{label}</span>
      </div>
      <div style={{ width: '48px', height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${Math.min(100, progressToNext * 100)}%`, background: 'linear-gradient(90deg,#ffd060,#f4a261)', borderRadius: '2px', transition: 'width 1s ease' }} />
      </div>
    </div>
  )
}