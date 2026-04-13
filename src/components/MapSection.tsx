'use client'
import { useState } from 'react'
import SectionShell from '@/components/SectionShell'

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
  licensed: boolean
  trustScore: number
}

const CENTERS: Center[] = [
  { id: 'c1', name: 'Amanat Rehab', nameKz: 'Amanat Rehab', type: 'rehab', city: 'Алматы', cityKz: 'Алматы', address: 'мкр. Астана, 21', rating: 4.9, reviews: 149, tags: ['Алкоголь', 'Наркотики', 'Игромания', 'Анонимно'], tagsKz: ['Алкоголь', 'Есірткі', 'Ойын', 'Анонимді'], description: 'Лицензированный центр реабилитации. 3 филиала в Алматы. Бесплатные консультации, анонимно, на казахском и русском. Индивидуальные программы, поддержка семьи.', descriptionKz: 'Лицензияланған оңалту орталығы. Алматыда 3 филиал. Тегін кеңестер, анонимді.', lat: 43.2220, lng: 76.8512, price: 'Бесплатная консультация', priceKz: 'Тегін кеңес', phone: '+7 701 223 75 57', website: 'amanatcenter.kz', hours: 'Круглосуточно', anonymous: true, free: true, licensed: true, trustScore: 97 },
  { id: 'c2', name: 'Hayat Clinic', nameKz: 'Hayat Clinic', type: 'narcology', city: 'Алматы', cityKz: 'Алматы', address: 'ул. Кабанбай Батыра, 172', rating: 4.7, reviews: 98, tags: ['Детокс', 'Реабилитация', 'Алкоголь', '24/7'], tagsKz: ['Детокс', 'Оңалту', 'Алкоголь', '24/7'], description: 'Частный наркологический диспансер. Индивидуальная программа для каждого пациента. Детоксикация, реабилитация, социальная адаптация.', descriptionKz: 'Жеке наркологиялық диспансер. Əр пациентке жеке бағдарлама.', lat: 43.2567, lng: 76.9286, price: 'Консультация бесплатно', priceKz: 'Кеңес тегін', phone: '+7 727 221 01 22', website: 'hayatmed.kz', hours: 'Круглосуточно', anonymous: true, free: false, licensed: true, trustScore: 91 },
  { id: 'c3', name: 'Орион Рехаб', nameKz: 'Орион Рехаб', type: 'narcology', city: 'Алматы', cityKz: 'Алматы', address: 'мкр. Астана, д. 22', rating: 4.6, reviews: 73, tags: ['Анонимно', 'Без учёта', 'Алкоголь', 'Игромания'], tagsKz: ['Анонимді', 'Есепсіз', 'Алкоголь', 'Ойын'], description: 'Анонимное лечение без постановки на учёт. Программы 12 шагов, Day Top, Миннесотская модель.', descriptionKz: 'Есепке алусыз анонимді ем. 12 қадым, Day Top бағдарламалары.', lat: 43.2198, lng: 76.8634, price: 'По запросу', priceKz: 'Сұранымен', phone: '+7 705 235 98 47', website: 'narcologiya.kz', hours: 'Круглосуточно', anonymous: true, free: false, licensed: true, trustScore: 88 },
  { id: 'c4', name: 'Рекавери Алматы', nameKz: 'Рекавери Алматы', type: 'rehab', city: 'Алматы', cityKz: 'Алматы', address: 'ул. Оспанова, 162', rating: 4.5, reviews: 112, tags: ['12 шагов', 'Группы', 'Семья'], tagsKz: ['12 қадым', 'Топтар', 'Отбасы'], description: 'Международная сеть (20 филиалов в 5 странах). Авторская программа «7 навыков». Групповая и индивидуальная терапия.', descriptionKz: 'Халықаралық желі (5 елде 20 филиал). «7 дағды» авторлық бағдарламасы.', lat: 43.2341, lng: 76.9012, price: 'Бесплатная консультация', priceKz: 'Тегін кеңес', phone: '+7 727 000 00 00', website: 'recovery-center.kz', hours: 'Пн–Вс 9:00–21:00', anonymous: true, free: true, licensed: true, trustScore: 85 },
  { id: 'c5', name: 'MedBrat', nameKz: 'MedBrat', type: 'narcology', city: 'Алматы', cityKz: 'Алматы', address: 'Алматы', rating: 4.4, reviews: 61, tags: ['Вывод из запоя', 'Кодировка', 'На дому'], tagsKz: ['Ішкіліктен шығу', 'Кодтау', 'Үйге шығу'], description: 'Анонимная наркологическая помощь. Вывод из запоя на дому и в клинике. Кодировки, детоксикация.', descriptionKz: 'Анонимді наркологиялық көмек. Үйде және клиникада ішкіліктен шығу.', lat: 43.2456, lng: 76.8901, price: 'Скидка 10% онлайн', priceKz: 'Онлайн 10% жеңілдік', phone: '+7 727 000 00 01', website: 'medbrat.kz', hours: 'Круглосуточно', anonymous: true, free: false, licensed: false, trustScore: 79 },
  { id: 'c6', name: 'Клиника д-ра Шурова', nameKz: 'Шуров д-р клиникасы', type: 'psych', city: 'Алматы', cityKz: 'Алматы', address: 'Алматы', rating: 4.3, reviews: 44, tags: ['Психиатрия', 'Нарколог', 'Онлайн'], tagsKz: ['Психиатрия', 'Нарколог', 'Онлайн'], description: 'Частная психиатрическая клиника. Нарколог-психиатр, индивидуальные программы. Онлайн-консультации.', descriptionKz: 'Жеке психиатриялық клиника. Нарколог-психиатр, жеке бағдарламалар.', lat: 43.2389, lng: 76.9134, price: 'от 13 144 ₸', priceKz: '13 144 ₸-ден', phone: '+7 717 269 68 10', hours: 'Пн–Пт 9:00–18:00', anonymous: true, free: false, licensed: true, trustScore: 82 },
  { id: 'c7', name: 'Amanat Астана', nameKz: 'Amanat Астана', type: 'rehab', city: 'Астана', cityKz: 'Астана', address: 'ул. Аксу-Аюлы, 13', rating: 4.8, reviews: 87, tags: ['Алкоголь', 'Наркотики', 'Анонимно'], tagsKz: ['Алкоголь', 'Есірткі', 'Анонимді'], description: 'Филиал Amanat в Астане. Лицензия Минздрава РК. Круглосуточная горячая линия.', descriptionKz: 'Астанадағы Amanat филиалы. ҚР Денсаулық сақтау министрлігінің лицензиясы.', lat: 51.1605, lng: 71.4704, price: 'Бесплатная консультация', priceKz: 'Тегін кеңес', phone: '+7 701 223 75 57', website: 'amanatcenter.kz', hours: 'Круглосуточно', anonymous: true, free: true, licensed: true, trustScore: 95 },
  { id: 'c8', name: 'Ренессанс Астана', nameKz: 'Ренессанс Астана', type: 'rehab', city: 'Астана', cityKz: 'Астана', address: 'пер. Шашу, 15', rating: 4.6, reviews: 93, tags: ['Реабилитация', 'Анонимно', 'Игромания'], tagsKz: ['Оңалту', 'Анонимді', 'Ойын'], description: 'Квалифицированный реабилитационный центр. Постреабилитационные консультации бесплатно.', descriptionKz: 'Білікті оңалту орталығы. Оңалтудан кейінгі кеңестер тегін.', lat: 51.1801, lng: 71.4460, price: 'По запросу', priceKz: 'Сұранымен', phone: '+7 717 200 00 00', website: 'renessans-astana.kz', hours: 'Пн–Вс 9:00–20:00', anonymous: true, free: false, licensed: true, trustScore: 87 },
  { id: 'c9', name: 'Рекавери Астана', nameKz: 'Рекавери Астана', type: 'rehab', city: 'Астана', cityKz: 'Астана', address: 'ул. Илияс Есенберлин, 38', rating: 4.5, reviews: 56, tags: ['12 шагов', 'Группы', 'Семья'], tagsKz: ['12 қадым', 'Топтар', 'Отбасы'], description: 'Международная программа Recovery в Астане. Групповые сессии, индивидуальная терапия.', descriptionKz: 'Астанадағы халықаралық Recovery бағдарламасы.', lat: 51.1698, lng: 71.4289, price: 'Бесплатная консультация', priceKz: 'Тегін кеңес', phone: '+7 717 000 00 00', website: 'recovery-center.kz', hours: 'Пн–Вс 9:00–21:00', anonymous: true, free: true, licensed: true, trustScore: 83 },
  { id: 'c10', name: 'Эмирмед Шымкент', nameKz: 'Эмирмед Шымкент', type: 'narcology', city: 'Шымкент', cityKz: 'Шымкент', address: 'ул. Рашидова, 36/15', rating: 4.4, reviews: 48, tags: ['Наркология', '24/7', 'Анонимно'], tagsKz: ['Наркология', '24/7', 'Анонимді'], description: 'Сеть клиник №1 в Казахстане. Психологическая помощь при зависимостях в Шымкенте.', descriptionKz: 'Қазақстандағы №1 клиникалар желісі.', lat: 42.3417, lng: 69.5901, price: 'По запросу', priceKz: 'Сұранымен', phone: '+7 725 200 00 00', hours: 'Круглосуточно', anonymous: true, free: false, licensed: true, trustScore: 80 },
  { id: 'c11', name: 'Свободные люди', nameKz: 'Бос адамдар', type: 'support', city: 'Шымкент', cityKz: 'Шымкент', address: 'Шымкент', rating: 4.7, reviews: 34, tags: ['Группы поддержки', 'Психолог'], tagsKz: ['Қолдау топтары', 'Психолог'], description: 'Центр реабилитации. Группы поддержки, психологическое консультирование.', descriptionKz: 'Оңалту орталығы. Қолдау топтары, психологиялық кеңес.', lat: 42.3201, lng: 69.6134, price: 'По запросу', priceKz: 'Сұранымен', phone: '+7 725 000 00 01', hours: 'Пн–Пт 9:00–18:00', anonymous: true, free: false, licensed: false, trustScore: 76 },
  { id: 'c12', name: 'РНПЦМСО МЗ РК', nameKz: 'РНПЦМСО ДМ ҚР', type: 'narcology', city: 'Алматы', cityKz: 'Алматы', address: 'ул. Горного Гиганта, 180', rating: 3.8, reviews: 215, tags: ['Бесплатно', 'Государственный', 'ГОБМП'], tagsKz: ['Тегін', 'Мемлекеттік', 'МББКК'], description: 'Республиканский научно-практический центр. Бесплатная помощь по ГОБМП.', descriptionKz: 'Республикалық ғылыми-практикалық орталық. МББКК бойынша тегін көмек.', lat: 43.2789, lng: 76.8456, price: 'Бесплатно (ГОБМП)', priceKz: 'Тегін (МББКК)', phone: '109', hours: 'Круглосуточно', anonymous: false, free: true, licensed: true, trustScore: 72 },
]

