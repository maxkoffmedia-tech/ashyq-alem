'use client'

import { useState, useEffect, useRef } from 'react'
import type { UserProfile } from '@/hooks/useAuth'
import type { Locale } from '@/i18n/translations'

// ═══════════════════════════════════════════════════════════════════════════════
// ТОТЕМ — дух-хранитель пользователя
// Живой SVG силуэт в углу. Не мешает. Всегда доступен.
// Нажал — выехала компактная панель снизу с голосом Ақсақала.
// ═══════════════════════════════════════════════════════════════════════════════

interface Props {
  user: UserProfile | null
  locale: Locale
  onOpenSection: (section: string) => void
  onRegister: () => void
}

type TotemType = 'berkut' | 'qasqyr' | 'tulpar'

const TOTEM_INFO = {
  berkut: {
    nameRu: 'Беркут', nameKz: 'Бүркіт',
    color: '#ffd060',
    glowColor: 'rgba(255,208,96,0.35)',
  },
  qasqyr: {
    nameRu: 'Қасқыр', nameKz: 'Қасқыр',
    color: '#60c5fa',
    glowColor: 'rgba(96,197,250,0.30)',
  },
  tulpar: {
    nameRu: 'Тұлпар', nameKz: 'Тұлпар',
    color: '#a78bfa',
    glowColor: 'rgba(167,139,250,0.30)',
  },
}

// ─── SVG силуэты тотемов ─────────────────────────────────────────────────────

function BerkutSVG({ color, animated }: { color: string; animated: boolean }) {
  return (
    <svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <filter id="bGlow">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* Левое крыло */}
      <path
        d="M60 45 Q40 30 10 35 Q25 42 30 50 Q20 48 5 55 Q22 58 35 55 Q25 60 15 70 Q30 65 42 60 Q50 55 55 50"
        fill={color}
        filter="url(#bGlow)"
        style={animated ? { animation: 'wingLeft 3s ease-in-out infinite' } : {}}
      />
      {/* Правое крыло */}
      <path
        d="M60 45 Q80 30 110 35 Q95 42 90 50 Q100 48 115 55 Q98 58 85 55 Q95 60 105 70 Q90 65 78 60 Q70 55 65 50"
        fill={color}
        filter="url(#bGlow)"
        style={animated ? { animation: 'wingRight 3s ease-in-out infinite' } : {}}
      />
      {/* Тело */}
      <ellipse cx="60" cy="52" rx="8" ry="12" fill={color} filter="url(#bGlow)" />
      {/* Голова */}
      <circle cx="60" cy="38" r="7" fill={color} filter="url(#bGlow)" />
      {/* Клюв */}
      <path d="M60 40 L65 44 L60 43" fill={color} />
      {/* Хвост */}
      <path d="M55 62 Q60 75 65 62" fill={color} filter="url(#bGlow)" />
      <style>{`
        @keyframes wingLeft {
          0%,100% { transform-origin: 60px 45px; transform: rotate(0deg); }
          50%      { transform-origin: 60px 45px; transform: rotate(-6deg); }
        }
        @keyframes wingRight {
          0%,100% { transform-origin: 60px 45px; transform: rotate(0deg); }
          50%      { transform-origin: 60px 45px; transform: rotate(6deg); }
        }
      `}</style>
    </svg>
  )
}

