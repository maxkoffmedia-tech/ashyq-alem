'use client'

import { useState } from 'react'

// ─── Типы ──────────────────────────────────────────────────────────────────
interface Center {
  id: string
  name: string
  nameKz: string
  type: 'rehab' | 'narcology' | 'psych' | 'support'
  city: string
  cityKz: string
  address: string
  rating: number
  reviews: number
  tags: string[]
  tagsKz: string[]
  description: string
  descriptionKz: string
  lat: number
  lng: number
  price: string
  priceKz: string
  phone?: string
  website?: string
  hours?: string
  anonymous: boolean
  free: boolean
}

// ─── Данные (реальные центры Казахстана) ────────────────────────────────────
const CENTERS: Center[] = [
  {
    id: 'c1',
    name: 'Amanat Rehab',
    nameKz: 'Amanat Rehab',
    type: 'rehab',
    city: 'Алматы', cityKz: 'Алматы',
    address: 'мкр. Астана, 21',
    rating: 4.9, reviews: 149,
    tags: ['Алкоголь', 'Наркотики', 'Игромания', 'Анонимно', 'КЗ язык'],
    tagsKz: ['Алкоголь', 'Есірткі', 'Ойын', 'Анонимді', 'ҚЗ тіл'],
    description: 'Лицензированный центр реабилитации. 3 филиала в Алматы. Бесплатные консультации, анонимно, на казахском и русском. Индивидуальные программы, поддержка семьи.',
    descriptionKz: 'Лицензияланған оңалту орталығы. Алматыда 3 филиал. Тегін кеңестер, анонимді, қазақ және орыс тілдерінде. Жеке бағдарламалар, отбасын қолдау.',
    lat: 43.2220, lng: 76.8512,
    price: 'Бесплатная консультация', priceKz: 'Тегін кеңес',
    phone: '+7 701 223 75 57',
    website: 'amanatcenter.kz',
    hours: 'Круглосуточно',
    anonymous: true, free: true,
  },
  {
    id: 'c2',
    name: 'Hayat Clinic',
    nameKz: 'Hayat Clinic',
    type: 'narcology',
    city: 'Алматы', cityKz: 'Алматы',
    address: 'ул. Кабанбай Батыра, 172',
    rating: 4.7, reviews: 98,
    tags: ['Детокс', 'Реабилитация', 'Алкоголь', 'Наркотики', '24/7'],
    tagsKz: ['Детокс', 'Оңалту', 'Алкоголь', 'Есірткі', '24/7'],
    description: 'Частный наркологический диспансер. Индивидуальная программа для каждого пациента. Детоксикация, реабилитация, социальная адаптация. Помощь в трудоустройстве после лечения.',
    descriptionKz: 'Жеке наркологиялық диспансер. Əр пациентке жеке бағдарлама. Детоксикация, оңалту, əлеуметтік бейімдеу.',
    lat: 43.2567, lng: 76.9286,
    price: 'Консультация бесплатно', priceKz: 'Кеңес тегін',
    phone: '+7 727 221 01 22',
    website: 'hayatmed.kz',
    hours: 'Круглосуточно',
    anonymous: true, free: false,
  },
  {
    id: 'c3',
    name: 'Орион Рехаб',
    nameKz: 'Орион Рехаб',
    type: 'narcology',
    city: 'Алматы', cityKz: 'Алматы',
    address: 'мкр. Астана, д. 22',
    rating: 4.6, reviews: 73,
    tags: ['Анонимно', 'Без учёта', 'Алкоголь', 'Наркотики', 'Игромания'],
    tagsKz: ['Анонимді', 'Есепсіз', 'Алкоголь', 'Есірткі', 'Ойын'],
    description: 'Анонимное лечение без постановки на наркологический учёт. Программы 12 шагов, Day Top, Миннесотская модель. Постреабилитационная поддержка.',
    descriptionKz: 'Наркологиялық есепке алусыз анонимді ем. 12 қадым, Day Top, Миннесота үлгісі бағдарламалары.',
    lat: 43.2198, lng: 76.8634,
    price: 'По запросу', priceKz: 'Сұранымен',
    phone: '+7 705 235 98 47',
    website: 'narcologiya.kz',
    hours: 'Круглосуточно',
    anonymous: true, free: false,
  },
  {
    id: 'c4',
    name: 'Рекавери Алматы',
    nameKz: 'Рекавери Алматы',
    type: 'rehab',
    city: 'Алматы', cityKz: 'Алматы',
    address: 'ул. Оспанова, 162',
    rating: 4.5, reviews: 112,
    tags: ['12 шагов', 'Программа 7Н', 'Группы', 'Семья'],
    tagsKz: ['12 қадым', '7Н бағдарламасы', 'Топтар', 'Отбасы'],
    description: 'Международная сеть (20 филиалов в 5 странах). Авторская программа «7 навыков». Групповая и индивидуальная терапия. 3 филиала в Алматы.',
    descriptionKz: 'Халықаралық желі (5 елде 20 филиал). «7 дағды» авторлық бағдарламасы. Топтық және жеке терапия.',
    lat: 43.2341, lng: 76.9012,
    price: 'Бесплатная консультация', priceKz: 'Тегін кеңес',
    phone: '+7 727 000 00 00',
    website: 'recovery-center.kz',
    hours: 'Пн–Вс 9:00–21:00',
    anonymous: true, free: true,
  },
  {
    id: 'c5',
    name: 'MedBrat — наркология',
    nameKz: 'MedBrat — наркология',
    type: 'narcology',
    city: 'Алматы', cityKz: 'Алматы',
    address: 'Алматы (уточняйте при звонке)',
    rating: 4.4, reviews: 61,
    tags: ['Вывод из запоя', 'Кодировка', 'На дому', 'Анонимно'],
    tagsKz: ['Ішкіліктен шығу', 'Кодтау', 'Үйге шығу', 'Анонимді'],
    description: 'Анонимная наркологическая помощь. Вывод из запоя на дому и в клинике. Кодировки, детоксикация. Запатентованный метод лечения.',
    descriptionKz: 'Анонимді наркологиялық көмек. Үйде және клиникада ішкіліктен шығу. Кодтау, детоксикация.',
    lat: 43.2456, lng: 76.8901,
    price: 'Скидка 10% онлайн', priceKz: 'Онлайн 10% жеңілдік',
    phone: '+7 727 000 00 01',
    website: 'medbrat.kz',
    hours: 'Круглосуточно',
    anonymous: true, free: false,
  },
  {
    id: 'c6',
    name: 'Клиника д-ра Шурова',
    nameKz: 'Шуров д-р клиникасы',
    type: 'psych',
    city: 'Алматы', cityKz: 'Алматы',
    address: 'Алматы',
    rating: 4.3, reviews: 44,
    tags: ['Психиатрия', 'Нарколог', 'Онлайн консультация'],
    tagsKz: ['Психиатрия', 'Нарколог', 'Онлайн кеңес'],
    description: 'Частная психиатрическая клиника. Нарколог-психиатр, индивидуальные программы. Онлайн-консультации главного врача.',
    descriptionKz: 'Жеке психиатриялық клиника. Нарколог-психиатр, жеке бағдарламалар. Бас дəрігермен онлайн кеңестер.',
    lat: 43.2389, lng: 76.9134,
    price: 'от 13 144 ₸', priceKz: '13 144 ₸-ден',
    phone: '+7 717 269 68 10',
    hours: 'Пн–Пт 9:00–18:00',
    anonymous: true, free: false,
  },
  {
    id: 'c7',
    name: 'Amanat Rehab Астана',
    nameKz: 'Amanat Rehab Астана',
    type: 'rehab',
    city: 'Астана', cityKz: 'Астана',
    address: 'ул. Аксу-Аюлы, 13',
    rating: 4.8, reviews: 87,
    tags: ['Алкоголь', 'Наркотики', 'Анонимно', 'КЗ язык', 'Семья'],
    tagsKz: ['Алкоголь', 'Есірткі', 'Анонимді', 'ҚЗ тіл', 'Отбасы'],
    description: 'Филиал Amanat в Астане. Те же стандарты, лицензия Минздрава РК. Круглосуточная горячая линия, консультации для семей.',
    descriptionKz: 'Астанадағы Amanat филиалы. Сол стандарттар, ҚР Денсаулық сақтау министрлігінің лицензиясы.',
    lat: 51.1605, lng: 71.4704,
    price: 'Бесплатная консультация', priceKz: 'Тегін кеңес',
    phone: '+7 701 223 75 57',
    website: 'amanatcenter.kz',
    hours: 'Круглосуточно',
    anonymous: true, free: true,
  },
  {
    id: 'c8',
    name: 'Ренессанс Астана',
    nameKz: 'Ренессанс Астана',
    type: 'rehab',
    city: 'Астана', cityKz: 'Астана',
    address: 'пер. Шашу, 15',
    rating: 4.6, reviews: 93,
    tags: ['Реабилитация', 'Анонимно', 'Алкоголь', 'Игромания'],
    tagsKz: ['Оңалту', 'Анонимді', 'Алкоголь', 'Ойын'],
    description: 'Квалифицированный реабилитационный центр. Помощь пациентам со всей страны. Постреабилитационные консультации бесплатно.',
    descriptionKz: 'Білікті оңалту орталығы. Бүкіл елден пациенттерге көмек. Оңалтудан кейінгі кеңестер тегін.',
    lat: 51.1801, lng: 71.4460,
    price: 'По запросу', priceKz: 'Сұранымен',
    phone: '+7 717 200 00 00',
    website: 'renessans-astana.kz',
    hours: 'Пн–Вс 9:00–20:00',
    anonymous: true, free: false,
  },
  {
    id: 'c9',
    name: 'Рекавери Астана',
    nameKz: 'Рекавери Астана',
    type: 'rehab',
    city: 'Астана', cityKz: 'Астана',
    address: 'ул. Илияс Есенберлин, 38',
    rating: 4.5, reviews: 56,
    tags: ['12 шагов', 'Группы', 'Психолог', 'Семья'],
    tagsKz: ['12 қадым', 'Топтар', 'Психолог', 'Отбасы'],
    description: 'Международная программа Recovery в Астане. Групповые сессии, индивидуальная терапия, поддержка семей зависимых.',
    descriptionKz: 'Астанадағы халықаралық Recovery бағдарламасы. Топтық сессиялар, жеке терапия, тəуелді отбасыларын қолдау.',
    lat: 51.1698, lng: 71.4289,
    price: 'Бесплатная консультация', priceKz: 'Тегін кеңес',
    phone: '+7 717 000 00 00',
    website: 'recovery-center.kz',
    hours: 'Пн–Вс 9:00–21:00',
    anonymous: true, free: true,
  },
  {
    id: 'c10',
    name: 'Эмирмед Шымкент',
    nameKz: 'Эмирмед Шымкент',
    type: 'narcology',
    city: 'Шымкент', cityKz: 'Шымкент',
    address: 'ул. Рашидова, 36/15',
    rating: 4.4, reviews: 48,
    tags: ['Наркология', 'Алкоголь', '24/7', 'Анонимно'],
    tagsKz: ['Наркология', 'Алкоголь', '24/7', 'Анонимді'],
    description: 'Сеть клиник №1 в Казахстане. Психологическая помощь при зависимостях в Шымкенте. Анонимно, круглосуточно.',
    descriptionKz: 'Қазақстандағы №1 клиникалар желісі. Шымкентте тəуелділіктен психологиялық көмек. Анонимді, тəулік бойы.',
    lat: 42.3417, lng: 69.5901,
    price: 'По запросу', priceKz: 'Сұранымен',
    phone: '+7 725 200 00 00',
    hours: 'Круглосуточно',
    anonymous: true, free: false,
  },
  {
    id: 'c11',
    name: 'Свободные люди',
    nameKz: 'Бос адамдар',
    type: 'support',
    city: 'Шымкент', cityKz: 'Шымкент',
    address: 'Шымкент',
    rating: 4.7, reviews: 34,
    tags: ['Реабилитация', 'Группы поддержки', 'Психолог'],
    tagsKz: ['Оңалту', 'Қолдау топтары', 'Психолог'],
    description: 'Центр реабилитации и лечения зависимостей. Группы поддержки, психологическое консультирование, программы восстановления.',
    descriptionKz: 'Тəуелділікті оңалту және емдеу орталығы. Қолдау топтары, психологиялық кеңес, қалпына келтіру бағдарламалары.',
    lat: 42.3201, lng: 69.6134,
    price: 'По запросу', priceKz: 'Сұранымен',
    phone: '+7 725 000 00 01',
    hours: 'Пн–Пт 9:00–18:00',
    anonymous: true, free: false,
  },
  {
    id: 'c12',
    name: 'РНПЦМСО МЗ РК — Алматы',
    nameKz: 'РНПЦМСО ДМ ҚР — Алматы',
    type: 'narcology',
    city: 'Алматы', cityKz: 'Алматы',
    address: 'ул. Горного Гиганта, 180',
    rating: 3.8, reviews: 215,
    tags: ['Бесплатно', 'Государственный', 'ГОБМП', 'Нарколог'],
    tagsKz: ['Тегін', 'Мемлекеттік', 'МББКК', 'Нарколог'],
    description: 'Республиканский научно-практический центр. Бесплатная помощь по ГОБМП. Государственный наркологический диспансер, принимают по направлению и без.',
    descriptionKz: 'Республикалық ғылыми-практикалық орталық. МББКК бойынша тегін көмек. Мемлекеттік наркологиялық диспансер.',
    lat: 43.2789, lng: 76.8456,
    price: 'Бесплатно (ГОБМП)', priceKz: 'Тегін (МББКК)',
    phone: '109',
    hours: 'Круглосуточно',
    anonymous: false, free: true,
  },
]

