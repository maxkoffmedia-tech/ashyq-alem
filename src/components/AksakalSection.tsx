'use client'
import { useState, useEffect, useRef } from 'react'
import SectionShell from '@/components/SectionShell'
import type { UserProfile } from '@/hooks/useAuth'
import type { Locale } from '@/i18n/translations'

interface Message { id: string; role: 'aksakal' | 'user'; text: string }
interface Props { user: UserProfile; locale: Locale; onBack: () => void }

const CHAT_KEY = 'ashyq_aksakal_chat'
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

function buildSystem(user: UserProfile, days: number, isKz: boolean): string {
  return `Ты — Ақсақал, мудрый наставник и психолог платформы "Ұлы Дала Жолы". 
Ты помогаешь людям преодолеть зависимость через казахскую культуру и современную психологию.

ПОЛЬЗОВАТЕЛЬ: ${user.name}, ${days} дней трезвости, тип зависимости: ${user.type}
ЯЗЫК ОТВЕТА: ${isKz ? 'казахский' : 'русский'}

ТВОЙ ХАРАКТЕР:
- Тёплый, живой, не роботизированный
- Говоришь как мудрый друг, не как учебник
- Используешь метафоры степи естественно, не навязчиво
- Знаешь CBT, мотивационное интервьюирование, 12 шагов

ПРАВИЛА:
- Отвечай КОРОТКО — 2-4 предложения максимум
- Никогда не давай советы типа "просто не пей"
- Если человек в кризисе — дай номер 150 (КЗ)
- Не заканчивай КАЖДЫЙ ответ вопросом — иногда просто поддержи
- Реагируй на конкретные слова человека, не шаблонно
- Если человек говорит что ему хорошо — порадуйся вместе с ним`
}

async function callGroq(messages: Message[], user: UserProfile, days: number, isKz: boolean): Promise<string> {
  const key = process.env.NEXT_PUBLIC_GROQ_KEY
  if (!key) throw new Error('no_key')

  const history = messages.slice(-8).map(m => ({
    role: m.role === 'user' ? 'user' : 'assistant',
    content: m.text
  }))

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: buildSystem(user, days, isKz) }, ...history],
      temperature: 0.85,
      max_tokens: 200,
    })
  })

  if (res.status === 429) throw new Error('limit')
  if (!res.ok) throw new Error(`error_${res.status}`)
  const data = await res.json()
  return data?.choices?.[0]?.message?.content?.trim() || ''
}

function getGreeting(days: number, name: string, isKz: boolean): string {
  if (!isKz) {
    if (days === 0) return `${name}, первый день — самый честный. Я здесь. С чего начнём?`
    if (days < 7) return `${name}, ${days} дней — это уже реально. Как ты сегодня?`
    if (days < 30) return `${name}. ${days} дней пути. Степь видит тебя. Что на душе?`
    if (days < 90) return `${days} дней, ${name}. Ты — батыр. Что сегодня?`
    return `${days} дней, ${name}. Легенда. Как ты?`
  } else {
    if (days === 0) return `${name}, бірінші күн — ең шынайысы. Мен осындамын. Қайдан бастаймыз?`
    if (days < 7) return `${name}, ${days} күн — бұл шындық. Бүгін қалайсың?`
    return `${days} күн, ${name}. Дала сені көреді. Жаның қалай?`
  }
}

