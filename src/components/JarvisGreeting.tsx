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

function getContent(user: UserProfile | null, days: number, isKz: boolean) {
  if (!user) return {
    text: isKz ? 'Сәлем, жолаушы. Мен — Ақсақал. Не іздейсің?' : 'Приветствую, путник. Я — Ақсақал. Чего ты ищешь?',
    options: [
      { id: 'self', label: isKz ? '⚔️ Зависимостен босағым келеді' : '⚔️ Хочу освободиться от зависимости' },
      { id: 'family', label: isKz ? '🤝 Жақыным үшін келдім' : '🤝 Пришёл за близкого человека' },
      { id: 'close', label: isKz ? '👁 Жай қарап жүрмін' : '👁 Просто смотрю' },
    ],
  }
  if (days < 7) return {
    text: isKz ? `${days} күн. ${user.name}, бүгін қалайсың?` : `${days} дней в пути. Как ты сегодня, ${user.name}?`,
    options: [
      { id: 'good', label: '💪 Держусь нормально' },
      { id: 'mentor', label: '🔥 Тяжело — поговорить', section: 'mentor' },
      { id: 'close', label: '✕ Закрыть' },
    ],
  }
  if (days < 30) return {
    text: isKz ? `${days} күн, ${user.name}. Бүгін не жасаймыз?` : `${days} дней, ${user.name}. Что делаем сегодня?`,
    options: [
      { id: 'trials', label: '⚔️ Испытания дня', section: 'trials' },
      { id: 'mentor', label: '🔥 Поговорить с Ақсақалом', section: 'mentor' },
      { id: 'close', label: '✕ Закрыть' },
    ],
  }
  if (days < 90) return {
    text: isKz ? `${days} күн. Сен — батыр, ${user.name}.` : `${days} дней. Ты — батыр, ${user.name}. Степь гордится тобой.`,
    options: [
      { id: 'trials', label: '⚔️ Испытания', section: 'trials' },
      { id: 'path', label: '🗺 Мой путь', section: 'path' },
      { id: 'close', label: '✕ Закрыть' },
    ],
  }
  return {
    text: isKz ? `${days} күн. Аңыз. ${user.name}.` : `${days} дней. Легенда. ${user.name} — зажигает костёр и указывает путь.`,
    options: [
      { id: 'community', label: '🏕 Помочь другим', section: 'community' },
      { id: 'mentor', label: '🔥 Ақсақал', section: 'mentor' },
      { id: 'close', label: '✕ Закрыть' },
    ],
  }
}

function useTypewriter(text: string, active: boolean) {
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
        timer.current = setTimeout(tick, 22)
      } else setDone(true)
    }
    timer.current = setTimeout(tick, 600)
    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [text, active])
  return { out, done }
}