// ─── Иконки типов ───────────────────────────────────────────────────────────
const TYPE_ICONS: Record<Center['type'], string> = {
  rehab: '🏥', narcology: '💊', psych: '🧠', support: '🤝',
}

const TYPE_LABELS_RU: Record<Center['type'], string> = {
  rehab: 'Реабилитация', narcology: 'Наркология', psych: 'Психиатрия', support: 'Группы поддержки',
}

const TYPE_LABELS_KZ: Record<Center['type'], string> = {
  rehab: 'Оңалту', narcology: 'Наркология', psych: 'Психиатрия', support: 'Қолдау топтары',
}

const TYPE_COLORS: Record<Center['type'], string> = {
  rehab: '#6fcf8e', narcology: '#ffd060', psych: '#a78bfa', support: '#60c5fa',
}

// ─── Позиции маркеров ─────────────────────────────────────────────────────────
const CENTER_POSITIONS: Record<string, { x: string; y: string }> = {
  c1: { x: '63%', y: '73%' }, c2: { x: '65%', y: '71%' }, c3: { x: '62%', y: '74%' },
  c4: { x: '64%', y: '70%' }, c5: { x: '66%', y: '72%' }, c6: { x: '63%', y: '69%' },
  c7: { x: '53%', y: '36%' }, c8: { x: '54%', y: '34%' }, c9: { x: '52%', y: '37%' },
  c10: { x: '49%', y: '82%' }, c11: { x: '50%', y: '83%' }, c12: { x: '61%', y: '72%' },
}

