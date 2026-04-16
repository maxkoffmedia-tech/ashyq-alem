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

function useTypewriter(text: string, active: boolean, speed = 28) {
  const [out, setOut] = useState('')
  const [done, setDone] = useState(false)
  const ref = useRef(0)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (!active) { setOut(''); setDone(false); return }
    ref.current = 0; setOut(''); setDone(false)
    const tick = () => {
      if (ref.current < text.length) {
        setOut(text.slice(0, ref.current + 1))
        ref.current++
        timer.current = setTimeout(tick, speed)
      } else setDone(true)
    }
    timer.current = setTimeout(tick, 500)
    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [text, active])
  return { out, done }
}

const MEM_KEY = 'ashyq_aksakal_mem'

interface Memory {
  lastVisit: string
  visitCount: number
  lastMood?: string
  firstName?: string
}

function getMemory(): Memory {
  try {
    const saved = localStorage.getItem(MEM_KEY)
    return saved ? JSON.parse(saved) : { lastVisit: '', visitCount: 0 }
  } catch { return { lastVisit: '', visitCount: 0 } }
}

function saveMemory(mem: Memory) {
  localStorage.setItem(MEM_KEY, JSON.stringify(mem))
}

function getGreeting(user: UserProfile | null, days: number, isKz: boolean, mem: Memory): { text: string; options: { id: string; label: string; section?: string }[] } {
  const name = user?.name?.split(' ')[0] || (isKz ? 'Жолаушы' : 'Путник')
  const isReturn = mem.visitCount > 1
  const lastVisitDays = mem.lastVisit ? Math.floor((Date.now() - new Date(mem.lastVisit).getTime()) / 86400000) : 0

  if (!user) {
    return {
      text: isKz
        ? 'Дала кең. Бірақ жол — жалғыз.\nМен — Ақсақал. Сені тыңдаймын.'
        : 'Степь широка. Но путь — один.\nЯ — Ақсақал. Я слушаю тебя.',
      options: [
        { id: 'start', label: isKz ? '🌿 Жолды бастау' : '🌿 Начать путь' },
        { id: 'look', label: isKz ? '👁 Жай қарап жүрмін' : '👁 Просто смотрю' },
        { id: 'close', label: isKz ? '✕ Закрыть' : '✕ Закрыть' },
      ]
    }
  }

  if (days === 0) {
    return {
      text: isKz
        ? `${name}... Бірінші күн.\nБатырлар да қорқады. Бірақ жүреді.`
        : `${name}... Первый день.\nБатыры тоже боятся. Но идут.`,
      options: [
        { id: 'mentor', label: isKz ? '🔥 Сөйлесу' : '🔥 Поговорить', section: 'mentor' },
        { id: 'path', label: isKz ? '🗺 Жолға шығу' : '🗺 Начать путь', section: 'path' },
        { id: 'close', label: '✕' },
      ]
    }
  }

  if (isReturn && lastVisitDays > 0) {
    return {
      text: isKz
        ? `Қайттың, ${name}. ${days} күн — бұл нақты.\n${lastVisitDays} күн болды. Қалайсың?`
        : `С возвращением, ${name}. ${days} дней — это реально.\n${lastVisitDays} ${lastVisitDays === 1 ? 'день' : 'дня'} не заходил. Как ты?`,
      options: [
        { id: 'good', label: isKz ? '💪 Жақсы' : '💪 Хорошо' },
        { id: 'mentor', label: isKz ? '🔥 Сөйлесу керек' : '🔥 Нужно поговорить', section: 'mentor' },
        { id: 'path', label: isKz ? '🗺 Жолым' : '🗺 Мой путь', section: 'path' },
        { id: 'close', label: '✕' },
      ]
    }
  }

  if (days < 7) {
    return {
      text: isKz
        ? `${name}, ${days} күн.\nДала сені байқап жатыр. Бүгін не жасаймыз?`
        : `${name}, ${days} дней.\nСтепь наблюдает за тобой. Что делаем сегодня?`,
      options: [
        { id: 'mentor', label: isKz ? '🔥 Сөйлесу' : '🔥 Поговорить', section: 'mentor' },
        { id: 'trials', label: isKz ? '⚔️ Сынақтар' : '⚔️ Испытания', section: 'trials' },
        { id: 'close', label: '✕' },
      ]
    }
  }

  if (days < 30) {
    return {
      text: isKz
        ? `${days} күн, ${name}.\nСен күшейіп келесің. Бүгін не жасаймыз?`
        : `${days} дней, ${name}.\nТы становишься сильнее. Что делаем?`,
      options: [
        { id: 'path', label: isKz ? '🗺 Жолым' : '🗺 Мой путь', section: 'path' },
        { id: 'trials', label: isKz ? '⚔️ Сынақтар' : '⚔️ Испытания', section: 'trials' },
        { id: 'mentor', label: isKz ? '🔥 Сөйлесу' : '🔥 Поговорить', section: 'mentor' },
        { id: 'close', label: '✕' },
      ]
    }
  }

  if (days < 90) {
    return {
      text: isKz
        ? `${days} күн. Сен — батыр, ${name}.\nДала мақтан тұтады. Жол жалғасады.`
        : `${days} дней. Ты — батыр, ${name}.\nСтепь гордится тобой. Путь продолжается.`,
      options: [
        { id: 'community', label: isKz ? '🏕 Ауылға' : '🏕 В аул', section: 'community' },
        { id: 'mentor', label: isKz ? '🔥 Ақсақал' : '🔥 Ақсақал', section: 'mentor' },
        { id: 'close', label: '✕' },
      ]
    }
  }

  return {
    text: isKz
      ? `${days} күн. Аңыз, ${name}.\nСен — басқаларға жол көрсетесің.`
      : `${days} дней. Легенда, ${name}.\nТы — указываешь путь другим.`,
    options: [
      { id: 'community', label: isKz ? '🏕 Ауылға' : '🏕 Помочь другим', section: 'community' },
      { id: 'mentor', label: isKz ? '🔥 Ақсақал' : '🔥 Ақсақал', section: 'mentor' },
      { id: 'close', label: '✕' },
    ]
  }
}