const TYPE_COLORS: Record<Center['type'], string> = { rehab: '#6fcf8e', narcology: '#ffd060', psych: '#a78bfa', support: '#60c5fa' }
const TYPE_LABELS_RU: Record<Center['type'], string> = { rehab: 'Реабилитация', narcology: 'Наркология', psych: 'Психиатрия', support: 'Поддержка' }
const TYPE_LABELS_KZ: Record<Center['type'], string> = { rehab: 'Оңалту', narcology: 'Наркология', psych: 'Психиатрия', support: 'Қолдау' }
const TYPE_ICONS: Record<Center['type'], string> = { rehab: '🏥', narcology: '💊', psych: '🧠', support: '🤝' }

function getTrustColor(score: number) {
  if (score >= 90) return '#6fcf8e'
  if (score >= 80) return '#ffd060'
  if (score >= 70) return '#f4a261'
  return '#f87171'
}

function getTrustLabel(score: number, isKz: boolean) {
  if (score >= 90) return isKz ? 'Өте сенімді' : 'Очень надёжный'
  if (score >= 80) return isKz ? 'Сенімді' : 'Надёжный'
  if (score >= 70) return isKz ? 'Орташа' : 'Средний'
  return isKz ? 'Тексеріңіз' : 'Проверьте'
}