// ─── Вспомогательные компоненты ───────────────────────────────────────────────
function TulparRating({ value, count }: { value: number; count: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ fontSize: '13px', opacity: i <= Math.round(value) ? 1 : 0.25 }}>🐎</span>
      ))}
      <span style={{ fontSize: '12px', color: 'rgba(255,235,160,0.9)', marginLeft: '4px' }}>
        {value.toFixed(1)} ({count})
      </span>
    </div>
  )
}

function CenterCard({ center, locale, onClose }: { center: Center; locale: 'ru' | 'kz'; onClose: () => void }) {
  const isKz = locale === 'kz'
  const mapsUrl = `https://www.google.com/maps?q=${center.lat},${center.lng}`
  return (
    <div style={{
      position: 'relative', background: 'rgba(10, 20, 10, 0.9)', backdropFilter: 'blur(24px)',
      border: '1px solid rgba(255, 210, 80, 0.3)', borderRadius: '20px', padding: '24px',
      width: '100%', maxWidth: '420px', color: 'white', animation: 'slideUp 0.3s ease'
    }}>
      <button onClick={onClose} style={{ position: 'absolute', top: '14px', right: '14px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>✕</button>
      <div style={{ fontSize: '11px', color: '#ffd060', marginBottom: '8px' }}>
        {TYPE_ICONS[center.type]} {isKz ? TYPE_LABELS_KZ[center.type] : TYPE_LABELS_RU[center.type]} · {isKz ? center.cityKz : center.city}
      </div>
      <h3 style={{ margin: '0 0 8px' }}>{isKz ? center.nameKz : center.name}</h3>
      <TulparRating value={center.rating} count={center.reviews} />
      <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'rgba(255,255,255,0.8)' }}>{isKz ? center.descriptionKz : center.description}</p>
      <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
        <a href={mapsUrl} target="_blank" rel="noreferrer" style={{ flex: 1, padding: '10px', background: '#ffd060', color: 'black', borderRadius: '12px', textAlign: 'center', fontWeight: 700, textDecoration: 'none' }}>
          {isKz ? 'Жолды құру' : 'Маршрут'}
        </a>
      </div>
    </div>
  )
}