function QasqyrSVG({ color, animated }: { color: string; animated: boolean }) {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <filter id="wGlow">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* Тело */}
      <ellipse cx="50" cy="65" rx="22" ry="16" fill={color} filter="url(#wGlow)" />
      {/* Шея */}
      <path d="M38 55 Q45 42 50 38 Q55 42 62 55 Q56 58 50 58 Q44 58 38 55" fill={color} filter="url(#wGlow)" />
      {/* Голова */}
      <ellipse cx="50" cy="33" rx="13" ry="11" fill={color} filter="url(#wGlow)" />
      {/* Уши */}
      <path d="M40 25 L36 14 L44 22" fill={color} filter="url(#wGlow)" />
      <path d="M60 25 L64 14 L56 22" fill={color} filter="url(#wGlow)" />
      {/* Морда */}
      <path d="M45 38 Q50 44 55 38" fill="none" stroke={color} strokeWidth="1.5" />
      {/* Хвост */}
      <path
        d="M72 62 Q85 50 88 40"
        fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
        filter="url(#wGlow)"
        style={animated ? { animation: 'tailWag 2s ease-in-out infinite' } : {}}
      />
      {/* Лапы */}
      <rect x="32" y="78" width="6" height="12" rx="3" fill={color} filter="url(#wGlow)" />
      <rect x="44" y="78" width="6" height="12" rx="3" fill={color} filter="url(#wGlow)" />
      <rect x="56" y="78" width="6" height="12" rx="3" fill={color} filter="url(#wGlow)" />
      <style>{`
        @keyframes tailWag {
          0%,100% { transform-origin: 72px 62px; transform: rotate(0deg); }
          50%      { transform-origin: 72px 62px; transform: rotate(15deg); }
        }
      `}</style>
    </svg>
  )
}

