'use client'

import { useState } from 'react'
import {
  ADDICTION_LABELS_RU,
  ADDICTION_LABELS_KZ,
  ADDICTION_ICONS,
  type AddictionType,
} from '@/hooks/useAuth'

const ADDICTION_TYPES = Object.keys(ADDICTION_ICONS) as AddictionType[]

interface Props {
  locale: 'ru' | 'kz'
  onRegister: (name: string, type: AddictionType, locale: 'ru' | 'kz', startDate: string) => void
  onClose: () => void
}

type Step = 'welcome' | 'name' | 'type' | 'date' | 'done'

export default function AuthModal({ locale, onRegister, onClose }: Props) {
  const isKz = locale === 'kz'
  const [step, setStep] = useState<Step>('welcome')
  const [name, setName] = useState('')
  const [addictionType, setAddictionType] = useState<AddictionType | null>(null)
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  )

  const labels = isKz ? ADDICTION_LABELS_KZ : ADDICTION_LABELS_RU

  function handleFinish() {
    if (!addictionType) return
    const isoDate = new Date(startDate).toISOString()
    onRegister(name || (isKz ? 'Жолаушы' : 'Путник'), addictionType, locale, isoDate)
    setStep('done')
    setTimeout(onClose, 1800)
  }

  const todayStr = new Date().toISOString().slice(0, 10)

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        padding: '20px',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { opacity: 0.4; }
          50%  { opacity: 0.9; }
          100% { opacity: 0.4; }
        }
        .auth-input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 14px;
          border: 1px solid rgba(255,200,60,0.25);
          background: rgba(255,255,255,0.06);
          color: white;
          font-size: 15px;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s;
          font-family: inherit;
        }
        .auth-input:focus { border-color: rgba(255,200,60,0.6); }
        .auth-input::placeholder { color: rgba(255,255,255,0.3); }
        .auth-btn-primary {
          width: 100%;
          padding: 13px;
          border-radius: 14px;
          border: none;
          background: rgba(255,200,60,0.88);
          color: #1a0f00;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          font-family: inherit;
          letter-spacing: 0.02em;
        }
        .auth-btn-primary:hover { opacity: 0.88; transform: scale(0.99); }
        .auth-btn-secondary {
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.35);
          font-size: 13px;
          cursor: pointer;
          padding: 6px;
          font-family: inherit;
          transition: color 0.2s;
        }
        .auth-btn-secondary:hover { color: rgba(255,255,255,0.65); }
        .type-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 14px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.75);
          font-size: 13px;
          cursor: pointer;
          transition: all 0.18s;
          text-align: left;
          width: 100%;
          font-family: inherit;
        }
        .type-btn:hover, .type-btn.active {
          border-color: rgba(255,200,60,0.5);
          background: rgba(255,200,60,0.10);
          color: white;
        }
      `}</style>

      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'rgba(8, 20, 10, 0.92)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,200,60,0.20)',
          borderRadius: '28px',
          padding: '36px 32px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,200,60,0.08)',
          animation: 'fadeUp 0.3s ease',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Фоновое свечение */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,200,60,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Прогресс-точки */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '28px' }}>
          {(['welcome','name','type','date'] as Step[]).map((s, i) => {
            const steps: Step[] = ['welcome','name','type','date']
            const current = steps.indexOf(step)
            const idx = i
            return (
              <div key={s} style={{
                width: current >= idx ? '20px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: current >= idx
                  ? 'rgba(255,200,60,0.85)'
                  : 'rgba(255,255,255,0.15)',
                transition: 'all 0.3s ease',
              }} />
            )
          })}
        </div>

        {/* ── ШАГ 1: Приветствие ── */}
        {step === 'welcome' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px', animation: 'shimmer 2.5s infinite' }}>🏕️</div>
              <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, lineHeight: 1.3 }}>
                {isKz ? 'Жолға қош келдің' : 'Добро пожаловать в путь'}
              </h2>
              <p style={{ marginTop: '10px', fontSize: '13px', color: 'rgba(255,235,160,0.75)', lineHeight: 1.6 }}>
                {isKz
                  ? 'Бұл сенің жолың. Баяу, күшті, адал. Мұнда ешкім сені сотқа тартпайды.'
                  : 'Это твой путь. Медленный, сильный, честный. Здесь никто тебя не осудит.'}
              </p>
            </div>
            <button className="auth-btn-primary" onClick={() => setStep('name')}>
              {isKz ? 'Жолды бастау →' : 'Начать путь →'}
            </button>
            <div style={{ textAlign: 'center' }}>
              <button className="auth-btn-secondary" onClick={onClose}>
                {isKz ? 'Кейін' : 'Позже'}
              </button>
            </div>
          </div>
        )}

        {/* ── ШАГ 2: Имя ── */}
        {step === 'name' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ textAlign: 'center', marginBottom: '4px' }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>👤</div>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>
                {isKz ? 'Сенің атың кім?' : 'Как тебя называть?'}
              </h2>
              <p style={{ marginTop: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                {isKz
                  ? 'Лақап ат немесе ат. Тек өзің білесің.'
                  : 'Псевдоним или имя. Знаешь только ты.'}
              </p>
            </div>
            <input
              className="auth-input"
              type="text"
              maxLength={32}
              placeholder={isKz ? 'Мысалы: Арлан' : 'Например: Арлан'}
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') setStep('type') }}
              autoFocus
            />
            <button
              className="auth-btn-primary"
              onClick={() => setStep('type')}
            >
              {isKz ? 'Жалғастыру →' : 'Продолжить →'}
            </button>
            <div style={{ textAlign: 'center' }}>
              <button className="auth-btn-secondary" onClick={() => setStep('welcome')}>← {isKz ? 'Артқа' : 'Назад'}</button>
            </div>
          </div>
        )}

        {/* ── ШАГ 3: Тип зависимости ── */}
        {step === 'type' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ textAlign: 'center', marginBottom: '4px' }}>
              <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
                {isKz ? 'Жолың қандай?' : 'Твой путь — от чего?'}
              </h2>
              <p style={{ marginTop: '6px', fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>
                {isKz ? 'Тек саған көрінеді' : 'Видишь только ты'}
              </p>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              maxHeight: '300px',
              overflowY: 'auto',
            }}>
              {ADDICTION_TYPES.map(t => (
                <button
                  key={t}
                  className={`type-btn ${addictionType === t ? 'active' : ''}`}
                  onClick={() => setAddictionType(t)}
                >
                  <span style={{ fontSize: '20px' }}>{ADDICTION_ICONS[t]}</span>
                  <span>{labels[t]}</span>
                </button>
              ))}
            </div>
            <button
              className="auth-btn-primary"
              onClick={() => { if (addictionType) setStep('date') }}
              style={{ opacity: addictionType ? 1 : 0.4 }}
            >
              {isKz ? 'Жалғастыру →' : 'Продолжить →'}
            </button>
            <div style={{ textAlign: 'center' }}>
              <button className="auth-btn-secondary" onClick={() => setStep('name')}>← {isKz ? 'Артқа' : 'Назад'}</button>
            </div>
          </div>
        )}

        {/* ── ШАГ 4: Дата старта ── */}
        {step === 'date' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ textAlign: 'center', marginBottom: '4px' }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>📅</div>
              <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>
                {isKz ? 'Жолың қашан басталды?' : 'Когда начался твой путь?'}
              </h2>
              <p style={{ marginTop: '8px', fontSize: '12px', color: 'rgba(255,235,160,0.65)', lineHeight: 1.5 }}>
                {isKz
                  ? 'Егер бүгін болса — бүгін. Бірінші күн де — күш.'
                  : 'Если сегодня — сегодня. Первый день тоже сила.'}
              </p>
            </div>

            {/* Быстрый выбор */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {[
                { label: isKz ? 'Бүгін' : 'Сегодня', days: 0 },
                { label: isKz ? 'Кеше' : 'Вчера',    days: 1 },
                { label: isKz ? '3 күн' : '3 дня',   days: 3 },
                { label: isKz ? 'Апта' : 'Неделя',   days: 7 },
              ].map(opt => {
                const d = new Date()
                d.setDate(d.getDate() - opt.days)
                const val = d.toISOString().slice(0, 10)
                return (
                  <button
                    key={opt.label}
                    onClick={() => setStartDate(val)}
                    style={{
                      padding: '7px 16px',
                      borderRadius: '20px',
                      border: `1px solid ${startDate === val ? 'rgba(255,200,60,0.7)' : 'rgba(255,255,255,0.12)'}`,
                      background: startDate === val ? 'rgba(255,200,60,0.15)' : 'transparent',
                      color: startDate === val ? 'rgba(255,210,80,1)' : 'rgba(255,255,255,0.5)',
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.18s',
                      fontFamily: 'inherit',
                    }}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>

            {/* Точная дата */}
            <input
              className="auth-input"
              type="date"
              value={startDate}
              max={todayStr}
              onChange={e => setStartDate(e.target.value)}
              style={{ colorScheme: 'dark' }}
            />

            <button className="auth-btn-primary" onClick={handleFinish}>
              {isKz ? 'Жолды бастау 🏕️' : 'Начать путь 🏕️'}
            </button>
            <div style={{ textAlign: 'center' }}>
              <button className="auth-btn-secondary" onClick={() => setStep('type')}>← {isKz ? 'Артқа' : 'Назад'}</button>
            </div>
          </div>
        )}

        {/* ── Финал ── */}
        {step === 'done' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>🏕️</div>
            <h2 style={{ margin: '0 0 10px', fontSize: '1.3rem', fontWeight: 700 }}>
              {isKz ? 'Жол басталды!' : 'Путь начался!'}
            </h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,235,160,0.75)', lineHeight: 1.6 }}>
              {isKz
                ? 'Дала сені күтті. Жүр, батыр.'
                : 'Степь ждала тебя. Иди, батыр.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}