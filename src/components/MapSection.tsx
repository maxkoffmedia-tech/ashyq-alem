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
  anonymous: boolean   // анонимное лечение
  free: boolean        // есть бесплатные услуги
}

// ─── Данные (реальные центры Казахстана) ────────────────────────────────────
const CENTERS: Center[] = [
  // ── АЛМАТЫ ──────────────────────────────────────────────────────────────
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
  // ── АСТАНА ──────────────────────────────────────────────────────────────
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
  // ── ШЫМКЕНТ ─────────────────────────────────────────────────────────────
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
  // ── ГОСУДАРСТВЕННЫЕ (бесплатные) ────────────────────────────────────────
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
  rehab:      '🏥',
  narcology:  '💊',
  psych:      '🧠',
  support:    '🤝',
}

const TYPE_LABELS_RU: Record<Center['type'], string> = {
  rehab:     'Реабилитация',
  narcology: 'Наркология',
  psych:     'Психиатрия',
  support:   'Группы поддержки',
}

const TYPE_LABELS_KZ: Record<Center['type'], string> = {
  rehab:     'Оңалту',
  narcology: 'Наркология',
  psych:     'Психиатрия',
  support:   'Қолдау топтары',
}

// ─── Тулпар-рейтинг ─────────────────────────────────────────────────────────
function TulparRating({ value, count }: { value: number; count: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          style={{
            fontSize: '13px',
            opacity: i <= Math.round(value) ? 1 : 0.25,
            filter: i <= Math.round(value) ? 'drop-shadow(0 0 3px rgba(255,200,60,0.8))' : 'none',
          }}
        >
          🐎
        </span>
      ))}
      <span style={{ fontSize: '12px', color: 'rgba(255,235,160,0.9)', marginLeft: '4px' }}>
        {value.toFixed(1)} ({count})
      </span>
    </div>
  )
}