function TulparSVG({ color, animated }: { color: string; animated: boolean }) {
  return (
    <svg viewBox="0 0 120 110" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <filter id="hGlow">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* Крыло */}
      <path
        d="M75 45 Q95 25 115 20 Q105 35 100 45 Q110 40 118 50 Q105 52 95 48 Q100 58 108 68 Q92 60 82 52"
        fill={color} filter="url(#hGlow)"
        style={animated ? { animation: 'horseWing 3.5s ease-in-out infinite' } : {}}
      />
      {/* Тело */}
      <ellipse cx="55" cy="70" rx="30" ry="18" fill={color} filter="url(#hGlow)" />
      {/* Шея */}
      <path d="M35 58 Q38 38 45 30 Q55 38 60 58" fill={color} filter="url(#hGlow)" />
      {/* Голова */}
      <ellipse cx="42" cy="26" rx="12" ry="10" fill={color} filter="url(#hGlow)" />
      {/* Морда */}
      <path d="M32 28 Q28 34 30 38" fill={color} filter="url(#hGlow)" />
      {/* Грива */}
      <path d="M38 18 Q42 8 48 14 Q44 5 52 10 Q46 2 56 8"
        fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" filter="url(#hGlow)" />
      {/* Ноги */}
      <line x1="35" y1="85" x2="30" y2="105" stroke={color} strokeWidth="4" strokeLinecap="round" filter="url(#hGlow)" />
      <line x1="48" y1="86" x2="44" y2="106" stroke={color} strokeWidth="4" strokeLinecap="round" filter="url(#hGlow)" />
      <line x1="65" y1="85" x2="68" y2="105" stroke={color} strokeWidth="4" strokeLinecap="round" filter="url(#hGlow)" />
      <line x1="78" y1="83" x2="83" y2="103" stroke={color} strokeWidth="4" strokeLinecap="round" filter="url(#hGlow)" />
      {/* Хвост */}
      <path d="M83 72 Q95 75 98 90 Q90 80 88 95" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" filter="url(#hGlow)" />
      <style>{`
        @keyframes horseWing {
          0%,100% { transform-origin: 75px 45px; transform: translateY(0); }
          50%      { transform-origin: 75px 45px; transform: translateY(-5px); }
        }
      `}</style>
    </svg>
  )
}

// ─── Грeetings ────────────────────────────────────────────────────────────────

function buildGreeting(user: UserProfile | null, days: number, isKz: boolean) {
  if (!user) {
    return {
      text: isKz
        ? 'Сәлем. Мен — Ақсақал. Өзгеруді қалайсың ба?'
        : 'Привет. Я — Ақсақал. Хочешь изменить свою жизнь?',
      options: [
        { id: 'self',   label: isKz ? 'Иə, хочу бросить зависимость' : 'Да, хочу бросить зависимость' },
        { id: 'family', label: isKz ? 'Жақыным тəуелді'               : 'Мой близкий зависим'           },
        { id: 'close',  label: isKz ? 'Жай қарап жүрмін'              : 'Просто смотрю'                 },
      ],
    }
  }

  const h = new Date().getHours()
  if (h >= 0 && h < 5) return {
    text: isKz ? `Түнде ояудың, ${user.name}... Не болды?` : `Не спишь, ${user.name}... Что случилось?`,
    options: [
      { id: 'mentor', label: isKz ? 'Сөйлескім келеді' : 'Хочу поговорить', section: 'mentor' },
      { id: 'close',  label: isKz ? 'Бəрі жақсы'       : 'Всё нормально' },
    ],
  }

  if (days === 0) return {
    text: isKz ? `Бірінші күн, ${user.name}. Ең ауыры — осы. Мен осындамын.` : `Первый день, ${user.name}. Самый тяжёлый — он. Я рядом.`,
    options: [
      { id: 'mentor', label: isKz ? 'Ақсақалмен сөйлес' : 'Поговорить', section: 'mentor' },
      { id: 'path',   label: isKz ? 'Жолымды бастау'     : 'Начать путь', section: 'path' },
      { id: 'close',  label: isKz ? 'Жаптым'             : 'Закрыть' },
    ],
  }

  if (days < 14) return {
    text: isKz
      ? `${days} күн. Бірінші апта — ең қиыны. Бүгін қалайсың?`
      : `${days} ${days === 1 ? 'день' : 'дня'}. Первые дни — самые трудные. Как сегодня?`,
    options: [
      { id: 'good',   label: isKz ? 'Ұстап тұрмын'       : 'Держусь' },
      { id: 'mentor', label: isKz ? 'Ауыр, сөйлескім'    : 'Тяжело, поговорим?', section: 'mentor' },
      { id: 'tree',   label: isKz ? 'Ағашымды толтыр'    : 'Заполнить дерево', section: 'tree' },
      { id: 'close',  label: isKz ? 'Жаптым'             : 'Закрыть' },
    ],
  }

  if (days < 90) return {
    text: isKz
      ? `${days} күн — нақты нəтиже, ${user.name}.`
      : `${days} дней — реальный результат, ${user.name}.`,
    options: [
      { id: 'trial',  label: isKz ? 'Бүгінгі сынақтар'  : 'Испытания дня', section: 'trial' },
      { id: 'tree',   label: isKz ? 'Ағашымды суару'     : 'Полить дерево', section: 'tree' },
      { id: 'mentor', label: isKz ? 'Ақсақалмен сөйлес' : 'Поговорить', section: 'mentor' },
      { id: 'close',  label: isKz ? 'Жаптым'            : 'Закрыть' },
    ],
  }

  return {
    text: isKz ? `${days} күн. Аңыз, ${user.name}.` : `${days} дней. Легенда, ${user.name}.`,
    options: [
      { id: 'aoul',   label: isKz ? 'Басқаларға көмек'  : 'Помочь другим', section: 'aoul' },
      { id: 'mentor', label: isKz ? 'Ақсақалмен'        : 'Поговорить', section: 'mentor' },
      { id: 'close',  label: isKz ? 'Жаптым'            : 'Закрыть' },
    ],
  }
}

function useTypewriter(text: string, active: boolean, speed = 24) {
  const [out, setOut] = useState('')
  const [done, setDone] = useState(false)
  const idx = useRef(0)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (!active) { setOut(''); setDone(false); return }
    idx.current = 0; setOut(''); setDone(false)
    function tick() {
      if (idx.current < text.length) {
        setOut(text.slice(0, idx.current + 1)); idx.current++
        timer.current = setTimeout(tick, speed)
      } else setDone(true)
    }
    timer.current = setTimeout(tick, 350)
    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [text, active])
  return { out, done }
}

// ─── ВЫБОР ТОТЕМА (при первом входе) ─────────────────────────────────────────