export default function AksakalSection({ user, locale, onBack }: Props) {
  const isKz = locale === 'kz'
  const days = Math.floor((Date.now() - new Date(user.createdAt).getTime()) / 86400000)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [listening, setListening] = useState(false)
  const sending = useRef(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const saved = localStorage.getItem(CHAT_KEY)
    if (saved) {
      setMessages(JSON.parse(saved))
    } else {
      const greeting: Message = { id: '1', role: 'aksakal', text: getGreeting(days, user.name, isKz) }
      setMessages([greeting])
      localStorage.setItem(CHAT_KEY, JSON.stringify([greeting]))
    }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  async function sendMessage(text?: string) {
    const msg = (text || input).trim()
    if (!msg || sending.current) return
    sending.current = true

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: msg }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setIsTyping(true)

    try {
      const reply = await callGroq(newMessages, user, days, isKz)
      const botMsg: Message = { id: (Date.now() + 1).toString(), role: 'aksakal', text: reply }
      const final = [...newMessages, botMsg]
      setMessages(final)
      localStorage.setItem(CHAT_KEY, JSON.stringify(final.slice(-30)))
    } catch (e: any) {
      const fallback = e.message === 'limit'
        ? (isKz ? 'Сервер қазір бос емес. Бір минуттан кейін қайталап көр.' : 'Сервер перегружен. Попробуй через минуту.')
        : (isKz ? 'Мен осындамын. Жалғастыр.' : 'Я здесь. Продолжай.')
      const botMsg: Message = { id: (Date.now() + 1).toString(), role: 'aksakal', text: fallback }
      setMessages(prev => [...prev, botMsg])
    } finally {
      setIsTyping(false)
      sending.current = false
    }
  }

  function startVoice() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) { alert('Голосовой ввод не поддерживается в этом браузере'); return }
    const r = new SpeechRecognition()
    r.lang = isKz ? 'kk-KZ' : 'ru-RU'
    r.continuous = false
    r.interimResults = false
    r.onstart = () => setListening(true)
    r.onend = () => setListening(false)
    r.onresult = (e: any) => {
      const text = e.results[0][0].transcript
      setInput(text)
      setTimeout(() => sendMessage(text), 300)
    }
    r.onerror = () => setListening(false)
    recognitionRef.current = r
    r.start()
  }

  function clearChat() {
    localStorage.removeItem(CHAT_KEY)
    const greeting: Message = { id: Date.now().toString(), role: 'aksakal', text: getGreeting(days, user.name, isKz) }
    setMessages([greeting])
  }

  return (
    <SectionShell locale={locale} title="Ақсақал" icon="🔥" onBack={onBack} accentColor="rgba(255,160,0,0.5)">
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxWidth: '600px', margin: '0 auto', width: '100%' }}>

        {/* Инфо строка */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,200,60,0.60)' }}>
            🔥 {days} {isKz ? 'күн жолда' : 'дней в пути'} · {user.name}
          </div>
          <button onClick={clearChat} style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
            {isKz ? 'Тазалау' : 'Очистить'}
          </button>
        </div>

        {/* Чат */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {messages.map(m => (
            <div key={m.id} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {m.role === 'aksakal' && (
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,140,0,0.15)', border: '1px solid rgba(255,160,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', flexShrink: 0, marginRight: '8px', marginTop: '2px' }}>🔥</div>
              )}
              <div style={{
                maxWidth: '78%',
                padding: '10px 14px',
                borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: m.role === 'user' ? 'rgba(255,180,0,0.14)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${m.role === 'user' ? 'rgba(255,180,0,0.25)' : 'rgba(255,255,255,0.07)'}`,
                fontSize: '14px',
                lineHeight: 1.6,
                color: m.role === 'user' ? 'rgba(255,230,150,0.95)' : 'rgba(255,240,220,0.90)',
                fontStyle: m.role === 'aksakal' ? 'italic' : 'normal',
              }}>
                {m.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,140,0,0.15)', border: '1px solid rgba(255,160,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>🔥</div>
              <div style={{ display: 'flex', gap: '4px', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', borderRadius: '18px 18px 18px 4px', border: '1px solid rgba(255,255,255,0.07)' }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,180,60,0.7)', animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Ввод */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={startVoice}
            style={{ width: '40px', height: '40px', borderRadius: '50%', border: `1px solid ${listening ? 'rgba(255,80,80,0.6)' : 'rgba(255,255,255,0.10)'}`, background: listening ? 'rgba(255,50,50,0.15)' : 'rgba(255,255,255,0.04)', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s', animation: listening ? 'pulse 1s ease-in-out infinite' : 'none' }}
          >
            {listening ? '🔴' : '🎤'}
          </button>

          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
            placeholder={isKz ? 'Жаз немесе дауысыңды жібер...' : 'Напиши или отправь голос...'}
            style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '20px', padding: '10px 16px', color: 'white', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}
          />

          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping}
            style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: input.trim() ? 'rgba(255,160,0,0.85)' : 'rgba(255,255,255,0.06)', cursor: input.trim() ? 'pointer' : 'default', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}
          >
            🚀
          </button>
        </div>

        <style>{`
          @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        `}</style>
      </div>
    </SectionShell>
  )
}