// ─── Карточка центра ─────────────────────────────────────────────────────────
function CenterCard({
  center,
  locale,
  onClose,
}: {
  center: Center
  locale: 'ru' | 'kz'
  onClose: () => void
}) {
  const isKz = locale === 'kz'
  const name = isKz ? center.nameKz : center.name
  const city = isKz ? center.cityKz : center.city
  const description = isKz ? center.descriptionKz : center.description
  const tags = isKz ? center.tagsKz : center.tags
  const price = isKz ? center.priceKz : center.price
  const typeLabel = isKz ? TYPE_LABELS_KZ[center.type] : TYPE_LABELS_RU[center.type]

  const mapsUrl = `https://www.google.com/maps?q=${center.lat},${center.lng}`

  return (
    <div
      style={{
        position: 'relative',
        background: 'rgba(10, 20, 10, 0.75)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 210, 80, 0.25)',
        borderRadius: '20px',
        padding: '24px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,220,80,0.08)',
        color: 'white',
        animation: 'slideUp 0.25s ease',
      }}
    >
      {/* Закрыть */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '14px',
          right: '14px',
          background: 'rgba(255,255,255,0.08)',
          border: 'none',
          borderRadius: '50%',
          width: '28px',
          height: '28px',
          cursor: 'pointer',
          color: 'rgba(255,255,255,0.7)',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        ✕
      </button>

      {/* Тип */}
      <div style={{ fontSize: '11px', color: 'rgba(255,200,80,0.8)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
        {TYPE_ICONS[center.type]} {typeLabel} · {city}
      </div>

      {/* Название */}
      <h3 style={{ margin: '0 0 8px', fontSize: '1.15rem', fontWeight: 700, lineHeight: 1.3 }}>
        {name}
      </h3>

      {/* Рейтинг */}
      <TulparRating value={center.rating} count={center.reviews} />

      {/* Бейджи */}
      <div style={{ display: 'flex', gap: '6px', margin: '8px 0', flexWrap: 'wrap' }}>
        {center.anonymous && (
          <span style={{
            padding: '3px 10px', borderRadius: '20px',
            background: 'rgba(111,207,142,0.15)', border: '1px solid rgba(111,207,142,0.35)',
            fontSize: '11px', color: '#6fcf8e', fontWeight: 600,
          }}>🔒 {isKz ? 'Анонимді' : 'Анонимно'}</span>
        )}
        {center.free && (
          <span style={{
            padding: '3px 10px', borderRadius: '20px',
            background: 'rgba(96,197,250,0.15)', border: '1px solid rgba(96,197,250,0.35)',
            fontSize: '11px', color: '#60c5fa', fontWeight: 600,
          }}>✦ {isKz ? 'Тегін кеңес' : 'Бесплатная консультация'}</span>
        )}
        {center.hours && (
          <span style={{
            padding: '3px 10px', borderRadius: '20px',
            background: 'rgba(255,208,96,0.12)', border: '1px solid rgba(255,208,96,0.25)',
            fontSize: '11px', color: 'rgba(255,220,100,0.85)',
          }}>🕐 {center.hours}</span>
        )}
      </div>

      {/* Описание */}
      <p style={{ margin: '12px 0', fontSize: '13px', color: 'rgba(255,240,200,0.82)', lineHeight: 1.6 }}>
        {description}
      </p>

      {/* Теги */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
        {tags.map(tag => (
          <span
            key={tag}
            style={{
              padding: '3px 10px',
              borderRadius: '20px',
              background: 'rgba(255,200,60,0.12)',
              border: '1px solid rgba(255,200,60,0.25)',
              fontSize: '11px',
              color: 'rgba(255,230,140,0.9)',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Цена */}
      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>
        💰 {price}
      </div>

      {/* Кнопки */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '12px',
            background: 'rgba(255,200,60,0.85)',
            color: '#1a0f00',
            fontSize: '13px',
            fontWeight: 700,
            textAlign: 'center',
            textDecoration: 'none',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          🗺 {isKz ? 'Жолды құру' : 'Построить маршрут'}
        </a>

        {center.website && (
          <a
            href={`https://${center.website}`}
            target="_blank" rel="noopener noreferrer"
            style={{
              padding: '10px 14px',
              borderRadius: '12px',
              background: 'rgba(167,139,250,0.12)',
              border: '1px solid rgba(167,139,250,0.25)',
              color: 'rgba(200,180,255,0.85)',
              fontSize: '12px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              whiteSpace: 'nowrap',
            }}
          >
            🌐
          </a>
        )}
        {center.phone && (
          <a
            href={`tel:${center.phone}`}
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.85)',
              fontSize: '13px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            📞
          </a>
        )}
      </div>
    </div>
  )
}

// ─── Мини-маркер на карте ────────────────────────────────────────────────────
const TYPE_COLORS: Record<Center['type'], string> = {
  rehab:     '#6fcf8e',
  narcology: '#ffd060',
  psych:     '#a78bfa',
  support:   '#60c5fa',
}

function MapDot({
  center,
  isActive,
  onClick,
  style,
}: {
  center: Center
  isActive: boolean
  onClick: () => void
  style: React.CSSProperties
}) {
  const color = TYPE_COLORS[center.type]
  const icon  = TYPE_ICONS[center.type]

  return (
    <button
      onClick={onClick}
      title={center.name}
      style={{
        position: 'absolute',
        ...style,
        width: isActive ? '22px' : '16px',
        height: isActive ? '22px' : '16px',
        borderRadius: '50%',
        border: `2px solid ${color}`,
        background: isActive
          ? color
          : `${color}40`,
        boxShadow: isActive
          ? `0 0 0 4px ${color}30, 0 0 20px ${color}80, 0 0 40px ${color}40`
          : `0 0 8px ${color}60`,
        cursor: 'pointer',
        transform: 'translate(-50%, -50%)',
        transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        zIndex: isActive ? 10 : 2,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: isActive ? '12px' : '9px',
      }}
    >
      {/* Пульс-кольцо */}
      {!isActive && (
        <span style={{
          position: 'absolute',
          inset: '-4px',
          borderRadius: '50%',
          border: `1px solid ${color}50`,
          animation: 'dotPulse 2.5s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
      )}

      {/* Иконка типа */}
      {isActive && (
        <span style={{ fontSize: '11px', lineHeight: 1 }}>{icon}</span>
      )}

      {/* Тултип с названием */}
      <span style={{
        position: 'absolute',
        bottom: '22px',
        left: '50%',
        transform: 'translateX(-50%)',
        whiteSpace: 'nowrap',
        background: 'rgba(5,10,20,0.92)',
        border: `1px solid ${color}40`,
        backdropFilter: 'blur(8px)',
        padding: '4px 10px',
        borderRadius: '8px',
        fontSize: '11px',
        fontWeight: 600,
        color: 'white',
        opacity: isActive ? 1 : 0,
        transform: isActive
          ? 'translateX(-50%) translateY(0)'
          : 'translateX(-50%) translateY(4px)',
        transition: 'all 0.2s ease',
        pointerEvents: 'none',
        maxWidth: '160px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        boxShadow: `0 4px 12px rgba(0,0,0,0.5)`,
      }}>
        {icon} {center.name}
      </span>
    </button>
  )
}

// ─── Главный компонент ───────────────────────────────────────────────────────
const TYPE_FILTERS_RU = [
  { value: 'all',       label: 'Все'          },
  { value: 'rehab',     label: 'Реабилитация' },
  { value: 'narcology', label: 'Наркология'   },
  { value: 'psych',     label: 'Психиатрия'   },
  { value: 'support',   label: 'Поддержка'    },
]

const TYPE_FILTERS_KZ = [
  { value: 'all',       label: 'Барлығы'   },
  { value: 'rehab',     label: 'Оңалту'    },
  { value: 'narcology', label: 'Наркология'},
  { value: 'psych',     label: 'Психиатрия'},
  { value: 'support',   label: 'Қолдау'    },
]

// Позиции маркеров на SVG-карте (проценты от размера карты)
// Примерные позиции для Казахстана
const CENTER_POSITIONS: Record<string, { x: string; y: string }> = {
  // Алматы — кластер справа-снизу
  c1: { x: '63%', y: '73%' },
  c2: { x: '65%', y: '71%' },
  c3: { x: '62%', y: '74%' },
  c4: { x: '64%', y: '70%' },
  c5: { x: '66%', y: '72%' },
  c6: { x: '63%', y: '69%' },
  // Астана — центр
  c7: { x: '53%', y: '36%' },
  c8: { x: '54%', y: '34%' },
  c9: { x: '52%', y: '37%' },
  // Шымкент — юг
  c10: { x: '49%', y: '82%' },
  c11: { x: '50%', y: '83%' },
  // Алматы гос.
  c12: { x: '61%', y: '72%' },
}

export default function MapSection({ locale = 'ru' }: { locale?: 'ru' | 'kz' }) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const isKz = locale === 'kz'

  const filters = isKz ? TYPE_FILTERS_KZ : TYPE_FILTERS_RU
  const activeCenter = CENTERS.find(c => c.id === activeId) ?? null

  const filtered = filter === 'all'
    ? CENTERS
    : CENTERS.filter(c => c.type === filter)

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(5, 15, 8, 0.92)',
        backdropFilter: 'blur(12px)',
        color: 'white',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes dotPulse {
          0%   { transform: scale(1);   opacity: 0.7; }
          70%  { transform: scale(2.2); opacity: 0;   }
          100% { transform: scale(1);   opacity: 0;   }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── Шапка ── */}
      <div style={{
        padding: '16px 24px 12px',
        borderBottom: '1px solid rgba(255,200,60,0.15)',
        flexShrink: 0,
      }}>
        <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>
          🗺 {isKz ? 'Емдеу орталықтары' : 'Центры помощи'}
        </h2>
        <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'rgba(255,235,160,0.7)' }}>
          {isKz
            ? 'Қазақстанның реабилитация және нарколог орталықтары'
            : 'Реабилитационные и наркологические центры Казахстана'}
        </p>

        {/* Фильтры */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                padding: '5px 14px',
                borderRadius: '20px',
                border: `1px solid ${filter === f.value ? 'rgba(255,200,60,0.8)' : 'rgba(255,255,255,0.15)'}`,
                background: filter === f.value ? 'rgba(255,200,60,0.18)' : 'transparent',
                color: filter === f.value ? 'rgba(255,220,100,1)' : 'rgba(255,255,255,0.6)',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.18s',
                fontWeight: filter === f.value ? 600 : 400,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Тело: карта + список ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Карта-схема Казахстана */}
        <div style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* ── Фоновый градиент степи ── */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 60% 65%, rgba(20,45,15,0.95) 0%, rgba(5,12,8,0.98) 100%)',
          }} />

          {/* ── SVG Казахстан — реалистичный контур ── */}
          <svg
            viewBox="0 0 800 520"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="mapGlow">
                <feGaussianBlur stdDeviation="4" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="softBlur">
                <feGaussianBlur stdDeviation="8"/>
              </filter>
              {/* Градиент заливки */}
              <linearGradient id="kazFill" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,210,80,0.12)"/>
                <stop offset="100%" stopColor="rgba(180,140,30,0.06)"/>
              </linearGradient>
              <radialGradient id="cityGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(255,220,100,0.6)"/>
                <stop offset="100%" stopColor="rgba(255,180,40,0)"/>
              </radialGradient>
            </defs>

            {/* Свечение под картой */}
            <ellipse cx="400" cy="300" rx="370" ry="200"
              fill="rgba(255,200,60,0.04)" filter="url(#softBlur)" />

            {/* Контур Казахстана — реалистичный */}
            <path
              d="
                M 148 108
                L 162 94 L 178 82 L 198 74 L 224 68 L 258 62
                L 292 58 L 330 55 L 366 54 L 398 56
                L 424 60 L 448 62 L 472 60 L 496 58
                L 524 60 L 548 66 L 572 76 L 594 88
                L 614 100 L 632 114 L 648 128 L 660 144
                L 668 160 L 672 178 L 670 196 L 664 212
                L 654 226 L 640 238 L 624 248 L 606 256
                L 592 264 L 582 272 L 576 284 L 574 298
                L 572 312 L 568 328 L 560 342 L 548 356
                L 532 368 L 514 378 L 494 386 L 472 392
                L 448 396 L 422 398 L 396 398 L 370 396
                L 344 392 L 318 386 L 292 378 L 268 368
                L 246 356 L 226 342 L 208 326 L 192 310
                L 178 292 L 166 274 L 156 256 L 148 238
                L 142 220 L 138 202 L 136 184 L 136 166
                L 138 150 L 142 134 Z
              "
              fill="url(#kazFill)"
              stroke="rgba(255,200,60,0.50)"
              strokeWidth="1.5"
              filter="url(#mapGlow)"
            />

            {/* Каспийское море (западный выступ убран из контура) */}
            <ellipse cx="112" cy="196" rx="20" ry="44"
              fill="rgba(60,120,200,0.25)" stroke="rgba(80,150,220,0.35)" strokeWidth="1"/>
            <text x="90" y="200" fontSize="8" fill="rgba(100,160,255,0.50)" fontFamily="sans-serif">Каспий</text>

            {/* Аральское море */}
            <ellipse cx="220" cy="252" rx="28" ry="18"
              fill="rgba(60,120,200,0.20)" stroke="rgba(80,150,220,0.30)" strokeWidth="1"/>
            <text x="204" y="258" fontSize="7" fill="rgba(100,160,255,0.45)" fontFamily="sans-serif">Арал</text>

            {/* Балхаш */}
            <path d="M 494 304 Q 520 292 552 296 Q 568 304 558 316 Q 534 322 508 318 Q 494 312 494 304 Z"
              fill="rgba(60,120,200,0.22)" stroke="rgba(80,150,220,0.35)" strokeWidth="1"/>
            <text x="506" y="312" fontSize="7" fill="rgba(100,160,255,0.45)" fontFamily="sans-serif">Балхаш</text>

            {/* Города — метки */}
            {/* Алматы */}
            <circle cx="534" cy="370" r="5" fill="rgba(255,200,60,0.25)" filter="url(#mapGlow)"/>
            <circle cx="534" cy="370" r="2" fill="rgba(255,220,100,0.70)"/>
            <text x="542" y="368" fontSize="9" fill="rgba(255,220,100,0.65)" fontFamily="sans-serif">Алматы</text>

            {/* Астана */}
            <circle cx="424" cy="178" r="5" fill="rgba(255,200,60,0.25)" filter="url(#mapGlow)"/>
            <circle cx="424" cy="178" r="2" fill="rgba(255,220,100,0.70)"/>
            <text x="432" y="176" fontSize="9" fill="rgba(255,220,100,0.65)" fontFamily="sans-serif">Астана</text>

            {/* Шымкент */}
            <circle cx="396" cy="408" r="3" fill="rgba(255,200,60,0.20)"/>
            <text x="402" y="406" fontSize="8" fill="rgba(255,220,100,0.50)" fontFamily="sans-serif">Шымкент</text>

            {/* Актобе */}
            <circle cx="236" cy="200" r="3" fill="rgba(255,200,60,0.18)"/>
            <text x="242" y="198" fontSize="8" fill="rgba(255,220,100,0.45)" fontFamily="sans-serif">Актобе</text>

            {/* Атырау */}
            <circle cx="160" cy="248" r="3" fill="rgba(255,200,60,0.18)"/>
            <text x="166" y="246" fontSize="8" fill="rgba(255,220,100,0.45)" fontFamily="sans-serif">Атырау</text>

            {/* Сетка — тонкая */}
            {[100,200,300,400].map(y => (
              <line key={`h${y}`} x1="100" y1={y} x2="700" y2={y}
                stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="4 8"/>
            ))}
            {[150,250,350,450,550,650].map(x => (
              <line key={`v${x}`} x1={x} y1="50" x2={x} y2="450"
                stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="4 8"/>
            ))}
          </svg>

          {/* ── Тонкое свечение по краям ── */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.4) 100%)',
          }} />

          {/* Маркеры центров */}
          {filtered.map(center => (
            <MapDot
              key={center.id}
              center={center}
              isActive={activeId === center.id}
              onClick={() => setActiveId(activeId === center.id ? null : center.id)}
              style={{
                left: CENTER_POSITIONS[center.id]?.x ?? '50%',
                top: CENTER_POSITIONS[center.id]?.y ?? '50%',
              }}
            />
          ))}

          {/* Легенда */}
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            background: 'rgba(5,10,20,0.85)',
            backdropFilter: 'blur(12px)',
            borderRadius: '14px',
            padding: '10px 14px',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            {Object.entries(TYPE_ICONS).map(([type, icon]) => (
              <div key={type} style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                marginBottom: '5px', fontSize: '11px',
              }}>
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: TYPE_COLORS[type as Center['type']],
                  boxShadow: `0 0 6px ${TYPE_COLORS[type as Center['type']]}`,
                  flexShrink: 0,
                }} />
                <span style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {icon} {isKz ? TYPE_LABELS_KZ[type as Center['type']] : TYPE_LABELS_RU[type as Center['type']]}
                </span>
              </div>
            ))}
          </div>

          {/* Карточка выбранного центра */}
          {activeCenter && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
              width: '90%',
              maxWidth: '420px',
            }}>
              <CenterCard
                center={activeCenter}
                locale={locale}
                onClose={() => setActiveId(null)}
              />
            </div>
          )}
        </div>

        {/* Список справа (десктоп) */}
        <div style={{
          width: '280px',
          flexShrink: 0,
          overflowY: 'auto',
          borderLeft: '1px solid rgba(255,200,60,0.1)',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          {filtered.map(center => {
            const isKzL = locale === 'kz'
            return (
              <button
                key={center.id}
                onClick={() => setActiveId(activeId === center.id ? null : center.id)}
                style={{
                  background: activeId === center.id
                    ? 'rgba(255,200,60,0.12)'
                    : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${activeId === center.id ? 'rgba(255,200,60,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '12px',
                  padding: '12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.18s',
                  color: 'white',
                }}
              >
                <div style={{ fontSize: '11px', color: 'rgba(255,200,80,0.7)', marginBottom: '4px' }}>
                  {TYPE_ICONS[center.type]} {isKzL ? center.cityKz : center.city}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px', lineHeight: 1.3 }}>
                  {isKzL ? center.nameKz : center.name}
                </div>
                <TulparRating value={center.rating} count={center.reviews} />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}