function TotemChooser({ isKz, onChoose }: { isKz: boolean; onChoose: (t: TotemType) => void }) {
  const totems: { id: TotemType; nameRu: string; nameKz: string; descRu: string; descKz: string }[] = [
    { id: 'berkut', nameRu: 'Беркут',  nameKz: 'Бүркіт', descRu: 'Свобода · Дальний взгляд', descKz: 'Бостандық · Алыс көзқарас' },
    { id: 'qasqyr', nameRu: 'Қасқыр', nameKz: 'Қасқыр',  descRu: 'Верность · Стойкость',      descKz: 'Адалдық · Төзімділік'      },
    { id: 'tulpar', nameRu: 'Тұлпар', nameKz: 'Тұлпар',  descRu: 'Скорость · Легенда',        descKz: 'Жылдамдық · Аңыз'          },
  ]
  const colors = { berkut: '#ffd060', qasqyr: '#60c5fa', tulpar: '#a78bfa' }

  return (
    <div style={{ padding: '4px 0 8px' }}>
      <p style={{ margin: '0 0 14px', fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
        {isKz ? 'Өзіңнің тотемін таңда — ол сенің жол серігің болады.' : 'Выбери своего тотема — он станет твоим хранителем пути.'}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {totems.map(t => (
          <button
            key={t.id}
            onClick={() => onChoose(t.id)}
            style={{
              padding: '12px 16px',
              borderRadius: '16px',
              border: `1px solid ${colors[t.id]}35`,
              background: `${colors[t.id]}0d`,
              cursor: 'pointer',
              fontFamily: 'inherit',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.18s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = `${colors[t.id]}20`
              e.currentTarget.style.borderColor = `${colors[t.id]}60`
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = `${colors[t.id]}0d`
              e.currentTarget.style.borderColor = `${colors[t.id]}35`
            }}
          >
            <div style={{ width: '48px', height: '48px', flexShrink: 0 }}>
              {t.id === 'berkut' && <BerkutSVG color={colors[t.id]} animated={false} />}
              {t.id === 'qasqyr' && <QasqyrSVG color={colors[t.id]} animated={false} />}
              {t.id === 'tulpar' && <TulparSVG color={colors[t.id]} animated={false} />}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: colors[t.id] }}>
                {isKz ? t.nameKz : t.nameRu}
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.40)', marginTop: '2px' }}>
                {isKz ? t.descKz : t.descRu}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── ГЛАВНЫЙ КОМПОНЕНТ ────────────────────────────────────────────────────────

const TOTEM_KEY = 'ashyq_totem'

export default function TotemSpirit({ user, locale, onOpenSection, onRegister }: Props) {
  const isKz = locale === 'kz'
  const [totem, setTotem] = useState<TotemType | null>(null)
  const [open, setOpen] = useState(false)
  const [showChooser, setShowChooser] = useState(false)
  const [hovered, setHovered] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const days = user
    ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  const content = buildGreeting(user, days, isKz)
  const { out, done } = useTypewriter(content.text, open && !showChooser)

  // Загружаем тотем
  useEffect(() => {
    const saved = localStorage.getItem(TOTEM_KEY) as TotemType | null
    if (saved) setTotem(saved)
  }, [])

  // Автооткрытие раз в день
  useEffect(() => {
    const key = 'ashyq_jarvis_' + new Date().toISOString().slice(0, 10)
    if (!localStorage.getItem(key)) {
      const t = setTimeout(() => {
        setOpen(true)
        localStorage.setItem(key, '1')
        if (!localStorage.getItem(TOTEM_KEY)) setShowChooser(true)
      }, 2000)
      return () => clearTimeout(t)
    }
  }, [])

  // Автозакрытие
  useEffect(() => {
    if (!open) return
    closeTimer.current = setTimeout(() => setOpen(false), 40000)
    return () => { if (closeTimer.current) clearTimeout(closeTimer.current) }
  }, [open])

  function chooseTotem(t: TotemType) {
    setTotem(t)
    localStorage.setItem(TOTEM_KEY, t)
    setShowChooser(false)
  }

  function handleTotemClick() {
    setOpen(o => !o)
    if (!localStorage.getItem(TOTEM_KEY)) setShowChooser(true)
  }

  function handleOption(id: string, section?: string) {
    if (id === 'close' || id === 'good') { setOpen(false); return }
    if (!user && (id === 'self' || id === 'family')) { setOpen(false); setTimeout(onRegister, 300); return }
    if (section) { setOpen(false); setTimeout(() => onOpenSection(section), 300) }
  }

  const activeTotem = totem ?? 'berkut'
  const info = TOTEM_INFO[activeTotem]

  return (
    <>
      {/* ── ТОТЕМ — дух в правом нижнем углу ── */}
      <div
        onClick={handleTotemClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'fixed',
          right: '16px',
          bottom: '60px',
          zIndex: 96,
          width: '72px',
          height: '72px',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        {/* Свечение вокруг */}
        <div style={{
          position: 'absolute',
          inset: '-12px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${info.glowColor} 0%, transparent 70%)`,
          opacity: hovered || open ? 1 : 0.5,
          transition: 'opacity 0.4s ease',
          animation: 'totemBreath 4s ease-in-out infinite',
          pointerEvents: 'none',
        }} />

        {/* SVG тотем */}
        <div style={{
          width: '72px',
          height: '72px',
          opacity: hovered || open ? 0.95 : 0.40,
          transition: 'opacity 0.5s ease, transform 0.3s ease',
          transform: hovered || open ? 'scale(1.08) translateY(-3px)' : 'scale(1)',
          filter: `drop-shadow(0 0 8px ${info.color}60)`,
        }}>
          {activeTotem === 'berkut' && <BerkutSVG color={info.color} animated={hovered || open} />}
          {activeTotem === 'qasqyr' && <QasqyrSVG color={info.color} animated={hovered || open} />}
          {activeTotem === 'tulpar' && <TulparSVG color={info.color} animated={hovered || open} />}
        </div>

        {/* Подсказка при первом появлении */}
        {!open && (
          <div style={{
            position: 'absolute',
            bottom: '78px',
            right: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(8px)',
            border: `1px solid ${info.color}30`,
            borderRadius: '10px',
            padding: '5px 10px',
            fontSize: '11px',
            color: info.color,
            whiteSpace: 'nowrap',
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateY(0)' : 'translateY(4px)',
            transition: 'opacity 0.2s, transform 0.2s',
            pointerEvents: 'none',
          }}>
            {isKz ? 'Ақсақал' : 'Ақсақал'}
          </div>
        )}
      </div>

      {/* ── ПАНЕЛЬ СНИЗУ ── */}
      <div style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        zIndex: 95,
        transform: open ? 'translateY(0)' : 'translateY(105%)',
        transition: 'transform 0.38s cubic-bezier(0.34,1.3,0.64,1)',
        pointerEvents: open ? 'all' : 'none',
      }}>
        <div style={{
          background: 'linear-gradient(175deg, rgba(8,4,20,0.98), rgba(15,8,38,0.99))',
          borderTop: `1px solid ${info.color}25`,
          borderRadius: '22px 22px 0 0',
          boxShadow: `0 -8px 40px ${info.glowColor}`,
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          padding: '10px 18px 32px',
          maxWidth: '560px',
          margin: '0 auto',
        }}>

          {/* Хэндл + закрыть */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
            <div style={{ width: '34px', height: '3px', borderRadius: '2px', background: 'rgba(255,255,255,0.12)' }} />
            <button
              onClick={() => setOpen(false)}
              style={{
                position: 'absolute', right: 0, top: '-4px',
                width: '26px', height: '26px', borderRadius: '50%',
                border: 'none', background: 'rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.30)', fontSize: '12px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >✕</button>
          </div>

          {showChooser ? (
            <>
              <div style={{ fontSize: '10px', color: `${info.color}90`, fontWeight: 700, letterSpacing: '0.08em', marginBottom: '10px' }}>
                АҚСАҚАЛ · {isKz ? 'ТОТЕМ ТАҢДА' : 'ВЫБОР ТОТЕМА'}
              </div>
              <TotemChooser isKz={isKz} onChoose={chooseTotem} />
            </>
          ) : (
            <>
              {/* Аватар тотема + текст */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div style={{ width: '40px', height: '40px', flexShrink: 0, opacity: 0.90, filter: `drop-shadow(0 0 6px ${info.color}50)` }}>
                  {activeTotem === 'berkut' && <BerkutSVG color={info.color} animated />}
                  {activeTotem === 'qasqyr' && <QasqyrSVG color={info.color} animated />}
                  {activeTotem === 'tulpar' && <TulparSVG color={info.color} animated />}
                </div>
                <div style={{ flex: 1, paddingTop: '2px' }}>
                  <div style={{ fontSize: '10px', color: `${info.color}80`, fontWeight: 700, letterSpacing: '0.08em', marginBottom: '5px' }}>
                    АҚСАҚАЛ · {isKz ? info.nameKz.toUpperCase() : info.nameRu.toUpperCase()}
                  </div>
                  <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.65, color: 'rgba(225,215,255,0.92)', fontStyle: 'italic', minHeight: '22px' }}>
                    {out}
                    {!done && (
                      <span style={{
                        display: 'inline-block', width: '2px', height: '14px',
                        background: `${info.color}cc`, marginLeft: '2px',
                        verticalAlign: 'text-bottom', animation: 'blink 1s ease infinite',
                      }} />
                    )}
                  </p>
                </div>
              </div>

              {/* Кнопки */}
              <div style={{
                display: 'flex', flexDirection: 'column', gap: '6px',
                opacity: done ? 1 : 0,
                transform: done ? 'translateY(0)' : 'translateY(8px)',
                transition: 'opacity 0.3s, transform 0.3s',
                pointerEvents: done ? 'all' : 'none',
              }}>
                {content.options.map((opt, i) => {
                  const o = opt as { id: string; label: string; section?: string }
                  return (
                    <button
                      key={o.id}
                      onClick={() => handleOption(o.id, o.section)}
                      style={{
                        padding: '10px 16px', borderRadius: '14px',
                        border: `1px solid ${i === 0 ? info.color + '45' : 'rgba(255,255,255,0.07)'}`,
                        background: i === 0 ? info.color + '20' : 'rgba(255,255,255,0.03)',
                        color: i === 0 ? info.color : 'rgba(255,255,255,0.45)',
                        fontSize: '13px', fontWeight: i === 0 ? 600 : 400,
                        cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                        transition: 'all 0.16s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = info.color + '30'
                        e.currentTarget.style.color = i === 0 ? info.color : 'rgba(255,255,255,0.75)'
                        e.currentTarget.style.borderColor = info.color + '65'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = i === 0 ? info.color + '20' : 'rgba(255,255,255,0.03)'
                        e.currentTarget.style.color = i === 0 ? info.color : 'rgba(255,255,255,0.45)'
                        e.currentTarget.style.borderColor = i === 0 ? info.color + '45' : 'rgba(255,255,255,0.07)'
                      }}
                    >
                      {o.label}
                    </button>
                  )
                })}

                {/* Сменить тотема */}
                <button
                  onClick={() => setShowChooser(true)}
                  style={{
                    padding: '6px', border: 'none', background: 'none',
                    color: 'rgba(255,255,255,0.18)', fontSize: '11px',
                    cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center',
                    marginTop: '2px',
                  }}
                >
                  {isKz ? `${isKz ? info.nameKz : info.nameRu} · тотемді ауыстыру` : `${info.nameRu} · сменить тотема`}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes totemBreath {
          0%,100% { transform: scale(1);    opacity: var(--op, 0.5); }
          50%      { transform: scale(1.15); opacity: 1; }
        }
        @keyframes blink {
          0%,100% { opacity: 1; } 50% { opacity: 0; }
        }
      `}</style>
    </>
  )
}