'use client'

import { useState, useEffect, useRef } from 'react'
import type { UserProfile } from '@/hooks/useAuth'
import type { Locale } from '@/i18n/translations'

interface Props {
  user: UserProfile | null
  locale: Locale
  onOpenSection: (section: string) => void
  onRegister: () => void
}

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

  const hour = new Date().getHours()

  if (hour >= 0 && hour < 5) {
    return {
      text: isKz
        ? `Түнде ояудың, ${user.name}... Не болды?`
        : `Не спишь, ${user.name}... Что случилось?`,
      options: [
        { id: 'mentor', label: isKz ? 'Сөйлескім келеді' : 'Хочу поговорить', section: 'mentor' },
        { id: 'close',  label: isKz ? 'Бəрі жақсы'       : 'Всё нормально'                      },
      ],
    }
  }

  if (days === 0) {
    return {
      text: isKz
        ? `Бірінші күн, ${user.name}. Ең ауыры — осы. Мен осындамын.`
        : `Первый день, ${user.name}. Самый тяжёлый — он. Я рядом.`,
      options: [
        { id: 'mentor', label: isKz ? 'Ақсақалмен сөйлес' : 'Поговорить с Ақсақалом', section: 'mentor' },
        { id: 'path',   label: isKz ? 'Жолымды бастау'     : 'Начать свой путь',       section: 'path'   },
        { id: 'close',  label: isKz ? 'Жаптым'             : 'Закрыть'                                   },
      ],
    }
  }

  if (days < 7) {
    return {
      text: isKz
        ? `${days} күн. Бірінші апта — ең қиыны. Бүгін қалайсың?`
        : `${days} ${days === 1 ? 'день' : 'дня'}. Первая неделя — самая трудная. Как сегодня?`,
      options: [
        { id: 'good',   label: isKz ? 'Ұстап тұрмын'       : 'Держусь нормально'                        },
        { id: 'mentor', label: isKz ? 'Ауыр, сөйлескім'    : 'Тяжело, хочу поговорить', section: 'mentor' },
        { id: 'tree',   label: isKz ? 'Денсаулықты толтыр' : 'Заполнить здоровье',      section: 'tree'   },
        { id: 'close',  label: isKz ? 'Жаптым'             : 'Закрыть'                                   },
      ],
    }
  }

  if (days < 30) {
    return {
      text: isKz
        ? `${days} күн — нақты нəтиже, ${user.name}. Бүгін не жасайсың?`
        : `${days} дней — реальный результат, ${user.name}. Что делаем сегодня?`,
      options: [
        { id: 'trial',  label: isKz ? 'Бүгінгі сынақтар'  : 'Испытания дня',           section: 'trial'  },
        { id: 'tree',   label: isKz ? 'Ағашымды суару'     : 'Полить дерево',           section: 'tree'   },
        { id: 'mentor', label: isKz ? 'Ақсақалмен сөйлес' : 'Поговорить',              section: 'mentor' },
        { id: 'close',  label: isKz ? 'Жаптым'            : 'Закрыть'                                    },
      ],
    }
  }

  if (days < 90) {
    return {
      text: isKz
        ? `${days} күн. Сен батырсың, ${user.name}.`
        : `${days} дней. Ты — батыр, ${user.name}.`,
      options: [
        { id: 'trial',  label: isKz ? 'Испытания'          : 'Испытания',               section: 'trial'  },
        { id: 'path',   label: isKz ? 'Жолымды тексер'     : 'Мой путь',                section: 'path'   },
        { id: 'aoul',   label: isKz ? 'Ауылға бар'         : 'В аул',                   section: 'aoul'   },
        { id: 'close',  label: isKz ? 'Жаптым'             : 'Закрыть'                                    },
      ],
    }
  }

  return {
    text: isKz
      ? `${days} күн. Аңыз. ${user.name}, бүгін не беруді жоспарлап тұрсың?`
      : `${days} дней. Легенда. ${user.name}, что отдаёшь сегодня?`,
    options: [
      { id: 'aoul',   label: isKz ? 'Басқаларға көмек'   : 'Помочь другим в ауле',    section: 'aoul'   },
      { id: 'mentor', label: isKz ? 'Ақсақалмен'         : 'Поговорить с Ақсақалом',  section: 'mentor' },
      { id: 'close',  label: isKz ? 'Жаптым'             : 'Закрыть'                                    },
    ],
  }
}

