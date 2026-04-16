'use client'
import { useState, useEffect, useRef } from 'react'
import SectionShell from '@/components/SectionShell'
import { db } from '@/lib/firebase'
import { ref, push, onValue, off, serverTimestamp } from 'firebase/database'
import type { UserProfile } from '@/hooks/useAuth'

interface Props { user: UserProfile | null; locale: 'ru' | 'kz'; onBack: () => void }

interface Message {
  id: string
  text: string
  name: string
  days: number
  type: 'victory' | 'struggle' | 'gratitude' | 'milestone' | 'message'
  hearts: number
  timestamp: number
  room: string
}

const ROOMS = [
  { id: 'general', emoji: '🔥', ru: 'У костра', kz: 'От жанында' },
  { id: 'family', emoji: '🤝', ru: 'Семьям', kz: 'Отбасыға' },
  { id: 'victory', emoji: '🏆', ru: 'Победы', kz: 'Жеңістер' },
]

const FAMILY_GUIDE = [
  { emoji: '🧠', ru: 'Что происходит с мозгом', kz: 'Мидың не болатыны', text_ru: 'Зависимость — это не слабость воли. Это изменение нейронных путей. Мозг зависимого буквально не может "просто остановиться". Это требует времени и поддержки.', text_kz: 'Тәуелділік — еріктің әлсіздігі емес. Бұл нейрондық жолдардың өзгеруі.' },
  { emoji: '💬', ru: 'Как говорить', kz: 'Қалай сөйлесу', text_ru: '✓ "Я беспокоюсь о тебе"\n✓ "Я вижу что тебе тяжело"\n✗ "Ты сам виноват"\n✗ "Просто возьми себя в руки"', text_kz: '✓ "Мен сен үшін алаңдаймын"\n✓ "Саған ауыр екенін көремін"\n✗ "Өзің кінәлісің"' },
  { emoji: '🚫', ru: 'Чего не делать', kz: 'Не істемеу', text_ru: '— Не скрывать последствия\n— Не угрожать, если не готов выполнить\n— Не пытаться контролировать каждый шаг\n— Не обвинять себя', text_kz: '— Салдарды жасырмаңыз\n— Орындауға дайын болмасаңыз қорқытпаңыз' },
  { emoji: '🛡', ru: 'Созависимость', kz: 'Бірлескен тәуелділік', text_ru: 'Вы тоже в пути. Ваши границы — это не эгоизм. Это необходимость.', text_kz: 'Сіз де жолдасыз. Сіздің шекараларыңыз — эгоизм емес.' },
]

