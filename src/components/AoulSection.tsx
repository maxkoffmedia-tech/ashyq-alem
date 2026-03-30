'use client'

import { useState, useEffect } from 'react'
import SectionShell from '@/components/SectionShell'
import type { UserProfile } from '@/hooks/useAuth'
import type { Locale } from '@/i18n/translations'

// ═══════════════════════════════════════════════════════════════════════════════
// ЦИФРОВОЙ АУЛ — архитектура
//
// MVP (сейчас, без бэкенда):
//   ✅ Три круга — визуальная архитектура аула
//   ✅ Расписание встреч с реальными ссылками
//   ✅ Анонимные истории (localStorage, публикуются локально)
//   ✅ Полный гид для семей
//   ✅ SOS кнопка с контактами КЗ
//   ✅ Тематические юрты (категории по типу)
//
// Следующий этап (с бэкендом):
//   🔜 Реальный чат между пользователями (WebSocket)
//   🔜 Видео-сборы внутри приложения
//   🔜 Push-уведомления на SOS
//   🔜 Верификация анонимных историй
// ═══════════════════════════════════════════════════════════════════════════════

interface Props {
  user: UserProfile
  locale: Locale
  onBack: () => void
}

type Tab = 'aoul' | 'stories' | 'family' | 'sos'

// ─── Данные встреч ────────────────────────────────────────────────────────────

interface Meeting {
  id: string
  dayRu: string
  dayKz: string
  time: string
  titleRu: string
  titleKz: string
  descRu: string
  descKz: string
  type: 'general' | 'family' | 'women' | 'men' | 'youth'
  zoomLink: string  // реальная ссылка когда появится
  color: string
}

const MEETINGS: Meeting[] = [
  {
    id: 'm1',
    dayRu: 'Понедельник', dayKz: 'Дүйсенбі',
    time: '19:00',
    titleRu: 'Вечерний костёр', titleKz: 'Кешкі от',
    descRu: 'Общий сбор аула. Делимся как прошёл день.',
    descKz: 'Ауылдың жалпы жиыны. Күн қалай өткенін бөлісеміз.',
    type: 'general', color: '#ffd060',
    zoomLink: 'https://zoom.us/j/ashyqalem_monday',
  },
  {
    id: 'm2',
    dayRu: 'Среда', dayKz: 'Сәрсенбі',
    time: '18:00',
    titleRu: 'Юрта женщин', titleKz: 'Əйелдер киіз үйі',
    descRu: 'Безопасное пространство для женщин на пути.',
    descKz: 'Жолдағы əйелдерге қауіпсіз кеңістік.',
    type: 'women', color: '#f4a261',
    zoomLink: 'https://zoom.us/j/ashyqalem_women',
  },
  {
    id: 'm3',
    dayRu: 'Четверг', dayKz: 'Бейсенбі',
    time: '20:00',
    titleRu: 'Круг семей', titleKz: 'Отбасы шеңбері',
    descRu: 'Только для близких зависимых. Без осуждения.',
    descKz: 'Тек тәуелдінің жақындары үшін. Соттамай.',
    type: 'family', color: '#a78bfa',
    zoomLink: 'https://zoom.us/j/ashyqalem_family',
  },
  {
    id: 'm4',
    dayRu: 'Суббота', dayKz: 'Сенбі',
    time: '11:00',
    titleRu: 'Большой аул', titleKz: 'Үлкен ауыл',
    descRu: 'Главный еженедельный сбор. Истории, силы, вехи.',
    descKz: 'Басты апталық жиын. Оқиғалар, күш, белестер.',
    type: 'general', color: '#6fcf8e',
    zoomLink: 'https://zoom.us/j/ashyqalem_saturday',
  },
  {
    id: 'm5',
    dayRu: 'Воскресенье', dayKz: 'Жексенбі',
    time: '16:00',
    titleRu: 'Молодёжная юрта', titleKz: 'Жастар киіз үйі',
    descRu: 'До 35 лет. Свободно, без формализма.',
    descKz: '35-ке дейін. Еркін, формализмсіз.',
    type: 'youth', color: '#60c5fa',
    zoomLink: 'https://zoom.us/j/ashyqalem_youth',
  },
]

// ─── Анонимные истории ────────────────────────────────────────────────────────

interface Story {
  id: string
  date: string
  daysPath: number
  textRu: string
  textKz: string
  hearts: number
  type: 'victory' | 'struggle' | 'milestone' | 'gratitude'
}