export default function JarvisGreeting({ user, locale, onOpenSection, onRegister }: Props) {
  const isKz = locale === 'kz'
  const [open, setOpen] = useState(false)
  const [phase, setPhase] = useState<'closed' | 'opening' | 'open' | 'closing'>('closed')
  const [hovered, setHovered] = useState(false)
  const [mem, setMem] = useState<Memory>({ lastVisit: '', visitCount: 0 })
  const days = user ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / 86400000) : 0
  const content = getGreeting(user, days, isKz, mem)
  const { out, done } = useTypewriter(content.text, phase === 'open')

  useEffect(() => {
    const m = getMemory()
    setMem(m)
    const todayKey = 'ashyq_jarvis_' + new Date().toISOString().slice(0, 10)
    if (!localStorage.getItem(todayKey)) {
      setTimeout(() => {
        openDialog()
        localStorage.setItem(todayKey, '1')
      }, 2000)
    }
  }, [])

  function openDialog() {
    const m = getMemory()
    const updated = { ...m, lastVisit: new Date().toISOString(), visitCount: m.visitCount + 1, firstName: user?.name?.split(' ')[0] }
    saveMemory(updated)
    setMem(updated)
    setOpen(true)
    setPhase('opening')
    setTimeout(() => setPhase('open'), 400)
  }

  function closeDialog() {
    setPhase('closing')
    setTimeout(() => { setOpen(false); setPhase('closed') }, 400)
  }

  function handleOption(id: string, section?: string) {
    if (id === 'close' || id === 'good' || id === 'look') { closeDialog(); return }
    if (id === 'start') { closeDialog(); setTimeout(onRegister, 400); return }
    if (section) { closeDialog(); setTimeout(() => onOpenSection(section), 400) }
  }

  return (
    <>
      <style>{`
        @keyframes orbFloat {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes orbGlow {
          0%,100% { box-shadow: 0 0 16px rgba(255,180,0,0.35), 0 0 32px rgba(255,140,0,0.15); }
          50% { box-shadow: 0 0 24px rgba(255,200,60,0.60), 0 0 48px rgba(255,160,0,0.25); }
        }
        @keyframes dialogSlideUp {
          from { opacity:0; transform:translateY(24px); }
          to { opacity:1; transform:translateY(0); }
        }
        @keyframes dialogSlideDown {
          from { opacity:1; transform:translateY(0); }
          to { opacity:0; transform:translateY(24px); }
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes tooltipFade { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
        .aksakal-opt { transition: all 0.18s ease; }
        .aksakal-opt:hover { background: rgba(255,200,60,0.14) !important; border-color: rgba(255,200,60,0.45) !important; color: rgba(255,230,150,1) !important; transform: translateX(4px); }
      `}</style>

      {/* ORB BUTTON */}
      {!open && (
        <div
          style={{ position: 'fixed', bottom: '44px', right: '14px', zIndex: 96, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
          onClick={openDialog}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Орб */}
          <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: 'radial-gradient(circle at 38% 32%, rgba(255,220,100,0.95), rgba(200,120,0,0.90))', animation: 'orbFloat 4s ease-in-out infinite, orbGlow 3s ease-in-out infinite', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <span style={{ fontSize: '22px', filter: 'drop-shadow(0 0 6px rgba(255,200,0,0.8))' }}>✦</span>
            {/* Пульс кольцо */}
            <div style={{ position: 'absolute', inset: '-6px', borderRadius: '50%', border: '1px solid rgba(255,200,60,0.25)', animation: 'orbGlow 3s ease-in-out infinite' }} />
          </div>

          {/* Подпись */}
          <div style={{ background: 'rgba(0,0,0,0.70)', backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '4px 12px', border: '1px solid rgba(255,200,60,0.25)', boxShadow: '0 2px 12px rgba(0,0,0,0.40)' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(255,210,80,0.95)', letterSpacing: '0.06em' }}>
              АҚСАҚАЛ
            </span>
          </div>

          {/* Тултип при наведении */}
          {hovered && (
            <div style={{ position: 'absolute', right: '62px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(8,4,20,0.94)', border: '1px solid rgba(255,200,60,0.25)', borderRadius: '14px', padding: '8px 14px', fontSize: '12px', color: 'rgba(255,220,140,0.90)', whiteSpace: 'nowrap', backdropFilter: 'blur(10px)', animation: 'tooltipFade 0.2s ease', boxShadow: '0 4px 20px rgba(0,0,0,0.40)' }}>
              {isKz ? 'Данамен сөйлес' : 'Поговорить с мудрецом'}
              <div style={{ position: 'absolute', right: '-5px', top: '50%', transform: 'translateY(-50%) rotate(45deg)', width: '8px', height: '8px', background: 'rgba(8,4,20,0.94)', border: '1px solid rgba(255,200,60,0.25)', borderLeft: 'none', borderBottom: 'none' }} />
            </div>
          )}
        </div>
      )}

      {/* ДИАЛОГ */}
      {open && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 300 }}>
          {/* Затемнение */}
          <div onClick={closeDialog} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', zIndex: -1 }} />

          <div style={{ animation: phase === 'closing' ? 'dialogSlideDown 0.35s ease forwards' : 'dialogSlideUp 0.35s ease forwards' }}>
            <div style={{ background: 'linear-gradient(160deg, rgba(8,4,18,0.97), rgba(14,6,28,0.98))', borderTop: '1px solid rgba(255,200,60,0.18)', borderRadius: '28px 28px 0 0', boxShadow: '0 -16px 60px rgba(180,100,0,0.20)', backdropFilter: 'blur(28px)', padding: '16px 20px 36px', maxWidth: '560px', margin: '0 auto' }}>

              {/* Хэндл */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '3px', borderRadius: '2px', background: 'rgba(255,200,60,0.20)' }} />
              </div>

              {/* Аватар + имя + кнопка закрыть */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', paddingBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'radial-gradient(circle at 38% 32%, rgba(255,220,100,0.50), rgba(180,100,0,0.35))', border: '1px solid rgba(255,200,60,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', boxShadow: '0 0 16px rgba(255,180,0,0.25)', flexShrink: 0 }}>✦</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: 'rgba(255,210,80,0.90)', letterSpacing: '0.12em' }}>АҚСАҚАЛ</div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.08em', marginTop: '1px' }}>
                    {isKz ? 'Дала данасы' : 'Мудрец степи'}
                    {mem.visitCount > 1 && <span style={{ marginLeft: '8px', color: 'rgba(255,200,60,0.40)' }}>· {isKz ? `${mem.visitCount} рет` : `${mem.visitCount} визита`}</span>}
                  </div>
                </div>
                <button onClick={closeDialog} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.30)', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
              </div>

              {/* Текст */}
              <div style={{ marginBottom: '18px', minHeight: '48px' }}>
                <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.75, color: 'rgba(240,225,200,0.92)', fontStyle: 'italic', whiteSpace: 'pre-line' }}>
                  {out}
                  {!done && phase === 'open' && (
                    <span style={{ display: 'inline-block', width: '2px', height: '16px', background: 'rgba(255,200,60,0.80)', marginLeft: '2px', verticalAlign: 'text-bottom', animation: 'blink 0.8s ease infinite' }} />
                  )}
                </p>
              </div>

              {/* Кнопки */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', opacity: done ? 1 : 0.3, transition: 'opacity 0.4s', pointerEvents: done ? 'all' : 'none' }}>
                {content.options.map((opt, i) => (
                  <button key={opt.id} className="aksakal-opt"
                    onClick={() => handleOption(opt.id, opt.section)}
                    style={{ padding: '12px 16px', borderRadius: '16px', border: `1px solid ${i === 0 ? 'rgba(255,200,60,0.35)' : 'rgba(255,255,255,0.07)'}`, background: i === 0 ? 'rgba(255,180,0,0.12)' : 'rgba(255,255,255,0.03)', color: i === 0 ? 'rgba(255,220,120,1)' : 'rgba(255,255,255,0.45)', fontSize: '13px', fontWeight: i === 0 ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '10px', color: i === 0 ? 'rgba(255,200,60,0.70)' : 'rgba(255,255,255,0.18)' }}>
                      {i === 0 ? '▶' : '◇'}
                    </span>
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Память — последний визит */}
              {mem.visitCount > 1 && (
                <div style={{ marginTop: '14px', textAlign: 'center', fontSize: '10px', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.08em' }}>
                  {isKz ? `${mem.visitCount} рет келдің` : `Это твой ${mem.visitCount}-й визит`}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}