export default function AoulSection({ user, locale, onBack }: Props) {
  const isKz = locale === 'kz'
  const [tab, setTab] = useState<'chat' | 'family' | 'sos'>('chat')
  const [room, setRoom] = useState('general')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [expandedGuide, setExpandedGuide] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const userDays = user ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / 86400000) : 0

  useEffect(() => {
    setLoading(true)
    const messagesRef = ref(db, `aoul/${room}`)
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const msgs = Object.entries(data).map(([id, val]: [string, any]) => ({
          id,
          ...val,
        })).sort((a, b) => a.timestamp - b.timestamp).slice(-50)
        setMessages(msgs)
      } else {
        setMessages([])
      }
      setLoading(false)
    })
    return () => off(messagesRef)
  }, [room])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    if (!input.trim() || sending) return
    setSending(true)
    try {
      await push(ref(db, `aoul/${room}`), {
        text: input.trim(),
        name: user?.name || (isKz ? 'Жолаушы' : 'Путник'),
        days: userDays,
        type: 'message',
        hearts: 0,
        timestamp: Date.now(),
        room,
      })
      setInput('')
    } catch (e) {
      console.error(e)
    } finally {
      setSending(false)
    }
  }

  const tabs = [
    { id: 'chat', emoji: '🔥', ru: 'Аул', kz: 'Ауыл' },
    { id: 'family', emoji: '🤝', ru: 'Семьям', kz: 'Отбасыға' },
    { id: 'sos', emoji: '🆘', ru: 'SOS', kz: 'Көмек' },
  ]

  return (
    <SectionShell locale={locale} title={isKz ? 'Цифрлық Ауыл' : 'Цифровой Аул'} icon="🏕" onBack={onBack} accentColor="rgba(244,162,97,0.6)">
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .msg-bubble { animation: fadeUp 0.2s ease; }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxWidth: '600px', margin: '0 auto', width: '100%' }}>

        {/* ТАБЫ */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.20)', flexShrink: 0 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id as any)}
              style={{ flex: 1, padding: '12px 4px', border: 'none', borderBottom: tab === t.id ? '2px solid #f4a261' : '2px solid transparent', background: 'transparent', color: tab === t.id ? '#f4a261' : 'rgba(255,255,255,0.30)', fontSize: '11px', fontWeight: tab === t.id ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', transition: 'all 0.2s' }}>
              <span style={{ fontSize: '18px' }}>{t.emoji}</span>
              {isKz ? t.kz : t.ru}
            </button>
          ))}
        </div>

        {/* ═══ ЧАТ ═══ */}
        {tab === 'chat' && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>

            {/* Комнаты */}
            <div style={{ display: 'flex', gap: '6px', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0, overflowX: 'auto' }}>
              {ROOMS.map(r => (
                <button key={r.id} onClick={() => setRoom(r.id)}
                  style={{ padding: '5px 12px', borderRadius: '14px', border: `1px solid ${room === r.id ? 'rgba(244,162,97,0.50)' : 'rgba(255,255,255,0.08)'}`, background: room === r.id ? 'rgba(244,162,97,0.14)' : 'rgba(255,255,255,0.03)', color: room === r.id ? '#f4a261' : 'rgba(255,255,255,0.45)', fontSize: '11px', fontWeight: room === r.id ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {r.emoji} {isKz ? r.kz : r.ru}
                </button>
              ))}
            </div>

            {/* Сообщения */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {loading && (
                <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.30)', fontSize: '13px' }}>
                  {isKz ? 'Жүктелуде...' : 'Загрузка...'}
                </div>
              )}
              {!loading && messages.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔥</div>
                  <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>
                    {isKz ? 'От жана бастайды.\nБірінші болып жаз.' : 'Костёр только разгорается.\nНапиши первым.'}
                  </div>
                </div>
              )}
              {messages.map(msg => {
                const isMe = msg.name === (user?.name || '')
                return (
                  <div key={msg.id} className="msg-bubble"
                    style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', gap: '8px', alignItems: 'flex-end' }}>
                    {!isMe && (
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(244,162,97,0.15)', border: '1px solid rgba(244,162,97,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>🔥</div>
                    )}
                    <div style={{ maxWidth: '75%' }}>
                      {!isMe && (
                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginBottom: '3px', paddingLeft: '4px' }}>
                          {msg.name} · {msg.days} {isKz ? 'күн' : 'дн.'}
                        </div>
                      )}
                      <div style={{ padding: '10px 14px', borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: isMe ? 'rgba(244,162,97,0.20)' : 'rgba(255,255,255,0.07)', border: `1px solid ${isMe ? 'rgba(244,162,97,0.30)' : 'rgba(255,255,255,0.08)'}`, fontSize: '14px', lineHeight: 1.5, color: isMe ? 'rgba(255,230,180,0.95)' : 'rgba(255,255,255,0.85)' }}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={bottomRef} />
            </div>

            {/* Ввод */}
            <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                placeholder={isKz ? '🔥 Ауылға жаз...' : '🔥 Напиши аулу...'}
                style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '20px', padding: '10px 16px', color: 'white', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}
                onFocus={e => e.target.style.borderColor = 'rgba(244,162,97,0.40)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.10)'}
              />
              <button onClick={sendMessage} disabled={!input.trim() || sending}
                style={{ width: '42px', height: '42px', borderRadius: '50%', border: 'none', background: input.trim() ? 'rgba(244,162,97,0.85)' : 'rgba(255,255,255,0.06)', cursor: input.trim() ? 'pointer' : 'default', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                🚀
              </button>
            </div>
          </div>
        )}

        {/* ═══ СЕМЬЯМ ═══ */}
        {tab === 'family' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ padding: '18px', borderRadius: '20px', background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.20)', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', marginBottom: '10px' }}>🤝</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'rgba(220,200,255,0.90)', marginBottom: '8px' }}>
                {isKz ? 'Бұл бет — сіздікі' : 'Эта страница — ваша'}
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.65 }}>
                {isKz ? 'Сіз де жолдасыз. Мұнда сіз жалғыз емессіз.' : 'Вы тоже в пути. Здесь вы не одни.'}
              </p>
            </div>
            {FAMILY_GUIDE.map((item, i) => (
              <div key={i} onClick={() => setExpandedGuide(expandedGuide === i ? null : i)}
                style={{ padding: '16px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${expandedGuide === i ? 'rgba(167,139,250,0.35)' : 'rgba(255,255,255,0.07)'}`, cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '24px' }}>{item.emoji}</span>
                  <div style={{ flex: 1, fontSize: '14px', fontWeight: 600, color: expandedGuide === i ? 'rgba(210,185,255,0.95)' : 'rgba(255,255,255,0.80)' }}>
                    {isKz ? item.kz : item.ru}
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.25)' }}>{expandedGuide === i ? '▲' : '▼'}</span>
                </div>
                {expandedGuide === i && (
                  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '13px', color: 'rgba(255,255,255,0.60)', lineHeight: 1.70, whiteSpace: 'pre-line' }}>
                    {isKz ? item.text_kz : item.text_ru}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ═══ SOS ═══ */}
        {tab === 'sos' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '20px', borderRadius: '20px', background: 'rgba(248,113,113,0.10)', border: '1px solid rgba(248,113,113,0.28)', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>🆘</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#f87171', marginBottom: '6px' }}>
                {isKz ? 'Сен жалғыз емессің' : 'Ты не один'}
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
                {isKz ? 'Тяга — бұл толқын. Орташа ұзақтығы — 20 минут.' : 'Тяга — это волна. Средняя длина — 20 минут. Позвони прямо сейчас.'}
              </p>
            </div>
            {[
              { name: 'Национальная линия доверия', nameKz: 'Ұлттық сенім желісі', phone: '150', desc_ru: 'Бесплатно, круглосуточно', desc_kz: 'Тегін, тәулік бойы', color: '#f87171' },
              { name: 'Служба психологической помощи', nameKz: 'Психологиялық көмек', phone: '111', desc_ru: 'Помощь семьям и детям', desc_kz: 'Отбасы мен балаларға', color: '#f4a261' },
              { name: 'Amanat Rehab', nameKz: 'Amanat Rehab', phone: '+7 701 223 75 57', desc_ru: 'Реабилитационный центр 24/7', desc_kz: 'Оңалту орталығы 24/7', color: '#6fcf8e' },
            ].map((c, i) => (
              <a key={i} href={`tel:${c.phone}`}
                style={{ padding: '16px', borderRadius: '20px', background: `${c.color}0a`, border: `1px solid ${c.color}28`, display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${c.color}18`, border: `1px solid ${c.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>📞</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'rgba(255,255,255,0.88)', marginBottom: '3px' }}>{isKz ? c.nameKz : c.name}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{isKz ? c.desc_kz : c.desc_ru}</div>
                </div>
                <div style={{ fontSize: '16px', fontWeight: 900, color: c.color }}>{c.phone}</div>
              </a>
            ))}

            {/* Техника 5-4-3-2-1 */}
            <div style={{ padding: '18px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,200,60,0.80)', marginBottom: '12px' }}>
                ⚡ {isKz ? 'Жерге байлану техникасы' : 'Техника заземления 5-4-3-2-1'}
              </div>
              {[
                { n: 5, ru: 'вещей которые ты ВИДИШЬ', kz: 'КӨРЕТІН нәрсе' },
                { n: 4, ru: 'вещи которые ты ЧУВСТВУЕШЬ', kz: 'СЕЗІНЕТІН нәрсе' },
                { n: 3, ru: 'вещи которые ты СЛЫШИШЬ', kz: 'ЕСТИТІН нәрсе' },
                { n: 2, ru: 'вещи которые ты НЮХАЕШЬ', kz: 'ИІСКЕЙТІН нәрсе' },
                { n: 1, ru: 'вещь которую ты ЧУВСТВУЕШЬ НА ВКУС', kz: 'ТАТИТЫН нәрсе' },
              ].map(step => (
                <div key={step.n} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,200,60,0.12)', border: '1px solid rgba(255,200,60,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: '#ffd060', flexShrink: 0 }}>{step.n}</div>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.60)' }}>{isKz ? step.kz : step.ru}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SectionShell>
  )
}