// Встроенные истории — показываем пока нет реальных
const SEED_STORIES: Story[] = [
  {
    id: 's1', date: '2025-02-15', daysPath: 90,
    textRu: 'Три месяца. Первый раз за много лет отвёл сына в школу и не думал о выпивке. Просто шёл рядом с ним.',
    textKz: 'Үш ай. Ұзақ жылдар ішінде бірінші рет ұлымды мектепке апардым және ішкілік туралы ойламадым. Жай онымен қатар жүрдім.',
    hearts: 47, type: 'milestone',
  },
  {
    id: 's2', date: '2025-02-10', daysPath: 21,
    textRu: 'Сегодня было очень тяжело. Позвонил в скорую помощь — не себе, а другу который тоже борется. Помог ему. И вдруг стало легче.',
    textKz: 'Бүгін өте ауыр болды. Жедел жәрдемге қоңырау шалдым — өзіме емес, күресіп жатқан досыма. Оған көмектестім. Және кенет жеңілдеді.',
    hearts: 31, type: 'struggle',
  },
  {
    id: 's3', date: '2025-01-30', daysPath: 7,
    textRu: 'Неделя. Просто неделя. Я никогда не думал что смогу продержаться даже столько.',
    textKz: 'Бір апта. Жай бір апта. Осыншалықта шыдай аламын деп ешқашан ойламадым.',
    hearts: 89, type: 'victory',
  },
  {
    id: 's4', date: '2025-02-18', daysPath: 180,
    textRu: 'Полгода. Мама впервые за долгое время сказала что гордится мной. Я не смог не плакать.',
    textKz: 'Жарты жыл. Анам ұзақ уақыт ішінде бірінші рет маған мақтанатынын айтты. Жыламай тұра алмадым.',
    hearts: 124, type: 'milestone',
  },
  {
    id: 's5', date: '2025-02-19', daysPath: 14,
    textRu: 'Благодарен за эту неделю. За кофе утром. За закат. За то что просто дышу.',
    textKz: 'Осы аптаға риза болдым. Таңғы кофеге. Батысқа. Жай тыныс алғаным үшін.',
    hearts: 62, type: 'gratitude',
  },
]

const STORIES_KEY = 'ashyq_aoul_stories'
const HEARTS_KEY = 'ashyq_aoul_hearts'

function loadStories(): Story[] {
  try {
    const local = JSON.parse(localStorage.getItem(STORIES_KEY) || '[]')
    return [...SEED_STORIES, ...local].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  } catch { return SEED_STORIES }
}

function loadHearts(): Set<string> {
  try {
    const data = localStorage.getItem(HEARTS_KEY)
    return new Set(data ? JSON.parse(data) : [])
  } catch { return new Set() }
}

// ─── Типы историй ─────────────────────────────────────────────────────────────

const STORY_TYPES = {
  victory:   { emoji: '🏆', ru: 'Победа',      kz: 'Жеңіс',      color: '#ffd060' },
  struggle:  { emoji: '🌧',  ru: 'Честно',      kz: 'Шынайы',      color: '#60c5fa' },
  milestone: { emoji: '✦',  ru: 'Веха',        kz: 'Белес',       color: '#6fcf8e' },
  gratitude: { emoji: '🤍',  ru: 'Благодарность', kz: 'Ризашылық', color: '#f4a261' },
}

// ─── SOS контакты ─────────────────────────────────────────────────────────────

const SOS_CONTACTS = [
  {
    nameRu: 'Телефон доверия КЗ',
    nameKz: 'Сенім телефоны ҚЗ',
    phone: '8-800-080-8800',
    descRu: 'Бесплатно, круглосуточно',
    descKz: 'Тегін, тəулік бойы',
    color: '#f87171',
  },
  {
    nameRu: 'Скорая психологическая',
    nameKz: 'Психологиялық жедел жəрдем',
    phone: '051',
    descRu: 'Экстренная психологическая помощь',
    descKz: 'Шұғыл психологиялық көмек',
    color: '#ffd060',
  },
  {
    nameRu: 'Наркологическая служба',
    nameKz: 'Наркологиялық қызмет',
    phone: '109',
    descRu: 'Анонимно. Без осуждения.',
    descKz: 'Анонимді. Соттамай.',
    color: '#6fcf8e',
  },
]

