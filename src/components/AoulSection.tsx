'use client'
import { useState, useEffect } from 'react'
import SectionShell from '@/components/SectionShell'
import type { UserProfile } from '@/hooks/useAuth'

interface Props { user: UserProfile | null; locale: 'ru' | 'kz'; onBack: () => void }

interface Story {
  id: string
  date: string
  days: number
  text: string
  type: 'victory' | 'struggle' | 'gratitude' | 'milestone'
  hearts: number
}

const STORY_TYPES = {
  victory:   { emoji: '🏆', ru: 'Победа',      kz: 'Жеңіс',      color: '#ffd060' },
  struggle:  { emoji: '💪', ru: 'Честно',       kz: 'Шынайы',     color: '#f4a261' },
  gratitude: { emoji: '🤍', ru: 'Благодарность', kz: 'Алғыс',     color: '#a78bfa' },
  milestone: { emoji: '🌟', ru: 'Веха',         kz: 'Белес',      color: '#6fcf8e' },
}

const SAMPLE_STORIES: Story[] = [
  { id: 's1', date: '2026-04-10', days: 45, text: 'Сегодня первый раз за месяц встретился с друзьями. Не пил. Было тяжело первые 30 минут, потом отпустило. Это победа.', type: 'victory', hearts: 24 },
  { id: 's2', date: '2026-04-09', days: 12, text: 'Честно — сегодня была тяга. Написал другу, он поговорил со мной час. Степь помогла — вышел погулять. Прошло.', type: 'struggle', hearts: 31 },
  { id: 's3', date: '2026-04-08', days: 90, text: '90 дней. Три месяца назад я не верил что это возможно. Спасибо всем кто здесь. Вы реально помогли.', type: 'milestone', hearts: 67 },
  { id: 's4', date: '2026-04-07', days: 7, text: 'Неделя. Маленькая, но моя. Сон стал лучше. Жена заметила что я другой. Это стоит всего.', type: 'gratitude', hearts: 18 },
  { id: 's5', date: '2026-04-06', days: 30, text: 'Месяц без алкоголя. Сэкономил 90,000 тенге. Купил дочке велосипед. Видел её улыбку — лучший кайф.', type: 'victory', hearts: 89 },
]

const FAMILY_GUIDE = [
  { emoji: '🧠', ru: 'Что происходит с мозгом', kz: 'Мидың не болатыны', text_ru: 'Зависимость — это не слабость воли. Это изменение нейронных путей. Мозг зависимого буквально не может "просто остановиться". Это требует времени и поддержки.', text_kz: 'Тәуелділік — еріктің әлсіздігі емес. Бұл нейрондық жолдардың өзгеруі. Тәуелді адамның миы жай ғана "тоқтата алмайды".' },
  { emoji: '💬', ru: 'Как говорить', kz: 'Қалай сөйлесу', text_ru: '✓ "Я беспокоюсь о тебе"\n✓ "Я вижу что тебе тяжело"\n✗ "Ты сам виноват"\n✗ "Просто возьми себя в руки"', text_kz: '✓ "Мен сен үшін алаңдаймын"\n✓ "Саған ауыр екенін көремін"\n✗ "Өзің кінәлісің"\n✗ "Жай ғана өзіңді ұст"' },
  { emoji: '🚫', ru: 'Чего не делать', kz: 'Не істемеу', text_ru: '— Не скрывать последствия (это называется "созависимость")\n— Не угрожать, если не готов выполнить\n— Не пытаться контролировать каждый шаг\n— Не обвинять себя за его выбор', text_kz: '— Салдарды жасырмаңыз\n— Орындауға дайын болмасаңыз қорқытпаңыз\n— Әр қадамды бақылауға тырыспаңыз' },
  { emoji: '🛡', ru: 'Созависимость', kz: 'Бірлескен тәуелділік', text_ru: 'Вы тоже в пути. Близкие зависимых часто теряют себя в попытке спасти другого. Ваши границы — это не эгоизм. Это необходимость.', text_kz: 'Сіз де жолдасыз. Тәуелді адамның жақындары жиі өздерін жоғалтады. Сіздің шекараларыңыз — эгоизм емес. Бұл қажеттілік.' },
]