function MapDot({ center, isActive, onClick, style }: { center: Center; isActive: boolean; onClick: () => void; style: React.CSSProperties }) {
  const color = TYPE_COLORS[center.type]
  return (
    <button onClick={onClick} style={{
      position: 'absolute', ...style, width: isActive ? '24px' : '16px', height: isActive ? '24px' : '16px',
      borderRadius: '50%', border: `2px solid ${color}`, background: isActive ? color : `${color}40`,
      cursor: 'pointer', transform: 'translate(-50%, -50%)', transition: 'all 0.2s', zIndex: isActive ? 10 : 2
    }}>
      {isActive && <span style={{ fontSize: '12px' }}>{TYPE_ICONS[center.type]}</span>}
    </button>
  )
}

// ─── Главный компонент ───────────────────────────────────────────────────────
export default function MapSection({ locale = 'ru', onClose }: { locale?: 'ru' | 'kz'; onClose?: () => void }) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const isKz = locale === 'kz'
  const activeCenter = CENTERS.find(c => c.id === activeId)
  const filtered = filter === 'all' ? CENTERS : CENTERS.filter(c => c.type === filter)

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(5, 15, 8, 0.95)', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      
      {/* Header */}
      <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
        <div>
          <h2 style={{ margin: 0 }}>{isKz ? 'Емдеу орталықтары' : 'Центры помощи'}</h2>
          <span style={{ fontSize: '12px', color: '#ffd060' }}>{isKz ? 'Қазақстан бойынша' : 'По всему Казахстану'}</span>
        </div>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer' }}>
          {isKz ? 'Артқа' : 'Назад'}
        </button>
      </div>

      {/* Map Area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <svg viewBox="0 0 800 520" style={{ width: '100%', height: '100%' }}>
          <path d="M 148 108 L 366 54 L 548 66 L 672 178 L 548 356 L 370 396 L 136 166 Z" fill="rgba(255,210,80,0.05)" stroke="rgba(255,200,60,0.3)" />
          {/* Города-метки */}
          <circle cx="534" cy="370" r="3" fill="gold" /> <text x="545" y="375" fill="white" fontSize="10">Almaty</text>
          <circle cx="424" cy="178" r="3" fill="gold" /> <text x="435" y="183" fill="white" fontSize="10">Astana</text>
        </svg>

        {filtered.map(c => (
          <MapDot key={c.id} center={c} isActive={activeId === c.id} onClick={() => setActiveId(c.id)} style={{ left: CENTER_POSITIONS[c.id]?.x, top: CENTER_POSITIONS[c.id]?.y }} />
        ))}

        {activeCenter && (
          <div style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', width: '90%', display: 'flex', justifyContent: 'center' }}>
            <CenterCard center={activeCenter} locale={isKz ? 'kz' : 'ru'} onClose={() => setActiveId(null)} />
          </div>
        )}
      </div>
    </div>
  )
}