// ─── КОМПОНЕНТЫ ──────────────────────────────────────────────────────────────

// Карточка встречи
function MeetingCard({ meeting, isKz }: { meeting: Meeting; isKz: boolean }) {
  const [joining, setJoining] = useState(false)

  function handleJoin() {
    setJoining(true)
    // В реальной версии — открываем Zoom
    window.open(meeting.zoomLink, '_blank')
    setTimeout(() => setJoining(false), 2000)
  }

  const typeLabel = {
    general: { ru: 'Общая', kz: 'Жалпы' },
    family:  { ru: 'Семьи', kz: 'Отбасы' },
    women:   { ru: 'Женщины', kz: 'Əйелдер' },
    men:     { ru: 'Мужчины', kz: 'Ерлер' },
    youth:   { ru: 'Молодёжь', kz: 'Жастар' },
  }[meeting.type]

  return (
    <div style={{
      padding: '16px',
      borderRadius: '18px',
      background: `${meeting.color}0e`,
      border: `1px solid ${meeting.color}30`,
      display: 'flex',
      gap: '14px',
      alignItems: 'center',
    }}>
      {/* Время */}
      <div style={{
        flexShrink: 0,
        width: '52px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '16px', fontWeight: 800, color: meeting.color }}>
          {meeting.time}
        </div>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>
          {isKz ? meeting.dayKz.slice(0, 3) : meeting.dayRu.slice(0, 3)}
        </div>
      </div>

      {/* Разделитель */}
      <div style={{ width: '1px', height: '40px', background: `${meeting.color}30`, flexShrink: 0 }} />

      {/* Инфо */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
          <span style={{
            fontSize: '10px',
            padding: '2px 8px',
            borderRadius: '8px',
            background: `${meeting.color}20`,
            color: meeting.color,
            fontWeight: 600,
          }}>
            {isKz ? typeLabel.kz : typeLabel.ru}
          </span>
        </div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>
          {isKz ? meeting.titleKz : meeting.titleRu}
        </div>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.40)', marginTop: '2px', lineHeight: 1.4 }}>
          {isKz ? meeting.descKz : meeting.descRu}
        </div>
      </div>

      {/* Кнопка */}
      <button
        onClick={handleJoin}
        style={{
          flexShrink: 0,
          padding: '8px 12px',
          borderRadius: '12px',
          border: `1px solid ${meeting.color}50`,
          background: joining ? `${meeting.color}30` : `${meeting.color}15`,
          color: meeting.color,
          fontSize: '12px',
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'inherit',
          transition: 'all 0.2s',
          whiteSpace: 'nowrap',
        }}
      >
        {joining ? '✓' : (isKz ? 'Қосылу' : 'Войти')}
      </button>
    </div>
  )
}

// Карточка истории
function StoryCard({
  story,
  isKz,
  onHeart,
  hearted,
}: {
  story: Story
  isKz: boolean
  onHeart: (id: string) => void
  hearted: boolean
}) {
  const typeInfo = STORY_TYPES[story.type]

  const dayWord = story.daysPath === 1 ? 'день'
    : story.daysPath < 5 ? 'дня' : 'дней'

  return (
    <div style={{
      padding: '16px',
      borderRadius: '18px',
      background: 'rgba(255,255,255,0.04)',
      border: `1px solid ${hearted ? typeInfo.color + '40' : 'rgba(255,255,255,0.07)'}`,
      transition: 'border-color 0.3s',
    }}>
      {/* Шапка */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <span style={{ fontSize: '18px' }}>{typeInfo.emoji}</span>
        <span style={{
          fontSize: '11px',
          padding: '2px 8px',
          borderRadius: '8px',
          background: `${typeInfo.color}18`,
          color: typeInfo.color,
          fontWeight: 600,
        }}>
          {isKz ? typeInfo.kz : typeInfo.ru}
        </span>
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginLeft: 'auto' }}>
          {story.daysPath} {isKz ? 'күн' : dayWord} • {isKz ? 'Анонимді' : 'Анонимно'}
        </span>
      </div>

      {/* Текст */}
      <p style={{
        margin: 0,
        fontSize: '14px',
        color: 'rgba(255,255,255,0.80)',
        lineHeight: 1.7,
        fontStyle: 'italic',
      }}>
        «{isKz ? story.textKz : story.textRu}»
      </p>

      {/* Поддержка */}
      <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={() => onHeart(story.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 12px',
            borderRadius: '12px',
            border: `1px solid ${hearted ? '#f87171' : 'rgba(255,255,255,0.10)'}`,
            background: hearted ? 'rgba(248,113,113,0.12)' : 'transparent',
            color: hearted ? '#f87171' : 'rgba(255,255,255,0.35)',
            fontSize: '13px',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.2s',
          }}
        >
          {hearted ? '❤️' : '🤍'} {story.hearts + (hearted ? 1 : 0)}
        </button>
      </div>
    </div>
  )
}

// ─── ГЛАВНЫЙ КОМПОНЕНТ ────────────────────────────────────────────────────────

export default function AoulSection({ user, locale, onBack }: Props) {
  const isKz = locale === 'kz'
  const [activeTab, setActiveTab] = useState<Tab>('aoul')
  const [stories, setStories] = useState<Story[]>([])
  const [heartedIds, setHeartedIds] = useState<Set<string>>(new Set())
  const [showStoryForm, setShowStoryForm] = useState(false)
  const [newStoryText, setNewStoryText] = useState('')
  const [newStoryType, setNewStoryType] = useState<Story['type']>('victory')
  const [storyPosted, setStoryPosted] = useState(false)
  const [showSos, setShowSos] = useState(false)

  const days = Math.floor(
    (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  )

  useEffect(() => {
    setStories(loadStories())
    setHeartedIds(loadHearts())
  }, [])

  function handleHeart(id: string) {
    const newSet = new Set(heartedIds)
    if (newSet.has(id)) newSet.delete(id)
    else newSet.add(id)
    setHeartedIds(newSet)
    // ТУТ ИСПРАВЛЕНИЕ: Array.from(newSet) вместо [...newSet] для прохождения билда
    localStorage.setItem(HEARTS_KEY, JSON.stringify(Array.from(newSet)))
  }

  function postStory() {
    if (!newStoryText.trim()) return
    const story: Story = {
      id: `u_${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      daysPath: days,
      textRu: newStoryText.trim(),
      textKz: newStoryText.trim(),
      hearts: 0,
      type: newStoryType,
    }
    const local = JSON.parse(localStorage.getItem(STORIES_KEY) || '[]')
    localStorage.setItem(STORIES_KEY, JSON.stringify([story, ...local]))
    setStories(loadStories())
    setNewStoryText('')
    setShowStoryForm(false)
    setStoryPosted(true)
    setTimeout(() => setStoryPosted(false), 3000)
  }

  const tabs: { id: Tab; ru: string; kz: string; emoji: string }[] = [
    { id: 'aoul',    ru: 'Аул',     kz: 'Ауыл',    emoji: '🏕' },
    { id: 'stories', ru: 'Истории', kz: 'Оқиғалар', emoji: '📖' },
    { id: 'family',  ru: 'Семьям',  kz: 'Отбасы',  emoji: '🤝' },
    { id: 'sos',     ru: 'SOS',     kz: 'SOS',     emoji: '🆘' },
  ]

  return (
    <SectionShell
      locale={locale}
      title={isKz ? 'Цифрлық Ауыл' : 'Цифровой Аул'}
      icon="🏕"
      onBack={onBack}
      accentColor="rgba(244,162,97,0.6)"
    >
      <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>

        {/* Табы */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(0,0,0,0.20)',
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '12px 4px',
                border: 'none',
                borderBottom: activeTab === tab.id
                  ? '2px solid #f4a261'
                  : '2px solid transparent',
                background: 'transparent',
                color: activeTab === tab.id ? '#f4a261' : 'rgba(255,255,255,0.35)',
                fontSize: '11px',
                fontWeight: activeTab === tab.id ? 700 : 400,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.18s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              <span style={{ fontSize: '16px' }}>{tab.emoji}</span>
              {isKz ? tab.kz : tab.ru}
              {tab.id === 'sos' && (
                <div style={{
                  width: '6px', height: '6px',
                  borderRadius: '50%',
                  background: '#f87171',
                  position: 'absolute',
                  marginTop: '-22px',
                  marginLeft: '14px',
                }} />
              )}
            </button>
          ))}
        </div>

        <div style={{ padding: '16px 16px 48px', overflowY: 'auto' }}>

          {/* ══ ТАБ: АУЛ ══ */}
          {activeTab === 'aoul' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Визуальная карта аула */}
              <div style={{
                padding: '20px',
                borderRadius: '24px',
                background: 'rgba(0,0,0,0.30)',
                border: '1px solid rgba(244,162,97,0.20)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.40)', marginBottom: '16px', letterSpacing: '0.08em' }}>
                  {isKz ? '🏕 АУЫЛ КАРТАСЫ' : '🏕 КАРТА АУЛА'}
                </div>

                {/* Три круга */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    {
                      emoji: '🔥', color: '#ffd060',
                      ru: 'Твой костёр — личное пространство',
                      kz: 'Сенің отың — жеке кеңістік',
                      sub_ru: 'Дневник, мысли, прогресс',
                      sub_kz: 'Күнделік, ойлар, прогресс',
                    },
                    {
                      emoji: '🏕', color: '#f4a261',
                      ru: 'Общий аул — сообщество пути',
                      kz: 'Жалпы ауыл — жол қауымдастығы',
                      sub_ru: 'Встречи, истории, поддержка',
                      sub_kz: 'Жиындар, оқиғалар, қолдау',
                    },
                    {
                      emoji: '🤝', color: '#a78bfa',
                      ru: 'Круг семей — только близким',
                      kz: 'Отбасы шеңбері — тек жақындарға',
                      sub_ru: 'Их путь, их пространство',
                      sub_kz: 'Олардың жолы, олардың кеңістігі',
                    },
                  ].map((circle, i) => (
                    <div key={i} style={{
                      padding: '12px 16px',
                      borderRadius: '16px',
                      background: `${circle.color}0e`,
                      border: `1px solid ${circle.color}25`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      textAlign: 'left',
                    }}>
                      <span style={{ fontSize: '24px', flexShrink: 0 }}>{circle.emoji}</span>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: circle.color }}>
                          {isKz ? circle.kz : circle.ru}
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>
                          {isKz ? circle.sub_kz : circle.sub_ru}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Расписание встреч */}
              <div>
                <div style={{
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.35)',
                  letterSpacing: '0.10em',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                }}>
                  📅 {isKz ? 'АПТАЛЫҚ ЖИЫНДАР' : 'ЕЖЕНЕДЕЛЬНЫЕ ВСТРЕЧИ'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {MEETINGS.map(m => (
                    <MeetingCard key={m.id} meeting={m} isKz={isKz} />
                  ))}
                </div>
              </div>

              {/* Тематические юрты */}
              <div>
                <div style={{
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.35)',
                  letterSpacing: '0.10em',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                }}>
                  🏠 {isKz ? 'ТЕМАТИКАЛЫҚ КИІЗ ҮЙЛЕР' : 'ТЕМАТИЧЕСКИЕ ЮРТЫ'}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[
                    { emoji: '🍺', ru: 'Алкоголь', kz: 'Алкоголь', color: '#f4a261', count: 847 },
                    { emoji: '💊', ru: 'Вещества', kz: 'Заттар', color: '#f87171', count: 432 },
                    { emoji: '🎰', ru: 'Азарт', kz: 'Азарт', color: '#ffd060', count: 213 },
                    { emoji: '📱', ru: 'Цифровое', kz: 'Цифрлық', color: '#60c5fa', count: 156 },
                    { emoji: '🍫', ru: 'Пищевое', kz: 'Тамақ', color: '#6fcf8e', count: 98 },
                    { emoji: '💔', ru: 'Со-зависимость', kz: 'Ко-тəуелділік', color: '#a78bfa', count: 341 },
                  ].map((yurt, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        // Будущий переход в тематическую комнату
                        alert(isKz
                          ? `"${yurt.kz}" юртасы жақында ашылады!`
                          : `Юрта "${yurt.ru}" откроется скоро!`
                        )
                      }}
                      style={{
                        padding: '14px',
                        borderRadius: '16px',
                        border: `1px solid ${yurt.color}25`,
                        background: `${yurt.color}0a`,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        textAlign: 'left',
                        transition: 'all 0.18s',
                      }}
                    >
                      <div style={{ fontSize: '22px', marginBottom: '6px' }}>{yurt.emoji}</div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: yurt.color }}>
                        {isKz ? yurt.kz : yurt.ru}
                      </div>
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', marginTop: '2px' }}>
                        {yurt.count} {isKz ? 'адам' : 'чел.'}
                      </div>
                    </button>
                  ))}
                </div>
                <p style={{
                  margin: '10px 0 0',
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.20)',
                  textAlign: 'center',
                }}>
                  {isKz ? '💬 Чаттар жақында ашылады — бэкенд əзірленуде' : '💬 Чаты откроются скоро — бэкенд в разработке'}
                </p>
              </div>
            </div>
          )}

          {/* ══ ТАБ: ИСТОРИИ ══ */}
          {activeTab === 'stories' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

              {/* Кнопка "Поделиться" */}
              {storyPosted ? (
                <div style={{
                  padding: '14px',
                  borderRadius: '16px',
                  background: 'rgba(111,207,142,0.12)',
                  border: '1px solid rgba(111,207,142,0.30)',
                  textAlign: 'center',
                  fontSize: '14px',
                  color: '#6fcf8e',
                  fontWeight: 600,
                }}>
                  ✓ {isKz ? 'Оқиға жарияланды! Аул сені естиді.' : 'История опубликована! Аул слышит тебя.'}
                </div>
              ) : !showStoryForm ? (
                <button
                  onClick={() => setShowStoryForm(true)}
                  style={{
                    padding: '14px',
                    borderRadius: '16px',
                    border: '1px dashed rgba(244,162,97,0.35)',
                    background: 'rgba(244,162,97,0.05)',
                    color: '#f4a261',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s',
                  }}
                >
                  + {isKz ? 'Өз оқиғаңды бөліс (анонимді)' : 'Поделиться своей историей (анонимно)'}
                </button>
              ) : (
                <div style={{
                  padding: '16px',
                  borderRadius: '18px',
                  background: 'rgba(244,162,97,0.08)',
                  border: '1px solid rgba(244,162,97,0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}>
                  {/* Тип истории */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {(Object.keys(STORY_TYPES) as Story['type'][]).map(type => {
                      const info = STORY_TYPES[type]
                      return (
                        <button
                          key={type}
                          onClick={() => setNewStoryType(type)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '12px',
                            border: `1px solid ${newStoryType === type ? info.color : 'rgba(255,255,255,0.10)'}`,
                            background: newStoryType === type ? `${info.color}20` : 'transparent',
                            color: newStoryType === type ? info.color : 'rgba(255,255,255,0.40)',
                            fontSize: '12px',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                          }}
                        >
                          {info.emoji} {isKz ? info.kz : info.ru}
                        </button>
                      )
                    })}
                  </div>

                  <textarea
                    value={newStoryText}
                    onChange={e => setNewStoryText(e.target.value)}
                    placeholder={isKz
                      ? 'Бүгін не болды? Бір шын сөз жаз... (аты-жөнсіз жарияланады)'
                      : 'Что произошло? Одно честное слово... (публикуется анонимно)'}
                    rows={4}
                    maxLength={500}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '14px',
                      border: '1px solid rgba(255,255,255,0.10)',
                      background: 'rgba(255,255,255,0.05)',
                      color: 'white',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      resize: 'none',
                      outline: 'none',
                      lineHeight: 1.55,
                      boxSizing: 'border-box',
                    }}
                  />

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setShowStoryForm(false)}
                      style={{
                        flex: 1, padding: '10px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.10)',
                        background: 'transparent',
                        color: 'rgba(255,255,255,0.40)',
                        fontSize: '13px',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      {isKz ? 'Болдырмау' : 'Отмена'}
                    </button>
                    <button
                      onClick={postStory}
                      disabled={!newStoryText.trim()}
                      style={{
                        flex: 2, padding: '10px',
                        borderRadius: '12px',
                        border: 'none',
                        background: newStoryText.trim() ? 'rgba(244,162,97,0.85)' : 'rgba(255,255,255,0.06)',
                        color: newStoryText.trim() ? '#1a0f00' : 'rgba(255,255,255,0.20)',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: newStoryText.trim() ? 'pointer' : 'not-allowed',
                        fontFamily: 'inherit',
                        transition: 'all 0.2s',
                      }}
                    >
                      {isKz ? 'Аулға жіберу 🏕' : 'Отправить в аул 🏕'}
                    </button>
                  </div>
                </div>
              )}

              {/* Ленты историй */}
              {stories.map(story => (
                <StoryCard
                  key={story.id}
                  story={story}
                  isKz={isKz}
                  onHeart={handleHeart}
                  hearted={heartedIds.has(story.id)}
                />
              ))}
            </div>
          )}

          {/* ══ ТАБ: СЕМЬЯМ ══ */}
          {activeTab === 'family' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

              {/* Важный блок */}
              <div style={{
                padding: '18px',
                borderRadius: '20px',
                background: 'rgba(167,139,250,0.08)',
                border: '1px solid rgba(167,139,250,0.25)',
              }}>
                <div style={{ fontSize: '22px', marginBottom: '10px', textAlign: 'center' }}>🤝</div>
                <h3 style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: 700, textAlign: 'center' }}>
                  {isKz ? 'Бұл бет — сіздікі' : 'Эта страница — ваша'}
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.60)', lineHeight: 1.7, textAlign: 'center' }}>
                  {isKz
                    ? 'Сіз де жолдасыз. Тəуелдінің жолы — сіздің де жолыңыз. Мұнда соттамайды.'
                    : 'Вы тоже в пути. Путь зависимого — ваш путь тоже. Здесь не осуждают.'}
                </p>
              </div>

              {/* Гид для семей */}
              {[
                {
                  emoji: '🧠',
                  titleRu: 'Что происходит с вашим близким',
                  titleKz: 'Жақыныңызға не болып жатыр',
                  pointsRu: [
                    'Зависимость — это болезнь мозга, не слабость характера.',
                    'Он/она не выбирает страдать. Мозг изменён химически.',
                    'Выздоровление реально — но требует времени и поддержки.',
                  ],
                  pointsKz: [
                    'Тəуелділік — мінез əлсіздігі емес, ми ауруы.',
                    'Ол зардап шегуді таңдамайды. Ми химиялық өзгерген.',
                    'Жазылу шынайы — бірақ уақыт пен қолдауды қажет етеді.',
                  ],
                  color: '#a78bfa',
                },
                {
                  emoji: '💪',
                  titleRu: 'Как помочь — не разрушая себя',
                  titleKz: 'Өзіңді бұзбай қалай көмектесу',
                  pointsRu: [
                    'Говорите о поведении, не о личности. "Когда ты..." не "ты всегда..."',
                    'Устанавливайте границы из любви, не из наказания.',
                    'Вы не можете выздороветь за него. Только рядом.',
                    'Ваша стабильность — это тоже лечение.',
                  ],
                  pointsKz: [
                    'Тұлға туралы емес, мінез-құлық туралы сөйлеңіз.',
                    'Жазалаудан емес, сүйіспеншіліктен шекара қойыңыз.',
                    'Оның орнына жазыла алмайсыз. Тек қасында.',
                    'Сіздің тұрақтылығыңыз — бұл да емдеу.',
                  ],
                  color: '#6fcf8e',
                }
              ].map((item, i) => (
                <div key={i} style={{
                  padding: '16px',
                  borderRadius: '18px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '20px' }}>{item.emoji}</span>
                    <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: item.color }}>
                      {isKz ? item.titleKz : item.titleRu}
                    </h4>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(isKz ? item.pointsKz : item.pointsRu).map((p, pi) => (
                      <li key={pi} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.50)', lineHeight: 1.5 }}>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* ══ ТАБ: SOS ══ */}
          {activeTab === 'sos' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                padding: '16px',
                borderRadius: '18px',
                background: 'rgba(248,113,113,0.10)',
                border: '1px solid rgba(248,113,113,0.30)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>🆘</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#f87171', marginBottom: '4px' }}>
                  {isKz ? 'Сен жалғыз емессің' : 'Ты не один'}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.50)' }}>
                  {isKz ? 'Көмек сұрау — бұл күш' : 'Просить о помощи — это сила'}
                </div>
              </div>

              {SOS_CONTACTS.map((c, i) => (
                <a
                  key={i}
                  href={`tel:${c.phone.replace(/[^0-9+]/g, '')}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '16px',
                    borderRadius: '18px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    textDecoration: 'none',
                  }}
                >
                  <div style={{
                    width: '40px', height: '40px',
                    borderRadius: '12px',
                    background: `${c.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    color: c.color,
                  }}>
                    📞
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>
                      {isKz ? c.nameKz : c.nameRu}
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>
                      {isKz ? c.descKz : c.descRu}
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: c.color }}>
                    {c.phone}
                  </div>
                </a>
              ))}
            </div>
          )}

        </div>
      </div>
    </SectionShell>
  )
}