const STORIES_KEY = 'ashyq_aoul_stories'
const HEARTS_KEY = 'ashyq_aoul_hearts'

export default function AoulSection({ user, locale, onBack }: Props) {
  const isKz = locale === 'kz'
  const [tab, setTab] = useState<'aoul' | 'family' | 'sos'>('aoul')
  const [stories, setStories] = useState<Story[]>(SAMPLE_STORIES)
  const [heartedIds, setHeartedIds] = useState<Set<string>>(new Set())
  const [showWrite, setShowWrite] = useState(false)
  const [newText, setNewText] = useState('')
  const [newType, setNewType] = useState<Story['type']>('victory')
  const [expandedGuide, setExpandedGuide] = useState<number | null>(null)
  const userDays = user ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / 86400000) : 0

  useEffect(() => {
    const saved = localStorage.getItem(STORIES_KEY)
    const hearts = localStorage.getItem(HEARTS_KEY)
    if (saved) setStories([...JSON.parse(saved), ...SAMPLE_STORIES])
    if (hearts) setHeartedIds(new Set(JSON.parse(hearts)))
  }, [])

  function toggleHeart(id: string) {
    const next = new Set(heartedIds)
    if (next.has(id)) {
      next.delete(id)
      setStories(prev => prev.map(s => s.id === id ? { ...s, hearts: s.hearts - 1 } : s))
    } else {
      next.add(id)
      setStories(prev => prev.map(s => s.id === id ? { ...s, hearts: s.hearts + 1 } : s))
    }
    setHeartedIds(next)
    localStorage.setItem(HEARTS_KEY, JSON.stringify(Array.from(next)))
  }

  function submitStory() {
    if (!newText.trim() || !user) return
    const story: Story = {
      id: Date.now().toString(),
      date: new Date().toISOString().slice(0, 10),
      days: userDays,
      text: newText.trim(),
      type: newType,
      hearts: 0,
    }
    const updated = [story, ...stories]
    setStories(updated)
    const userStories = updated.filter(s => !SAMPLE_STORIES.find(ss => ss.id === s.id))
    localStorage.setItem(STORIES_KEY, JSON.stringify(userStories))
    setNewText('')
    setShowWrite(false)
  }

  function shareProgress() {
    const text = isKz
      ? `Мен ${userDays} күн еркіндікте! Ұлы Дала Жолы платформасымен бірге. 🐎`
      : `Я ${userDays} дней свободы! Вместе с платформой Ұлы Дала Жолы. 🐎`
    if (navigator.share) {
      navigator.share({ title: 'Ұлы Дала Жолы', text })
    } else {
      navigator.clipboard.writeText(text)
    }
  }

  const tabs = [
    { id: 'aoul', emoji: '🏕', ru: 'Аул', kz: 'Ауыл' },
    { id: 'family', emoji: '🤝', ru: 'Семьям', kz: 'Отбасыға' },
    { id: 'sos', emoji: '🆘', ru: 'SOS', kz: 'Көмек' },
  ]

  return (
    <SectionShell locale={locale} title={isKz ? 'Цифрлық Ауыл' : 'Цифровой Аул'} icon="🏕" onBack={onBack} accentColor="rgba(244,162,97,0.6)">
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .story-card:hover { border-color: rgba(255,200,60,0.25) !important; }
        .story-card { transition: all 0.18s ease; }
        .heart-btn:hover { transform: scale(1.2); }
        .heart-btn { transition: transform 0.15s ease; }
        .guide-item:hover { border-color: rgba(244,162,97,0.30) !important; }
        .guide-item { transition: all 0.2s ease; cursor: pointer; }
      `}</style>

      <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%', paddingBottom: '80px' }}>

        {/* ТАБЫ */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.20)' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id as any)}
              style={{ flex: 1, padding: '12px 4px', border: 'none', borderBottom: tab === t.id ? '2px solid #f4a261' : '2px solid transparent', background: 'transparent', color: tab === t.id ? '#f4a261' : 'rgba(255,255,255,0.30)', fontSize: '11px', fontWeight: tab === t.id ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', transition: 'all 0.2s' }}>
              <span style={{ fontSize: '18px' }}>{t.emoji}</span>
              {isKz ? t.kz : t.ru}
            </button>
          ))}
        </div>

        {/* ═══ АУЛ ═══ */}
        {tab === 'aoul' && (
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* Шапка с описанием */}
            <div style={{ padding: '16px', borderRadius: '20px', background: 'rgba(244,162,97,0.07)', border: '1px solid rgba(244,162,97,0.18)' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'rgba(255,200,100,0.90)', marginBottom: '6px' }}>
                🏕 {isKz ? 'Цифрлық Ауыл' : 'Цифровой Аул'}
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
                {isKz
                  ? 'Мұнда біз бір-бірімізге қолдау көрсетеміз. Анонимді, сотсыз, жылы.'
                  : 'Здесь мы поддерживаем друг друга. Анонимно, без осуждения, с теплом.'}
              </p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                {user && (
                  <button onClick={() => setShowWrite(!showWrite)}
                    style={{ flex: 1, padding: '10px', borderRadius: '14px', border: '1px solid rgba(244,162,97,0.40)', background: 'rgba(244,162,97,0.12)', color: '#f4a261', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                    ✍️ {isKz ? 'Жазу' : 'Поделиться'}
                  </button>
                )}
                <button onClick={shareProgress}
                  style={{ flex: 1, padding: '10px', borderRadius: '14px', border: '1px solid rgba(167,139,250,0.35)', background: 'rgba(167,139,250,0.10)', color: '#a78bfa', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  📤 {isKz ? 'Бөлісу' : 'Поделиться прогрессом'}
                </button>
              </div>
            </div>

            {/* Форма написания */}
            {showWrite && user && (
              <div style={{ padding: '16px', borderRadius: '20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', animation: 'fadeUp 0.3s ease' }}>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.40)', marginBottom: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.10em' }}>
                  {isKz ? 'Жаз, ауыл тыңдайды' : 'Пиши — аул слушает'}
                </div>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  {(Object.entries(STORY_TYPES) as [Story['type'], typeof STORY_TYPES[keyof typeof STORY_TYPES]][]).map(([key, cfg]) => (
                    <button key={key} onClick={() => setNewType(key)}
                      style={{ padding: '5px 12px', borderRadius: '12px', border: `1px solid ${newType === key ? cfg.color : 'rgba(255,255,255,0.08)'}`, background: newType === key ? `${cfg.color}18` : 'transparent', color: newType === key ? cfg.color : 'rgba(255,255,255,0.40)', fontSize: '11px', fontWeight: newType === key ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit' }}>
                      {cfg.emoji} {isKz ? (key === 'victory' ? 'Жеңіс' : key === 'struggle' ? 'Шынайы' : key === 'gratitude' ? 'Алғыс' : 'Белес') : cfg.ru}
                    </button>
                  ))}
                </div>
                <textarea value={newText} onChange={e => setNewText(e.target.value)}
                  placeholder={isKz ? 'Бүгін не болды? Аулға айт...' : 'Что произошло сегодня? Расскажи аулу...'}
                  rows={4}
                  style={{ width: '100%', padding: '12px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.09)', background: 'rgba(255,255,255,0.04)', color: 'white', fontSize: '14px', resize: 'none', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', lineHeight: 1.6 }}
                  onFocus={e => e.target.style.borderColor = 'rgba(244,162,97,0.40)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'}
                />
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <button onClick={submitStory} disabled={!newText.trim()}
                    style={{ flex: 1, padding: '11px', borderRadius: '14px', border: 'none', background: newText.trim() ? 'rgba(244,162,97,0.85)' : 'rgba(255,255,255,0.06)', color: newText.trim() ? '#1a0f00' : 'rgba(255,255,255,0.20)', fontSize: '13px', fontWeight: 700, cursor: newText.trim() ? 'pointer' : 'default', fontFamily: 'inherit' }}>
                    {isKz ? 'Жариялау' : 'Опубликовать'}
                  </button>
                  <button onClick={() => setShowWrite(false)}
                    style={{ padding: '11px 16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: 'rgba(255,255,255,0.35)', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
                    {isKz ? 'Болдырмау' : 'Отмена'}
                  </button>
                </div>
              </div>
            )}

            {/* Истории */}
            {stories.map(story => {
              const cfg = STORY_TYPES[story.type]
              const hearted = heartedIds.has(story.id)
              return (
                <div key={story.id} className="story-card"
                  style={{ padding: '16px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', animation: 'fadeUp 0.3s ease' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `${cfg.color}15`, border: `1px solid ${cfg.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                      {cfg.emoji}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: cfg.color }}>
                        {isKz ? (story.type === 'victory' ? 'Жеңіс' : story.type === 'struggle' ? 'Шынайы' : story.type === 'gratitude' ? 'Алғыс' : 'Белес') : cfg.ru}
                      </div>
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)' }}>
                        {story.days} {isKz ? 'күн жолда' : 'дней в пути'} · {story.date}
                      </div>
                    </div>
                    <button className="heart-btn" onClick={() => toggleHeart(story.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                      <span style={{ fontSize: '18px', filter: hearted ? 'none' : 'grayscale(1)', opacity: hearted ? 1 : 0.5 }}>❤️</span>
                      <span style={{ fontSize: '10px', color: hearted ? '#f87171' : 'rgba(255,255,255,0.25)', fontWeight: hearted ? 700 : 400 }}>{story.hearts}</span>
                    </button>
                  </div>
                  <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.65 }}>
                    {story.text}
                  </p>
                </div>
              )
            })}
          </div>
        )}

        {/* ═══ СЕМЬЯМ ═══ */}
        {tab === 'family' && (
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

            <div style={{ padding: '18px', borderRadius: '20px', background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.20)', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', marginBottom: '10px' }}>🤝</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'rgba(220,200,255,0.90)', marginBottom: '8px' }}>
                {isKz ? 'Бұл бет — сіздікі' : 'Эта страница — ваша'}
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.65 }}>
                {isKz
                  ? 'Сіз де жолдасыз. Тәуелдінің жолы — сіздің де жолыңыз. Мұнда сіз жалғыз емессіз.'
                  : 'Вы тоже в пути. Путь зависимого — это и ваш путь. Здесь вы не одни.'}
              </p>
            </div>

            {FAMILY_GUIDE.map((item, i) => (
              <div key={i} className="guide-item"
                onClick={() => setExpandedGuide(expandedGuide === i ? null : i)}
                style={{ padding: '16px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${expandedGuide === i ? 'rgba(167,139,250,0.35)' : 'rgba(255,255,255,0.07)'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '24px' }}>{item.emoji}</span>
                  <div style={{ flex: 1, fontSize: '14px', fontWeight: 600, color: expandedGuide === i ? 'rgba(210,185,255,0.95)' : 'rgba(255,255,255,0.80)' }}>
                    {isKz ? item.kz : item.ru}
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '16px' }}>{expandedGuide === i ? '▲' : '▼'}</span>
                </div>
                {expandedGuide === i && (
                  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '13px', color: 'rgba(255,255,255,0.60)', lineHeight: 1.70, whiteSpace: 'pre-line', animation: 'fadeUp 0.25s ease' }}>
                    {isKz ? item.text_kz : item.text_ru}
                  </div>
                )}
              </div>
            ))}

            <div style={{ padding: '16px', borderRadius: '20px', background: 'rgba(96,197,250,0.07)', border: '1px solid rgba(96,197,250,0.18)', textAlign: 'center' }}>
              <div style={{ fontSize: '13px', color: 'rgba(150,220,255,0.75)', lineHeight: 1.6, marginBottom: '12px' }}>
                {isKz ? '📅 Жақындарға арналған онлайн-жиын — жұма сайын 20:00' : '📅 Онлайн встреча для близких — каждую пятницу 20:00'}
              </div>
              <a href="https://t.me/ulydalazholy" target="_blank" rel="noreferrer"
                style={{ display: 'inline-block', padding: '10px 24px', borderRadius: '14px', background: 'rgba(96,197,250,0.15)', border: '1px solid rgba(96,197,250,0.30)', color: '#60c5fa', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
                {isKz ? '➡️ Қосылу' : '➡️ Присоединиться'}
              </a>
            </div>
          </div>
        )}

        {/* ═══ SOS ═══ */}
        {tab === 'sos' && (
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

            <div style={{ padding: '20px', borderRadius: '20px', background: 'rgba(248,113,113,0.10)', border: '1px solid rgba(248,113,113,0.28)', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>🆘</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#f87171', marginBottom: '6px' }}>
                {isKz ? 'Сен жалғыз емессің' : 'Ты не один'}
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
                {isKz ? 'Тяга — это волна. Она нарастает и спадает. Средняя длина — 20 минут. Позвони прямо сейчас.' : 'Тяга — это волна. Она нарастает и спадает. Средняя длина — 20 минут. Позвони прямо сейчас.'}
              </p>
            </div>

            {[
              { name: 'Национальная линия доверия', nameKz: 'Ұлттық сенім желісі', phone: '150', desc_ru: 'Бесплатно, круглосуточно', desc_kz: 'Тегін, тәулік бойы', color: '#f87171' },
              { name: 'Служба психологической помощи', nameKz: 'Психологиялық көмек', phone: '111', desc_ru: 'Помощь семьям и детям', desc_kz: 'Отбасы мен балаларға', color: '#f4a261' },
              { name: 'Amanat Rehab', nameKz: 'Amanat Rehab', phone: '+7 701 223 75 57', desc_ru: 'Реабилитационный центр, круглосуточно', desc_kz: 'Оңалту орталығы, тәулік бойы', color: '#6fcf8e' },
            ].map((c, i) => (
              <a key={i} href={`tel:${c.phone}`}
                style={{ padding: '16px', borderRadius: '20px', background: `${c.color}0a`, border: `1px solid ${c.color}28`, display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none', transition: 'all 0.2s' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${c.color}18`, border: `1px solid ${c.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>📞</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'rgba(255,255,255,0.88)', marginBottom: '3px' }}>{isKz ? c.nameKz : c.name}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{isKz ? c.desc_kz : c.desc_ru}</div>
                </div>
                <div style={{ fontSize: '16px', fontWeight: 900, color: c.color, flexShrink: 0 }}>{c.phone}</div>
              </a>
            ))}

            {/* Техника 5-4-3-2-1 */}
            <div style={{ padding: '18px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,200,60,0.80)', marginBottom: '12px' }}>
                ⚡ {isKz ? 'Жерге байлану техникасы (5-4-3-2-1)' : 'Техника заземления (5-4-3-2-1)'}
              </div>
              {[
                { n: 5, ru: 'вещей которые ты ВИДИШЬ', kz: 'КӨРЕТІН нәрсені атаңыз' },
                { n: 4, ru: 'вещи которые ты ЧУВСТВУЕШЬ', kz: 'СЕЗІНЕТІН нәрсені атаңыз' },
                { n: 3, ru: 'вещи которые ты СЛЫШИШЬ', kz: 'ЕСТИТІН нәрсені атаңыз' },
                { n: 2, ru: 'вещи которые ты НЮХАЕШЬ', kz: 'ИІСКЕЙТІН нәрсені атаңыз' },
                { n: 1, ru: 'вещь которую ты ЧУВСТВУЕШЬ НА ВКУС', kz: 'ТАТИТЫН нәрсені атаңыз' },
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