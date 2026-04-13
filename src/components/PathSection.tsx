'use client'
import { useState, useEffect } from 'react'
import SectionShell from '@/components/SectionShell'
import type { UserProfile } from '@/hooks/useAuth'
import type { Locale } from '@/i18n/translations'

interface Props {
  user: UserProfile
  locale: Locale
  onBack: () => void
  onResetPath: () => void
}

interface CheckIn {
  date: string
  mood: 'strong' | 'ok' | 'hard' | 'crisis'
  note: string
}

const MOOD = {
  strong: { emoji: '💪', ru: 'Батыр',    kz: 'Батыр',    color: '#6fcf8e', desc_ru: 'Держусь уверенно',      desc_kz: 'Сенімді тұрмын' },
  ok:     { emoji: '🌿', ru: 'Нормально', kz: 'Қалыпты',  color: '#60c5fa', desc_ru: 'Обычный день',           desc_kz: 'Қарапайым күн' },
  hard:   { emoji: '🌧', ru: 'Тяжело',   kz: 'Ауыр',     color: '#f4a261', desc_ru: 'Непросто, но держусь',   desc_kz: 'Ауыр, бірақ тұрмын' },
  crisis: { emoji: '🆘', ru: 'Кризис',   kz: 'Дағдарыс', color: '#f87171', desc_ru: 'Нужна помощь прямо сейчас', desc_kz: 'Қазір көмек керек' },
}

const MILESTONES = [
  { days: 1,   emoji: '🌱', ru: 'Первый шаг',      kz: 'Бірінші қадам',     color: '#6bcb77' },
  { days: 3,   emoji: '🌿', ru: 'Три дня силы',    kz: 'Үш күн күш',        color: '#4d9e6d' },
  { days: 7,   emoji: '🔥', ru: 'Неделя пути',     kz: 'Бір апта жол',      color: '#ffd060' },
  { days: 14,  emoji: '⚡', ru: 'Две недели',      kz: 'Екі апта',          color: '#f4a261' },
  { days: 21,  emoji: '🛡', ru: 'Новая привычка',  kz: 'Жаңа әдет',         color: '#e76f51' },
  { days: 30,  emoji: '🏹', ru: 'Месяц батыра',    kz: 'Батыр айы',         color: '#c77dff' },
  { days: 40,  emoji: '🐎', ru: 'Сорок дней',      kz: 'Қырық күн',         color: '#9d4edd' },
  { days: 60,  emoji: '👑', ru: 'Два месяца',      kz: 'Екі ай',            color: '#ffd700' },
  { days: 90,  emoji: '🌙', ru: 'Три месяца',      kz: 'Үш ай',             color: '#48cae4' },
  { days: 180, emoji: '⭐', ru: 'Полгода',         kz: 'Жарты жыл',         color: '#ade8f4' },
  { days: 365, emoji: '🦅', ru: 'Год свободы',     kz: 'Бір жыл еркіндік',  color: '#ffd060' },
]

const TASKS = [
  { ru: 'Выпей 8 стаканов воды сегодня',            kz: 'Бүгін 8 стақан су іш',              xp: 20 },
  { ru: '20 минут прогулки без телефона',            kz: '20 минут телефонсыз серуен',        xp: 30 },
  { ru: 'Напиши 3 вещи за которые благодарен',       kz: 'Риза болатын 3 нәрсені жаз',        xp: 25 },
  { ru: '10 минут глубокого дыхания',                kz: '10 минут терең тыныс алу',          xp: 20 },
  { ru: 'Позвони кому-то важному сегодня',           kz: 'Бүгін маңызды біреуге қоңырау шал', xp: 40 },
  { ru: 'Прочитай 10 страниц хорошей книги',         kz: '10 бет жақсы кітап оқы',            xp: 35 },
  { ru: 'Сделай одно доброе дело для другого',       kz: 'Басқа біреу үшін бір жақсылық жаса', xp: 50 },
  { ru: '30 минут без соцсетей и новостей',          kz: '30 минут әлеуметтік желісіз',       xp: 30 },
  { ru: 'Приготовь здоровую еду сам',                kz: 'Өзің дұрыс тамақ пісір',            xp: 35 },
  { ru: 'Напиши письмо себе будущему',               kz: 'Болашақ өзіңе хат жаз',             xp: 45 },
]