const CITIES = ['Алматы', 'Астана', 'Шымкент']

export default function MapSection({ locale = 'ru', onBack }: { locale?: 'ru' | 'kz'; onBack?: () => void }) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')
  const [view, setView] = useState<'list' | 'city'>('list')
  const [search, setSearch] = useState('')
  const isKz = locale === 'kz'

  const filtered = CENTERS.filter(c => {
    const matchFilter = filter === 'all' || c.type === filter
    const matchSearch = search === '' || (isKz ? c.nameKz : c.name).toLowerCase().includes(search.toLowerCase()) || c.city.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const activeCenter = CENTERS.find(c => c.id === activeId)

  const filters = [
    { id: 'all', ru: 'Все', kz: 'Барлығы' },
    { id: 'rehab', ru: 'Реабилитация', kz: 'Оңалту' },
    { id: 'narcology', ru: 'Наркология', kz: 'Наркология' },
    { id: 'psych', ru: 'Психиатрия', kz: 'Психиатрия' },
    { id: 'support', ru: 'Поддержка', kz: 'Қолдау' },
  ]

  return (
    <SectionShell locale={locale} title={isKz ? 'Көмек орталықтары' : 'Центры помощи'} icon="🗺" onBack={onBack} accentColor="rgba(96,197,250,0.6)">
      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .ccard:hover { border-color: rgba(255,200,60,0.30) !important; background: rgba(255,255,255,0.055) !important; }
        .ccard { transition: all 0.18s ease; cursor: pointer; }
        .fbtn:hover { opacity: 1 !important; }
      `}</style>

      <div style={{ maxWidth: '700px', margin: '0 auto', width: '100%', paddingBottom: '80px' }}>

        {/* SOS — всегда сверху */}
        <div style={{ margin: '12px 16px', padding: '14px 18px', borderRadius: '18px', background: 'rgba(248,113,113,0.10)', border: '1px solid rgba(248,113,113,0.25)', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontSize: '24px' }}>🆘</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#f87171', marginBottom: '2px' }}>
              {isKz ? 'Шұғыл көмек керек пе?' : 'Нужна срочная помощь?'}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.40)' }}>
              {isKz ? 'Дереу қоңырау шалыңыз' : 'Позвоните прямо сейчас'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <a href="tel:150" style={{ padding: '8px 16px', borderRadius: '12px', background: 'rgba(248,113,113,0.18)', border: '1px solid rgba(248,113,113,0.35)', color: '#f87171', fontSize: '14px', fontWeight: 800, textDecoration: 'none' }}>150</a>
            <a href="tel:111" style={{ padding: '8px 16px', borderRadius: '12px', background: 'rgba(248,113,113,0.18)', border: '1px solid rgba(248,113,113,0.35)', color: '#f87171', fontSize: '14px', fontWeight: 800, textDecoration: 'none' }}>111</a>
          </div>
        </div>

        {/* Поиск */}
        <div style={{ padding: '0 16px 10px' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={isKz ? '🔍 Орталық немесе қала...' : '🔍 Поиск центра или города...'}
            style={{ width: '100%', padding: '11px 16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
          />
        </div>

        {/* Фильтры */}
        <div style={{ display: 'flex', gap: '6px', padding: '0 16px 10px', overflowX: 'auto' }}>
          {filters.map(f => (
            <button key={f.id} className="fbtn" onClick={() => setFilter(f.id)}
              style={{ padding: '6px 14px', borderRadius: '16px', border: `1px solid ${filter === f.id ? 'rgba(255,200,60,0.55)' : 'rgba(255,255,255,0.10)'}`, background: filter === f.id ? 'rgba(255,200,60,0.15)' : 'rgba(255,255,255,0.04)', color: filter === f.id ? '#ffd060' : 'rgba(255,255,255,0.50)', fontSize: '12px', fontWeight: filter === f.id ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {isKz ? f.kz : f.ru}
            </button>
          ))}
        </div>

        {/* Переключатель */}
        <div style={{ display: 'flex', gap: '8px', padding: '0 16px 12px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.30)', flex: 1 }}>
            {filtered.length} {isKz ? 'орталық табылды' : 'центров найдено'}
          </span>
          <button onClick={() => setView('list')} style={{ padding: '5px 12px', borderRadius: '10px', border: `1px solid ${view === 'list' ? 'rgba(96,197,250,0.5)' : 'rgba(255,255,255,0.08)'}`, background: view === 'list' ? 'rgba(96,197,250,0.12)' : 'transparent', color: view === 'list' ? '#60c5fa' : 'rgba(255,255,255,0.35)', fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit' }}>
            ☰ {isKz ? 'Тізім' : 'Список'}
          </button>
          <button onClick={() => setView('city')} style={{ padding: '5px 12px', borderRadius: '10px', border: `1px solid ${view === 'city' ? 'rgba(96,197,250,0.5)' : 'rgba(255,255,255,0.08)'}`, background: view === 'city' ? 'rgba(96,197,250,0.12)' : 'transparent', color: view === 'city' ? '#60c5fa' : 'rgba(255,255,255,0.35)', fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit' }}>
            📍 {isKz ? 'Қалалар' : 'По городам'}
          </button>
        </div>

        {/* СПИСОК */}
        {view === 'list' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '0 16px' }}>
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.30)', fontSize: '14px' }}>
                {isKz ? 'Ештеңе табылмады' : 'Ничего не найдено'}
              </div>
            )}
            {filtered.map(center => {
              const isActive = activeId === center.id
              const trustColor = getTrustColor(center.trustScore)
              return (
                <div key={center.id} className="ccard"
                  onClick={() => setActiveId(isActive ? null : center.id)}
                  style={{ borderRadius: '20px', border: `1px solid ${isActive ? TYPE_COLORS[center.type] + '55' : 'rgba(255,255,255,0.08)'}`, background: isActive ? `${TYPE_COLORS[center.type]}08` : 'rgba(255,255,255,0.03)', overflow: 'hidden', animation: 'slideUp 0.25s ease' }}>

                  <div style={{ padding: '16px' }}>
                    {/* Верх */}
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: `${TYPE_COLORS[center.type]}15`, border: `1px solid ${TYPE_COLORS[center.type]}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                        {TYPE_ICONS[center.type]}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: 'rgba(255,255,255,0.93)', marginBottom: '3px', lineHeight: 1.2 }}>
                          {isKz ? center.nameKz : center.name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>📍</span>
                          <span>{isKz ? center.cityKz : center.city}{center.address !== center.city ? ` · ${center.address}` : ''}</span>
                        </div>
                        <div style={{ fontSize: '10px', color: TYPE_COLORS[center.type] + '90', marginTop: '3px' }}>
                          {isKz ? TYPE_LABELS_KZ[center.type] : TYPE_LABELS_RU[center.type]}
                        </div>
                      </div>
                      <div style={{ flexShrink: 0, textAlign: 'center', background: `${trustColor}12`, border: `1px solid ${trustColor}30`, borderRadius: '12px', padding: '6px 10px' }}>
                        <div style={{ fontSize: '20px', fontWeight: 900, color: trustColor, lineHeight: 1 }}>{center.trustScore}</div>
                        <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.10em', textTransform: 'uppercase', marginTop: '2px' }}>TRUST</div>
                      </div>
                    </div>

                    {/* Trust бар */}
                    <div style={{ marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ fontSize: '11px', color: trustColor, fontWeight: 700 }}>
                          {getTrustLabel(center.trustScore, isKz)}
                        </span>
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                          {center.licensed && <span style={{ fontSize: '9px', padding: '2px 7px', borderRadius: '8px', background: 'rgba(111,207,142,0.14)', color: '#6fcf8e', fontWeight: 700 }}>✓ {isKz ? 'Лицензия' : 'Лицензия'}</span>}
                          {center.anonymous && <span style={{ fontSize: '9px', padding: '2px 7px', borderRadius: '8px', background: 'rgba(96,197,250,0.12)', color: '#60c5fa', fontWeight: 700 }}>🔒 {isKz ? 'Анонимді' : 'Анонимно'}</span>}
                          {center.free && <span style={{ fontSize: '9px', padding: '2px 7px', borderRadius: '8px', background: 'rgba(167,139,250,0.12)', color: '#a78bfa', fontWeight: 700 }}>{isKz ? 'Тегін' : 'Бесплатно'}</span>}
                        </div>
                      </div>
                      <div style={{ height: '3px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)' }}>
                        <div style={{ height: '100%', width: `${center.trustScore}%`, background: `linear-gradient(90deg, ${trustColor}70, ${trustColor})`, borderRadius: '2px' }} />
                      </div>
                    </div>

                    {/* Рейтинг */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '10px' }}>
                      {[1,2,3,4,5].map(i => (
                        <span key={i} style={{ fontSize: '13px', opacity: i <= Math.round(center.rating) ? 1 : 0.18 }}>🐎</span>
                      ))}
                      <span style={{ fontSize: '11px', color: 'rgba(255,220,140,0.85)', marginLeft: '5px' }}>
                        {center.rating.toFixed(1)} ({center.reviews} {isKz ? 'пікір' : 'отзывов'})
                      </span>
                      {center.hours && (
                        <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'rgba(255,255,255,0.30)' }}>
                          🕐 {center.hours}
                        </span>
                      )}
                    </div>

                    {/* Теги */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {(isKz ? center.tagsKz : center.tags).map((tag, i) => (
                        <span key={i} style={{ fontSize: '10px', padding: '2px 9px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.40)', border: '1px solid rgba(255,255,255,0.07)' }}>{tag}</span>
                      ))}
                    </div>
                  </div>

                  {/* Раскрытая часть */}
                  {isActive && (
                    <div style={{ padding: '0 16px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px', animation: 'slideUp 0.2s ease' }}>
                      <p style={{ margin: '0 0 14px', fontSize: '13px', color: 'rgba(255,255,255,0.62)', lineHeight: 1.65 }}>
                        {isKz ? center.descriptionKz : center.description}
                      </p>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.40)', display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <span>💰</span><span>{isKz ? center.priceKz : center.price}</span>
                        </div>
                        {center.website && (
                          <div style={{ fontSize: '12px', color: 'rgba(96,197,250,0.65)', display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <span>🌐</span><span>{center.website}</span>
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {center.phone && (
                          <a href={`tel:${center.phone}`}
                            style={{ flex: 1, padding: '12px', borderRadius: '14px', background: 'rgba(111,207,142,0.13)', border: '1px solid rgba(111,207,142,0.28)', color: '#6fcf8e', fontSize: '13px', fontWeight: 700, textDecoration: 'none', textAlign: 'center', display: 'block' }}>
                            📞 {center.phone}
                          </a>
                        )}
                        <a href={`https://www.google.com/maps?q=${center.lat},${center.lng}`} target="_blank" rel="noreferrer"
                          style={{ flex: 1, padding: '12px', borderRadius: '14px', background: 'rgba(255,200,60,0.12)', border: '1px solid rgba(255,200,60,0.28)', color: '#ffd060', fontSize: '13px', fontWeight: 700, textDecoration: 'none', textAlign: 'center', display: 'block' }}>
                          🗺 {isKz ? 'Маршрут' : 'Маршрут'}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* ПО ГОРОДАМ */}
        {view === 'city' && (
          <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {CITIES.map(city => {
              const cityCenters = filtered.filter(c => c.city === city)
              if (cityCenters.length === 0) return null
              return (
                <div key={city}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,200,60,0.75)', marginBottom: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>📍</span>
                    <span>{city}</span>
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
                      — {cityCenters.length} {isKz ? 'орталық' : 'центров'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {cityCenters.sort((a, b) => b.trustScore - a.trustScore).map(c => (
                      <button key={c.id}
                        onClick={() => { setActiveId(c.id); setView('list') }}
                        style={{ padding: '14px 16px', borderRadius: '18px', border: `1px solid ${TYPE_COLORS[c.type]}28`, background: `${TYPE_COLORS[c.type]}06`, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left', transition: 'all 0.18s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = `${TYPE_COLORS[c.type]}14`; e.currentTarget.style.borderColor = `${TYPE_COLORS[c.type]}50` }}
                        onMouseLeave={e => { e.currentTarget.style.background = `${TYPE_COLORS[c.type]}06`; e.currentTarget.style.borderColor = `${TYPE_COLORS[c.type]}28` }}
                      >
                        <span style={{ fontSize: '22px', flexShrink: 0 }}>{TYPE_ICONS[c.type]}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.88)', marginBottom: '3px' }}>
                            {isKz ? c.nameKz : c.name}
                          </div>
                          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.32)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span>{isKz ? TYPE_LABELS_KZ[c.type] : TYPE_LABELS_RU[c.type]}</span>
                            {c.free && <span style={{ color: '#a78bfa' }}>· {isKz ? 'Тегін' : 'Бесплатно'}</span>}
                            {c.anonymous && <span style={{ color: '#60c5fa' }}>· {isKz ? 'Анонимді' : 'Анонимно'}</span>}
                          </div>
                        </div>
                        <div style={{ flexShrink: 0, textAlign: 'center' }}>
                          <div style={{ fontSize: '18px', fontWeight: 900, color: getTrustColor(c.trustScore) }}>{c.trustScore}</div>
                          <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>trust</div>
                        </div>
                        <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.20)', flexShrink: 0 }}>›</span>
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </SectionShell>
  )
}