export default function JarvisGreeting({ user, locale, onOpenSection, onRegister }: Props) {
  const isKz = locale === 'kz'
  const [open, setOpen] = useState(false)
  const days = user ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / 86400000) : 0
  const content = getContent(user, days, isKz)
  const { out, done } = useTypewriter(content.text, open)

  useEffect(() => {
    const key = 'ashyq_jarvis_' + new Date().toISOString().slice(0, 10)
    if (!localStorage.getItem(key)) {
      setTimeout(() => { setOpen(true); localStorage.setItem(key, '1') }, 3000)
    }
  }, [])

  function handleOption(id: string, section?: string) {
    if (id === 'close' || id === 'good') { setOpen(false); return }
    if (!user && (id === 'self' || id === 'family')) { setOpen(false); setTimeout(onRegister, 300); return }
    if (section) { setOpen(false); setTimeout(() => onOpenSection(section), 300) }
  }

  return (
    <div>
      <style>{`
        @keyframes runeGlow {
          0%,100% { box-shadow: 0 0 10px rgba(255,180,0,0.25); opacity: 0.85; }
          50% { box-shadow: 0 0 22px rgba(255,180,0,0.55), 0 0 40px rgba(255,140,0,0.25); opacity: 1; }
        }
        @keyframes dialogUp {
          from { opacity:0; transform:translateY(16px); }
          to { opacity:1; transform:translateY(0); }
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .sopt:hover { background: rgba(180,140,255,0.16) !important; border-color: rgba(180,140,255,0.48) !important; color: rgba(230,210,255,1) !important; transform: translateX(4px); }
        .sopt { transition: all 0.18s ease; }
      `}</style>

      {/* РУНА — кнопка вызова */}
      {!open && (
        <button onClick={() => setOpen(true)} style={{ position: 'fixed', bottom: '50px', right: '16px', zIndex: 96, width: '44px', height: '44px', borderRadius: '50%', border: '1px solid rgba(255,200,60,0.35)', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(12px)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px', animation: 'runeGlow 3s ease-in-out infinite' }}>
          <span style={{ fontSize: '18px', lineHeight: 1 }}>✦</span>
          <span style={{ fontSize: '7px', color: 'rgba(255,200,60,0.70)', letterSpacing: '0.06em', fontWeight: 700 }}>АҚС</span>
        </button>
      )}

      {/* ДИАЛОГ */}
      {open && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200, animation: 'dialogUp 0.35s ease' }}>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', zIndex: -1 }} />
          <div style={{ background: 'linear-gradient(160deg, rgba(6,2,16,0.97), rgba(12,5,28,0.98))', borderTop: '1px solid rgba(180,140,255,0.22)', borderRadius: '24px 24px 0 0', boxShadow: '0 -16px 60px rgba(100,60,200,0.28)', backdropFilter: 'blur(24px)', padding: '18px 20px 40px', maxWidth: '560px', margin: '0 auto' }}>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid rgba(180,140,255,0.10)' }}>
              <span style={{ fontSize: '22px', marginRight: '10px' }}>✦</span>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(180,140,255,0.75)', letterSpacing: '0.20em', textTransform: 'uppercase' }}>АҚСАҚАЛ</div>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.10em' }}>{isKz ? 'Дала данасы' : 'Мудрец степи'}</div>
              </div>
              <button onClick={() => setOpen(false)} style={{ marginLeft: 'auto', width: '30px', height: '30px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.35)', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>

            <div style={{ marginBottom: '20px', minHeight: '52px' }}>
              <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.72, color: 'rgba(230,215,255,0.92)', fontStyle: 'italic' }}>
                {out}
                {!done && <span style={{ display: 'inline-block', width: '2px', height: '15px', background: 'rgba(180,140,255,0.85)', marginLeft: '2px', verticalAlign: 'text-bottom', animation: 'blink 0.8s ease infinite' }} />}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', opacity: done ? 1 : 0, transition: 'opacity 0.4s', pointerEvents: done ? 'all' : 'none' }}>
              {content.options.map((opt, i) => (
                <button key={opt.id} className="sopt" onClick={() => handleOption(opt.id, (opt as any).section)} style={{ padding: '12px 16px', borderRadius: '14px', border: `1px solid ${i === 0 ? 'rgba(180,140,255,0.40)' : 'rgba(255,255,255,0.07)'}`, background: i === 0 ? 'rgba(120,80,200,0.18)' : 'rgba(255,255,255,0.03)', color: i === 0 ? 'rgba(215,190,255,1)' : 'rgba(255,255,255,0.45)', fontSize: '13px', fontWeight: i === 0 ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '10px', color: i === 0 ? 'rgba(180,140,255,0.8)' : 'rgba(255,255,255,0.20)' }}>{i === 0 ? '▶' : '◇'}</span>
                  {opt.label}
                </button>
              ))}
            </div>

            <div style={{ marginTop: '16px', height: '1px', background: 'linear-gradient(to right, transparent, rgba(180,140,255,0.15), transparent)' }} />
          </div>
        </div>
      )}
    </div>
  )
}