function useTypewriter(text: string, active: boolean, speed = 26) {
  const [out, setOut] = useState('')
  const [done, setDone] = useState(false)
  const idx = useRef(0)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!active) { setOut(''); setDone(false); return }
    idx.current = 0
    setOut(''); setDone(false)
    function tick() {
      if (idx.current < text.length) {
        setOut(text.slice(0, idx.current + 1))
        idx.current++
        timer.current = setTimeout(tick, speed)
      } else {
        setDone(true)
      }
    }
    timer.current = setTimeout(tick, 400)
    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [text, active])

  return { out, done }
}

export default function JarvisGreeting({ user, locale, onOpenSection, onRegister }: Props) {
  const isKz = locale === 'kz'
  const [open, setOpen] = useState(false)
  const [everOpened, setEverOpened] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const days = user
    ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  const content = buildGreeting(user, days, isKz)
  const { out, done } = useTypewriter(content.text, open)

  // Автооткрытие — один раз в день
  useEffect(() => {
    const key = 'ashyq_jarvis_' + new Date().toISOString().slice(0, 10)
    if (!localStorage.getItem(key)) {
      const t = setTimeout(() => {
        setOpen(true)
        setEverOpened(true)
        localStorage.setItem(key, '1')
      }, 1800)
      return () => clearTimeout(t)
    }
  }, [])

  // Автозакрытие через 35 сек
  useEffect(() => {
    if (!open) return
    closeTimer.current = setTimeout(() => setOpen(false), 35000)
    return () => { if (closeTimer.current) clearTimeout(closeTimer.current) }
  }, [open])

  function openPanel() {
    setOpen(true)
    setEverOpened(true)
  }

  function handleOption(id: string, section?: string) {
    if (id === 'close' || id === 'good') { setOpen(false); return }
    if (!user && (id === 'self' || id === 'family')) {
      setOpen(false); setTimeout(onRegister, 300); return
    }
    if (!user && id === 'close') { setOpen(false); return }
    if (section) { setOpen(false); setTimeout(() => onOpenSection(section), 300) }
  }

  return (
    <>
      {/* ── ОРБ — маленький, всегда в центре снизу ── */}
      <button
        onClick={() => open ? setOpen(false) : openPanel()}
        aria-label="Ақсақал"
        style={{
          position: 'fixed',
          bottom: '54px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 96,
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          background: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
        }}
      >
        {/* Пульсирующее свечение */}
        {!open && (
          <span style={{
            position: 'absolute',
            inset: '-6px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(167,139,250,0.40) 0%, transparent 70%)',
            animation: 'orbPulse 2.8s ease-in-out infinite',
            pointerEvents: 'none',
          }} />
        )}

        {/* Сам орб */}
        <span style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: open
            ? 'radial-gradient(circle at 35% 30%, rgba(230,215,255,0.98), rgba(110,60,220,0.90))'
            : 'radial-gradient(circle at 35% 30%, rgba(210,185,255,0.92), rgba(90,45,190,0.80))',
          border: `1.5px solid ${open ? 'rgba(200,170,255,0.80)' : 'rgba(170,140,255,0.55)'}`,
          boxShadow: open
            ? '0 0 24px rgba(150,100,255,0.75), 0 0 50px rgba(100,50,220,0.35)'
            : '0 0 14px rgba(140,100,255,0.50)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          transition: 'all 0.3s ease',
          flexShrink: 0,
        }}>
          🔥
        </span>

        {/* Подпись — только если ни разу не открывали */}
        {!everOpened && (
          <span style={{
            fontSize: '9px',
            color: 'rgba(180,150,255,0.75)',
            letterSpacing: '0.04em',
            whiteSpace: 'nowrap',
            lineHeight: 1,
            animation: 'fadeIn 0.6s ease 2.5s both',
          }}>
            Ақсақал
          </span>
        )}
      </button>

      {/* ── ПАНЕЛЬ — выезжает снизу, компактная ── */}
      <div
        role="dialog"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 95,
          transform: open ? 'translateY(0)' : 'translateY(105%)',
          transition: 'transform 0.38s cubic-bezier(0.34,1.35,0.64,1)',
          pointerEvents: open ? 'all' : 'none',
        }}
      >
        <div style={{
          background: 'linear-gradient(175deg, rgba(10,5,25,0.98) 0%, rgba(18,8,40,0.99) 100%)',
          borderTop: '1px solid rgba(140,100,255,0.22)',
          borderRadius: '22px 22px 0 0',
          boxShadow: '0 -10px 50px rgba(70,30,150,0.35)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          padding: '10px 18px 28px',
          maxWidth: '560px',
          margin: '0 auto',
        }}>

          {/* Хэндл + закрыть */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
            <div style={{
              width: '34px', height: '3px',
              borderRadius: '2px',
              background: 'rgba(255,255,255,0.14)',
            }} />
            <button
              onClick={() => setOpen(false)}
              style={{
                position: 'absolute', right: 0, top: '-4px',
                width: '26px', height: '26px',
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.30)',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.60)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.30)' }}
            >✕</button>
          </div>

          {/* Аватар + текст */}
          <div style={{ display: 'flex', gap: '11px', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div style={{
              width: '34px', height: '34px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 30%, rgba(200,170,255,0.45), rgba(80,40,180,0.28))',
              border: '1px solid rgba(160,120,255,0.38)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '15px', flexShrink: 0,
              boxShadow: '0 0 12px rgba(130,90,255,0.28)',
            }}>
              🔥
            </div>
            <div style={{ flex: 1, paddingTop: '1px' }}>
              <div style={{ fontSize: '10px', color: 'rgba(160,130,255,0.70)', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '5px' }}>
                АҚСАҚАЛ
              </div>
              <p style={{
                margin: 0,
                fontSize: '14px',
                lineHeight: 1.65,
                color: 'rgba(225,210,255,0.92)',
                fontStyle: 'italic',
                minHeight: '22px',
              }}>
                {out}
                {!done && (
                  <span style={{
                    display: 'inline-block',
                    width: '2px', height: '14px',
                    background: 'rgba(180,150,255,0.85)',
                    marginLeft: '2px',
                    verticalAlign: 'text-bottom',
                    animation: 'blink 1s ease infinite',
                  }} />
                )}
              </p>
            </div>
          </div>

          {/* Кнопки */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            opacity: done ? 1 : 0,
            transform: done ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.30s ease, transform 0.30s ease',
            pointerEvents: done ? 'all' : 'none',
          }}>
            {content.options.map((opt, i) => {
              const isPrimary = i === 0
              return (
                <button
                  key={opt.id}
                  onClick={() => handleOption(opt.id, (opt as { id: string; label: string; section?: string }).section)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '14px',
                    border: `1px solid ${isPrimary ? 'rgba(150,110,255,0.45)' : 'rgba(255,255,255,0.07)'}`,
                    background: isPrimary ? 'rgba(80,40,180,0.32)' : 'rgba(255,255,255,0.03)',
                    color: isPrimary ? 'rgba(215,195,255,1)' : 'rgba(255,255,255,0.45)',
                    fontSize: '13px',
                    fontWeight: isPrimary ? 600 : 400,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    textAlign: 'left',
                    transition: 'all 0.16s',
                    letterSpacing: '0.01em',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(100,55,210,0.45)'
                    e.currentTarget.style.color = 'rgba(235,220,255,1)'
                    e.currentTarget.style.borderColor = 'rgba(170,130,255,0.60)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = isPrimary ? 'rgba(80,40,180,0.32)' : 'rgba(255,255,255,0.03)'
                    e.currentTarget.style.color = isPrimary ? 'rgba(215,195,255,1)' : 'rgba(255,255,255,0.45)'
                    e.currentTarget.style.borderColor = isPrimary ? 'rgba(150,110,255,0.45)' : 'rgba(255,255,255,0.07)'
                  }}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes orbPulse {
          0%, 100% { opacity: 0.55; transform: scale(1);    }
          50%       { opacity: 1.00; transform: scale(1.30); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
      `}</style>
    </>
  )
}