const PATH_KEY = 'ashyq_path_v2'
const todayStr = () => new Date().toISOString().slice(0, 10)

export default function PathSection({ user, locale, onBack, onResetPath }: Props) {
  const isKz = locale === 'kz'
  const days = Math.floor((Date.now() - new Date(user.createdAt).getTime()) / 86400000)
  const [tab, setTab] = useState<'today' | 'milestones' | 'economy' | 'journal'>('today')
  const [checkins, setCheckins] = useState<CheckIn[]>([])
  const [mood, setMood] = useState<keyof typeof MOOD | null>(null)
  const [note, setNote] = useState('')
  const [saved, setSaved] = useState(false)
  const [xpAnim, setXpAnim] = useState<number | null>(null)
  const [showReset, setShowReset] = useState(false)

  const task = TASKS[days % TASKS.length]
  const todayDone = checkins.find(c => c.date === todayStr())
  const currentM = [...MILESTONES].reverse().find(m => days >= m.days)
  const nextM = MILESTONES.find(m => m.days > days)
  const progress = currentM && nextM
    ? Math.min(100, ((days - currentM.days) / (nextM.days - currentM.days)) * 100)
    : days >= 365 ? 100 : 0

  useEffect(() => {
    const saved = localStorage.getItem(PATH_KEY)
    if (saved) setCheckins(JSON.parse(saved))
  }, [])
const ADDICTION_COSTS: Record<string, { ru: string; kz: string; daily: number; unit_ru: string; unit_kz: string }> = {
  alcohol:      { ru: 'Алкоголь',    kz: 'Алкоголь',    daily: 3000,  unit_ru: '₸/день',  unit_kz: '₸/күн' },
  drugs:        { ru: 'Наркотики',   kz: 'Есірткі',     daily: 15000, unit_ru: '₸/день',  unit_kz: '₸/күн' },
  tobacco:      { ru: 'Табак',       kz: 'Темекі',      daily: 600,   unit_ru: '₸/день',  unit_kz: '₸/күн' },
  gambling:     { ru: 'Игромания',   kz: 'Лудомания',   daily: 8000,  unit_ru: '₸/день',  unit_kz: '₸/күн' },
  gaming:       { ru: 'Гейминг',     kz: 'Ойын',        daily: 1000,  unit_ru: '₸/день',  unit_kz: '₸/күн' },
  social:       { ru: 'Соцсети',     kz: 'Соцжелі',     daily: 500,   unit_ru: '₸/день',  unit_kz: '₸/күн' },
  codependency: { ru: 'Созависимость', kz: 'Бірлескен', daily: 2000,  unit_ru: '₸/день',  unit_kz: '₸/күн' },
  other:        { ru: 'Другое',      kz: 'Басқа',       daily: 2000,  unit_ru: '₸/день',  unit_kz: '₸/күн' },
}

const PURCHASES = [
  { emoji: '📱', ru: 'iPhone 15',        kz: 'iPhone 15',        price: 450000 },
  { emoji: '✈️', ru: 'Перелёт в Дубай',  kz: 'Дубайға ұшу',      price: 120000 },
  { emoji: '🎓', ru: 'Курс обучения',    kz: 'Оқу курсы',        price: 80000  },
  { emoji: '🏋️', ru: 'Абонемент в зал',  kz: 'Спортзал абон.',   price: 15000  },
  { emoji: '📚', ru: '10 книг',          kz: '10 кітап',         price: 25000  },
  { emoji: '🍽️', ru: 'Ресторан на двоих', kz: 'Мейрамхана',      price: 20000  },
  { emoji: '🚗', ru: 'Обслуживание авто', kz: 'Авто жөндеу',     price: 50000  },
  { emoji: '💆', ru: '10 сеансов массажа', kz: '10 массаж',      price: 30000  },
]
  function saveCheckin() {
    if (!mood) return
    const checkin: CheckIn = { date: todayStr(), mood, note }
    const updated = [...checkins.filter(c => c.date !== todayStr()), checkin]
    setCheckins(updated)
    localStorage.setItem(PATH_KEY, JSON.stringify(updated))
    setSaved(true)
    setXpAnim(task.xp)
    setTimeout(() => setXpAnim(null), 2000)
  }

  const tabs = [
  { id: 'today',      emoji: '⚡', ru: 'Сегодня', kz: 'Бүгін'    },
  { id: 'milestones', emoji: '🗺', ru: 'Вехи',    kz: 'Белестер' },
  { id: 'economy',   emoji: '💰', ru: 'Экономия', kz: 'Үнемдеу'  },
  { id: 'journal',    emoji: '📖', ru: 'Дневник',  kz: 'Күнделік' },
 ]

  return (
    <SectionShell locale={locale} title={isKz ? 'Жол' : 'Путь'} icon="🗺" onBack={onBack} accentColor="rgba(255,200,60,0.6)">
      <style>{`
        @keyframes xpFloat { 0%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(-60px)} }
        @keyframes glowPulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
        .mood-btn:hover { transform: scale(1.03); }
        .tab-btn:hover { color: rgba(255,200,60,0.8) !important; }
      `}</style>

      {/* XP анимация */}
      {xpAnim && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 999, fontSize: '28px', fontWeight: 900, color: '#ffd060', textShadow: '0 0 20px rgba(255,200,0,0.8)', animation: 'xpFloat 2s ease forwards', pointerEvents: 'none' }}>
          +{xpAnim} XP ⚡
        </div>
      )}

      <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>

        {/* ГЕРОЙ — счётчик дней */}
        <div style={{ padding: '24px 20px 16px', textAlign: 'center', position: 'relative' }}>
          {/* Свечение за числом */}
          <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', width: '120px', height: '120px', borderRadius: '50%', background: `radial-gradient(circle, ${currentM?.color || '#ffd060'}25, transparent 70%)`, animation: 'glowPulse 3s ease-in-out infinite', pointerEvents: 'none' }} />

          <div style={{ fontSize: '80px', fontWeight: 900, color: currentM?.color || '#ffd060', lineHeight: 1, textShadow: `0 0 40px ${currentM?.color || '#ffd060'}60`, fontVariantNumeric: 'tabular-nums', position: 'relative' }}>
            {days}
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.3em', marginTop: '6px' }}>
            {isKz ? 'күн еркіндікте' : 'дней свободы'}
          </div>

          {/* Текущий milestone */}
          {currentM && (
            <div style={{ marginTop: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '7px 18px', borderRadius: '24px', background: `${currentM.color}14`, border: `1px solid ${currentM.color}40`, animation: 'glowPulse 4s ease-in-out infinite' }}>
              <span style={{ fontSize: '20px' }}>{currentM.emoji}</span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: currentM.color }}>
                {isKz ? currentM.kz : currentM.ru}
              </span>
            </div>
          )}

          {/* Прогресс к следующей вехе */}
          {nextM && (
            <div style={{ margin: '14px 0 0', padding: '0 4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'rgba(255,255,255,0.28)', marginBottom: '7px' }}>
                <span>{days} {isKz ? 'күн' : 'дн.'}</span>
                <span style={{ color: nextM.color }}>{nextM.emoji} {isKz ? nextM.kz : nextM.ru} · {nextM.days} {isKz ? 'күн' : 'дн.'}</span>
              </div>
              <div style={{ height: '5px', borderRadius: '3px', background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg, ${currentM?.color || '#ffd060'}, ${nextM.color})`, borderRadius: '3px', transition: 'width 1.2s ease', boxShadow: `0 0 10px ${nextM.color}50` }} />
              </div>
            </div>
          )}
        </div>

        {/* ТАБЫ */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.20)' }}>
          {tabs.map(t => (
            <button key={t.id} className="tab-btn" onClick={() => setTab(t.id as any)}
              style={{ flex: 1, padding: '11px 4px', border: 'none', borderBottom: tab === t.id ? '2px solid #ffd060' : '2px solid transparent', background: 'transparent', color: tab === t.id ? '#ffd060' : 'rgba(255,255,255,0.30)', fontSize: '11px', fontWeight: tab === t.id ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', transition: 'all 0.2s' }}>
              <span style={{ fontSize: '18px' }}>{t.emoji}</span>
              {isKz ? t.kz : t.ru}
            </button>
          ))}
        </div>

        <div style={{ padding: '16px 16px 100px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* ═══ ТАБ: СЕГОДНЯ ═══ */}
          {tab === 'today' && (
            <>
              {/* Квест дня */}
              <div style={{ padding: '18px', borderRadius: '22px', background: 'linear-gradient(135deg, rgba(255,200,60,0.08), rgba(255,150,0,0.05))', border: '1px solid rgba(255,200,60,0.20)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', background: 'radial-gradient(circle at top right, rgba(255,200,60,0.10), transparent)', pointerEvents: 'none' }} />
                <div style={{ fontSize: '10px', color: 'rgba(255,200,60,0.70)', fontWeight: 800, letterSpacing: '0.20em', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  ⚡ {isKz ? 'Күн тапсырмасы' : 'Задание дня'}
                  <span style={{ marginLeft: 'auto', padding: '2px 10px', borderRadius: '10px', background: 'rgba(255,200,60,0.15)', color: '#ffd060', fontSize: '10px' }}>+{task.xp} XP</span>
                </div>
                <p style={{ margin: 0, fontSize: '16px', color: 'rgba(255,255,255,0.90)', lineHeight: 1.5, fontWeight: 500 }}>
                  {isKz ? task.kz : task.ru}
                </p>
              </div>

              {/* Если уже отметил сегодня */}
              {todayDone ? (
                <div style={{ padding: '24px', borderRadius: '22px', background: `${MOOD[todayDone.mood].color}10`, border: `1px solid ${MOOD[todayDone.mood].color}30`, textAlign: 'center' }}>
                  <div style={{ fontSize: '40px', marginBottom: '10px' }}>{MOOD[todayDone.mood].emoji}</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: MOOD[todayDone.mood].color, marginBottom: '6px' }}>
                    {isKz ? 'Бүгін белгіленді!' : 'День отмечен!'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.40)' }}>
                    {isKz ? MOOD[todayDone.mood].desc_kz : MOOD[todayDone.mood].desc_ru}
                  </div>
                  {todayDone.note && (
                    <div style={{ marginTop: '14px', padding: '12px', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.55)', fontStyle: 'italic', lineHeight: 1.6 }}>«{todayDone.note}»</p>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Выбор настроения */}
                  <div style={{ padding: '18px', borderRadius: '22px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '14px' }}>
                      {isKz ? 'Бүгін қалайсың?' : 'Как ты сегодня?'}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {(Object.entries(MOOD) as [keyof typeof MOOD, typeof MOOD[keyof typeof MOOD]][]).map(([key, cfg]) => (
                        <button key={key} className="mood-btn" onClick={() => setMood(key)}
                          style={{ padding: '14px 12px', borderRadius: '18px', border: `1px solid ${mood === key ? cfg.color : 'rgba(255,255,255,0.08)'}`, background: mood === key ? `${cfg.color}18` : 'rgba(255,255,255,0.03)', color: 'white', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}>
                          <span style={{ fontSize: '26px' }}>{cfg.emoji}</span>
                          <span style={{ fontSize: '12px', fontWeight: mood === key ? 700 : 400, color: mood === key ? cfg.color : 'rgba(255,255,255,0.60)' }}>
                            {isKz ? cfg.kz : cfg.ru}
                          </span>
                          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.28)', textAlign: 'center', lineHeight: 1.3 }}>
                            {isKz ? cfg.desc_kz : cfg.desc_ru}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Кризис — экстренная помощь */}
                  {mood === 'crisis' && (
                    <div style={{ padding: '18px', borderRadius: '20px', background: 'rgba(248,113,113,0.10)', border: '1px solid rgba(248,113,113,0.35)', textAlign: 'center' }}>
                      <div style={{ fontSize: '14px', color: '#f87171', fontWeight: 700, marginBottom: '6px' }}>
                        {isKz ? '🆘 Сен жалғыз емессің' : '🆘 Ты не один — помощь рядом'}
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginBottom: '14px' }}>
                        {isKz ? 'Қазір маманға қоңырау шал' : 'Позвони специалисту прямо сейчас'}
                      </div>
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <a href="tel:150" style={{ padding: '10px 24px', borderRadius: '14px', background: 'rgba(248,113,113,0.20)', border: '1px solid rgba(248,113,113,0.40)', color: '#f87171', fontSize: '16px', fontWeight: 800, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          📞 150
                        </a>
                        <a href="tel:111" style={{ padding: '10px 24px', borderRadius: '14px', background: 'rgba(248,113,113,0.20)', border: '1px solid rgba(248,113,113,0.40)', color: '#f87171', fontSize: '16px', fontWeight: 800, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          📞 111
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Заметка */}
                  <div style={{ position: 'relative' }}>
                    <textarea value={note} onChange={e => setNote(e.target.value)}
                      placeholder={isKz ? '📝 Бүгін не болды? Ойларыңды жаз...' : '📝 Что происходит? Поделись мыслью...'}
                      rows={3}
                      style={{ width: '100%', padding: '14px 16px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.09)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.85)', fontSize: '14px', resize: 'none', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', lineHeight: 1.6, transition: 'border-color 0.2s' }}
                      onFocus={e => e.target.style.borderColor = 'rgba(255,200,60,0.35)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'}
                    />
                  </div>

                  {/* Кнопка сохранить */}
                  <button onClick={saveCheckin} disabled={!mood}
                    style={{ padding: '15px', borderRadius: '20px', border: 'none', background: mood ? 'linear-gradient(135deg, rgba(255,200,60,0.90), rgba(255,150,0,0.80))' : 'rgba(255,255,255,0.06)', color: mood ? '#1a0f00' : 'rgba(255,255,255,0.20)', fontSize: '15px', fontWeight: 800, cursor: mood ? 'pointer' : 'default', fontFamily: 'inherit', transition: 'all 0.25s', letterSpacing: '0.05em', boxShadow: mood ? '0 4px 20px rgba(255,180,0,0.25)' : 'none' }}>
                    {isKz ? '✓ Бүгінді белгілеу' : '✓ Отметить день'}
                  </button>
                </>
              )}

              {/* Сброс пути */}
              <div style={{ textAlign: 'center', paddingTop: '4px' }}>
                {!showReset ? (
                  <button onClick={() => setShowReset(true)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.15)', fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.05em' }}>
                    {isKz ? '↺ Жолды қайта бастау' : '↺ Начать путь заново'}
                  </button>
                ) : (
                  <div style={{ padding: '16px', borderRadius: '18px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <p style={{ margin: '0 0 12px', fontSize: '13px', color: 'rgba(255,255,255,0.50)', lineHeight: 1.5 }}>
                      {isKz ? 'Жолды нөлден бастайсың ба? Бұл — жаңа бастама, жеңілдік емес.' : 'Начать путь с нуля? Это — новое начало, не слабость.'}
                    </p>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button onClick={() => { onResetPath(); onBack() }} style={{ padding: '9px 22px', borderRadius: '14px', border: '1px solid rgba(248,113,113,0.40)', background: 'rgba(248,113,113,0.12)', color: '#f87171', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                        {isKz ? 'Иə, бастау' : 'Да, начать заново'}
                      </button>
                      <button onClick={() => setShowReset(false)} style={{ padding: '9px 22px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.45)', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
                        {isKz ? 'Жоқ' : 'Отмена'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ═══ ТАБ: ВЕХИ ═══ */}
          {tab === 'milestones' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ padding: '12px 16px', borderRadius: '16px', background: 'rgba(255,200,60,0.06)', border: '1px solid rgba(255,200,60,0.14)', fontSize: '12px', color: 'rgba(255,200,60,0.65)', lineHeight: 1.6 }}>
                🗺 {isKz ? 'Әр кезең — жеңіс. Жол жалғасуда.' : 'Каждая веха — победа. Путь продолжается.'}
              </div>
              {MILESTONES.map((m, i) => {
                const passed = days >= m.days
                const current = m === currentM
                const daysLeft = m.days - days
                return (
                  <div key={m.days} style={{ padding: '16px', borderRadius: '20px', background: current ? `${m.color}12` : passed ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)', border: `1px solid ${current ? m.color + '45' : passed ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.04)'}`, display: 'flex', alignItems: 'center', gap: '14px', opacity: passed || current ? 1 : 0.50, transition: 'all 0.3s' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: passed ? `${m.color}20` : 'rgba(255,255,255,0.05)', border: `1px solid ${passed ? m.color + '40' : 'rgba(255,255,255,0.08)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0, boxShadow: current ? `0 0 16px ${m.color}40` : 'none' }}>
                      {passed ? m.emoji : '🔒'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: current ? 700 : 500, color: current ? m.color : passed ? 'rgba(255,255,255,0.80)' : 'rgba(255,255,255,0.30)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isKz ? m.kz : m.ru}
                        {current && <span style={{ fontSize: '9px', padding: '2px 8px', borderRadius: '8px', background: `${m.color}25`, color: m.color, fontWeight: 700, letterSpacing: '0.08em' }}>{isKz ? 'ҚАЗІР' : 'СЕЙЧАС'}</span>}
                      </div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.28)', marginTop: '3px' }}>
                        {passed ? (isKz ? `${m.days} күн ✓` : `${m.days} дней ✓`) : (isKz ? `${daysLeft} күн қалды` : `Осталось ${daysLeft} дней`)}
                      </div>
                    </div>
                    {passed && !current && <span style={{ fontSize: '18px', color: m.color }}>✓</span>}
                  </div>
                )
              })}
            </div>
          )}
{/* ═══ ТАБ: ЭКОНОМИЯ ═══ */}
{tab === 'economy' && (
  <>
    {(() => {
      const addictionKey = user.type || 'other'
      const costData = ADDICTION_COSTS[addictionKey] || ADDICTION_COSTS.other
      const dailyCost = costData.daily
      const totalSaved = days * dailyCost
      const monthlySaved = 30 * dailyCost
      const yearlySaved = 365 * dailyCost

      return (
        <>
          {/* Главная карточка экономии */}
          <div style={{ padding: '24px 20px', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(111,207,142,0.10), rgba(72,202,228,0.06))', border: '1px solid rgba(111,207,142,0.25)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(111,207,142,0.12), transparent)', pointerEvents: 'none' }} />
            <div style={{ fontSize: '11px', color: 'rgba(111,207,142,0.70)', fontWeight: 800, letterSpacing: '0.20em', textTransform: 'uppercase', marginBottom: '8px' }}>
              💰 {isKz ? 'Жалпы үнемделген' : 'Всего сэкономлено'}
            </div>
            <div style={{ fontSize: '52px', fontWeight: 900, color: '#6fcf8e', lineHeight: 1, textShadow: '0 0 30px rgba(111,207,142,0.40)', fontVariantNumeric: 'tabular-nums' }}>
              {totalSaved.toLocaleString('ru-RU')}
            </div>
            <div style={{ fontSize: '18px', color: 'rgba(111,207,142,0.70)', fontWeight: 700, marginTop: '4px' }}>₸</div>
            <div style={{ marginTop: '12px', fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>
              {days} {isKz ? 'күн ×' : 'дней ×'} {dailyCost.toLocaleString('ru-RU')} ₸ ({isKz ? costData.kz : costData.ru})
            </div>
          </div>

          {/* Статистика */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[
              { label_ru: 'В день', label_kz: 'Күнде', value: dailyCost, color: '#60c5fa' },
              { label_ru: 'В месяц', label_kz: 'Айда', value: monthlySaved, color: '#ffd060' },
              { label_ru: 'В год', label_kz: 'Жылда', value: yearlySaved, color: '#f4a261' },
              { label_ru: 'Уже сейчас', label_kz: 'Қазір', value: totalSaved, color: '#6fcf8e' },
            ].map((stat, i) => (
              <div key={i} style={{ padding: '14px', borderRadius: '18px', background: `${stat.color}0a`, border: `1px solid ${stat.color}22`, textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.10em' }}>
                  {isKz ? stat.label_kz : stat.label_ru}
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: stat.color, fontVariantNumeric: 'tabular-nums' }}>
                  {stat.value.toLocaleString('ru-RU')} ₸
                </div>
              </div>
            ))}
          </div>

          {/* На что хватит */}
          <div style={{ padding: '16px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '14px' }}>
              🛍 {isKz ? 'Осы ақшаға не алуға болады?' : 'На что хватит этих денег?'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {PURCHASES.map((item, i) => {
                const canAfford = totalSaved >= item.price
                const percent = Math.min(100, (totalSaved / item.price) * 100)
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px', flexShrink: 0, filter: canAfford ? 'none' : 'grayscale(1)', opacity: canAfford ? 1 : 0.4 }}>{item.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px', color: canAfford ? 'rgba(255,255,255,0.80)' : 'rgba(255,255,255,0.35)', fontWeight: canAfford ? 600 : 400 }}>
                          {isKz ? item.kz : item.ru}
                        </span>
                        <span style={{ fontSize: '11px', color: canAfford ? '#6fcf8e' : 'rgba(255,255,255,0.25)', fontWeight: canAfford ? 700 : 400 }}>
                          {canAfford ? '✓' : `${item.price.toLocaleString('ru-RU')} ₸`}
                        </span>
                      </div>
                      <div style={{ height: '3px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${percent}%`, background: canAfford ? '#6fcf8e' : 'rgba(255,255,255,0.15)', borderRadius: '2px', transition: 'width 1s ease' }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Мотивационная фраза */}
          <div style={{ padding: '16px', borderRadius: '18px', background: 'rgba(111,207,142,0.06)', border: '1px solid rgba(111,207,142,0.15)', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '14px', color: 'rgba(200,240,210,0.80)', fontStyle: 'italic', lineHeight: 1.6 }}>
              {isKz
                ? `${days} күнде сен ${totalSaved.toLocaleString('ru-RU')} ₸ үнемдедің. Бұл — нақты өзгеріс.`
                : `За ${days} дней ты сэкономил ${totalSaved.toLocaleString('ru-RU')} ₸. Это реальное изменение.`}
            </p>
          </div>
        </>
      )
    })()}
  </>
)}
          {/* ═══ ТАБ: ДНЕВНИК ═══ */}
          {tab === 'journal' && (
            <>
              {checkins.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 24px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.4 }}>📖</div>
                  <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.30)', lineHeight: 1.6 }}>
                    {isKz ? 'Жазбалар жоқ әлі.\nБүгін белгілеп басташ.' : 'Записей пока нет.\nОтметь первый день — и дневник начнётся.'}
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.12em', textTransform: 'uppercase', paddingLeft: '4px' }}>
                    {isKz ? `${checkins.length} жазба` : `${checkins.length} записей`}
                  </div>
                  {[...checkins].reverse().map((c, i) => {
                    const cfg = MOOD[c.mood]
                    const date = new Date(c.date)
                    const dateStr = date.toLocaleDateString(isKz ? 'kk-KZ' : 'ru-RU', { day: 'numeric', month: 'long' })
                    const dayNum = Math.floor((date.getTime() - new Date(user.createdAt).getTime()) / 86400000)
                    return (
                      <div key={c.date} style={{ padding: '16px', borderRadius: '20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: `${cfg.color}15`, border: `1px solid ${cfg.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                          {cfg.emoji}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: cfg.color }}>{isKz ? cfg.kz : cfg.ru}</span>
                            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)' }}>{dateStr}</span>
                            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.18)', marginLeft: 'auto' }}>
                              {isKz ? `${dayNum} күн` : `День ${dayNum}`}
                            </span>
                          </div>
                          {c.note ? (
                            <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.60)', fontStyle: 'italic', lineHeight: 1.6, wordBreak: 'break-word' }}>
                              «{c.note}»
                            </p>
                          ) : (
                            <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.22)', fontStyle: 'italic' }}>
                              {isKz ? 'Жазба жоқ' : 'Без заметки'}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </>
              )}
            </>
          )}

        </div>
      </div>
    </SectionShell>
  )
}