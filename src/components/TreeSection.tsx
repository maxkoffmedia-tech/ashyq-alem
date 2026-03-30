'use client'

import { useState, useEffect } from 'react'
import SectionShell from '@/components/SectionShell'
import { useDayCounter } from '@/hooks/useDayCounter'
import type { UserProfile } from '@/hooks/useAuth'
import type { Locale } from '@/i18n/translations'

// ─── Типы ────────────────────────────────────────────────────────────────────

type BranchId = 'sleep' | 'water' | 'breath' | 'move' | 'calm'

interface BranchData {
  id: BranchId
  emoji: string
  labelRu: string
  labelKz: string
  descRu: string
  descKz: string
  unit: string
  unitKz: string
  target: number       // целевое значение в день
  color: string
  // Для особых типов
  inputType: 'number' | 'boolean' | 'range'
  min?: number
  max?: number
}

interface DayRecord {
  date: string   // YYYY-MM-DD
  values: Record<BranchId, number>   // 0..target
}

// ─── Конфиг веток ────────────────────────────────────────────────────────────

const BRANCHES: BranchData[] = [
  {
    id: 'sleep',
    emoji: '🌙',
    labelRu: 'Сон',
    labelKz: 'Ұйқы',
    descRu: 'Часов сна этой ночью',
    descKz: 'Бүгін түн ұйқы сағаты',
    unit: 'ч',
    unitKz: 'сағ',
    target: 8,
    color: '#a78bfa',
    inputType: 'range',
    min: 0,
    max: 12,
  },
  {
    id: 'water',
    emoji: '💧',
    labelRu: 'Вода',
    labelKz: 'Су',
    descRu: 'Стаканов воды сегодня',
    descKz: 'Бүгін ішкен су (стақан)',
    unit: 'ст.',
    unitKz: 'ст.',
    target: 8,
    color: '#60c5fa',
    inputType: 'range',
    min: 0,
    max: 12,
  },
  {
    id: 'breath',
    emoji: '🍃',
    labelRu: 'Дыхание',
    labelKz: 'Тыныс',
    descRu: 'Минут дыхательной практики',
    descKz: 'Тыныс жаттығуы (мин)',
    unit: 'мин',
    unitKz: 'мин',
    target: 10,
    color: '#6fcf8e',
    inputType: 'range',
    min: 0,
    max: 30,
  },
  {
    id: 'move',
    emoji: '🚶',
    labelRu: 'Движение',
    labelKz: 'Қозғалыс',
    descRu: 'Минут ходьбы или активности',
    descKz: 'Серуен немесе белсенділік (мин)',
    unit: 'мин',
    unitKz: 'мин',
    target: 30,
    color: '#ffd060',
    inputType: 'range',
    min: 0,
    max: 120,
  },
  {
    id: 'calm',
    emoji: '🕊',
    labelRu: 'Спокойствие',
    labelKz: 'Тыныштық',
    descRu: 'Минут без телефона / в тишине',
    descKz: 'Телефонсыз / тыныш уақыт (мин)',
    unit: 'мин',
    unitKz: 'мин',
    target: 15,
    color: '#f4a261',
    inputType: 'range',
    min: 0,
    max: 60,
  },
]

const TREE_KEY = 'ashyq_tree'

function todayStr() { return new Date().toISOString().slice(0, 10) }

function loadRecords(): DayRecord[] {
  try { return JSON.parse(localStorage.getItem(TREE_KEY) || '[]') }
  catch { return [] }
}

function saveRecords(r: DayRecord[]) {
  localStorage.setItem(TREE_KEY, JSON.stringify(r))
}

function emptyValues(): Record<BranchId, number> {
  return { sleep: 0, water: 0, breath: 0, move: 0, calm: 0 }
}

// Процент выполнения дня (0..1)
function dayScore(values: Record<BranchId, number>): number {
  const total = BRANCHES.reduce((s, b) => s + Math.min(values[b.id], b.target) / b.target, 0)
  return total / BRANCHES.length
}

// Количество зелёных дней подряд
function calcStreak(records: DayRecord[]): number {
  let streak = 0
  const today = todayStr()
  for (let i = 0; i < 30; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const ds = d.toISOString().slice(0, 10)
    if (ds === today) continue  // сегодня не считаем в стрик
    const rec = records.find(r => r.date === ds)
    if (rec && dayScore(rec.values) >= 0.5) streak++
    else break
  }
  return streak
}

// ─── Визуальное дерево (SVG) ─────────────────────────────────────────────────

function TreeVisual({ score, streak, color }: {
  score: number   // 0..1 — полнота сегодняшнего дня
  streak: number  // дни подряд
  color: string
}) {
  // Листья появляются по мере заполнения веток
  const leafCount = Math.round(score * 20)
  const trunkOpacity = 0.4 + score * 0.6
  const glowSize = 20 + score * 40

  return (
    <svg
      viewBox="0 0 200 220"
      style={{ width: '100%', maxWidth: '220px', display: 'block' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Свечение под деревом */}
      <ellipse
        cx="100" cy="200"
        rx={glowSize} ry="8"
        fill={color}
        opacity={0.12 + score * 0.13}
      />

      {/* Корни */}
      <path d="M100 180 Q85 188 75 195" stroke={color} strokeWidth="2"
            fill="none" opacity={0.3} strokeLinecap="round"/>
      <path d="M100 180 Q115 188 125 195" stroke={color} strokeWidth="2"
            fill="none" opacity={0.3} strokeLinecap="round"/>
      <path d="M100 180 Q95 192 90 200" stroke={color} strokeWidth="1.5"
            fill="none" opacity={0.2} strokeLinecap="round"/>

      {/* Ствол */}
      <path
        d="M100 180 Q98 155 100 130 Q102 105 100 80"
        stroke={color} strokeWidth="5"
        fill="none" opacity={trunkOpacity}
        strokeLinecap="round"
      />

      {/* Ветки — растут по мере прогресса */}
      {score > 0.1 && (
        <path d="M100 150 Q80 140 65 130" stroke={color} strokeWidth="2.5"
              fill="none" opacity={Math.min(score * 3, 0.8)} strokeLinecap="round"/>
      )}
      {score > 0.1 && (
        <path d="M100 150 Q120 140 135 130" stroke={color} strokeWidth="2.5"
              fill="none" opacity={Math.min(score * 3, 0.8)} strokeLinecap="round"/>
      )}
      {score > 0.25 && (
        <path d="M100 125 Q78 115 62 108" stroke={color} strokeWidth="2"
              fill="none" opacity={Math.min(score * 2, 0.75)} strokeLinecap="round"/>
      )}
      {score > 0.25 && (
        <path d="M100 125 Q122 115 138 108" stroke={color} strokeWidth="2"
              fill="none" opacity={Math.min(score * 2, 0.75)} strokeLinecap="round"/>
      )}
      {score > 0.45 && (
        <path d="M100 100 Q82 90 70 82" stroke={color} strokeWidth="1.8"
              fill="none" opacity={Math.min(score * 1.8, 0.7)} strokeLinecap="round"/>
      )}
      {score > 0.45 && (
        <path d="M100 100 Q118 90 130 82" stroke={color} strokeWidth="1.8"
              fill="none" opacity={Math.min(score * 1.8, 0.7)} strokeLinecap="round"/>
      )}

      {/* Листья — случайно распределены, появляются постепенно */}
      {LEAF_POSITIONS.slice(0, leafCount).map((lp, i) => (
        <ellipse
          key={i}
          cx={lp.x} cy={lp.y}
          rx={lp.r} ry={lp.r * 0.7}
          fill={color}
          opacity={lp.a * (0.5 + score * 0.5)}
          transform={`rotate(${lp.rot}, ${lp.x}, ${lp.y})`}
        />
      ))}

      {/* Верхушка — цветок/точка */}
      {score > 0.6 && (
        <circle cx="100" cy="72" r={4 + score * 5}
                fill={color} opacity={score * 0.85}
                filter="url(#glow)"/>
      )}

      {/* Фильтр свечения */}
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Стрик — дни подряд */}
      {streak > 0 && (
        <text x="100" y="215" textAnchor="middle"
              fontSize="11" fill={color} opacity="0.75"
              fontFamily="system-ui, sans-serif">
          🔥 {streak} {streak === 1 ? 'день' : streak < 5 ? 'дня' : 'дней'} подряд
        </text>
      )}
    </svg>
  )
}

// Позиции листьев (заданы вручную для красивого распределения)
const LEAF_POSITIONS = [
  { x: 72, y: 128, r: 7, a: 0.7, rot: 30 },
  { x: 128, y: 125, r: 8, a: 0.65, rot: -25 },
  { x: 60, y: 105, r: 6, a: 0.6, rot: 45 },
  { x: 140, y: 103, r: 7, a: 0.65, rot: -40 },
  { x: 85, y: 112, r: 5, a: 0.5, rot: 15 },
  { x: 115, y: 110, r: 5, a: 0.55, rot: -20 },
  { x: 68, y: 85, r: 6, a: 0.6, rot: 35 },
  { x: 132, y: 83, r: 6, a: 0.6, rot: -30 },
  { x: 90, y: 88, r: 4.5, a: 0.5, rot: 20 },
  { x: 110, y: 87, r: 5, a: 0.5, rot: -15 },
  { x: 78, y: 70, r: 5.5, a: 0.55, rot: 40 },
  { x: 122, y: 68, r: 6, a: 0.55, rot: -35 },
  { x: 95, y: 72, r: 4, a: 0.45, rot: 10 },
  { x: 105, y: 70, r: 4.5, a: 0.5, rot: -10 },
  { x: 100, y: 82, r: 5, a: 0.6, rot: 0 },
  { x: 88, y: 60, r: 4, a: 0.45, rot: 25 },
  { x: 112, y: 58, r: 4.5, a: 0.50, rot: -25 },
  { x: 100, y: 62, r: 5, a: 0.55, rot: 5 },
  { x: 93, y: 50, r: 3.5, a: 0.40, rot: 15 },
  { x: 107, y: 48, r: 3.5, a: 0.40, rot: -15 },
]

// ─── Слайдер ветки ────────────────────────────────────────────────────────────

function BranchSlider({
  branch,
  value,
  onChange,
  isKz,
}: {
  branch: BranchData
  value: number
  onChange: (v: number) => void
  isKz: boolean
}) {
  const pct = Math.min(value / branch.target, 1)
  const label = isKz ? branch.labelKz : branch.labelRu
  const desc = isKz ? branch.descKz : branch.descRu
  const unit = isKz ? branch.unitKz : branch.unit
  const reached = value >= branch.target

  return (
    <div style={{
      padding: '14px 16px',
      borderRadius: '18px',
      background: reached
        ? `${branch.color}12`
        : 'rgba(255,255,255,0.04)',
      border: `1px solid ${reached ? branch.color + '40' : 'rgba(255,255,255,0.08)'}`,
      transition: 'all 0.3s ease',
    }}>
      {/* Заголовок ветки */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>{branch.emoji}</span>
          <div>
            <div style={{
              fontSize: '13px',
              fontWeight: 600,
              color: reached ? branch.color : 'rgba(255,255,255,0.85)',
              transition: 'color 0.3s',
            }}>
              {label} {reached && '✓'}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '1px' }}>
              {desc}
            </div>
          </div>
        </div>
        {/* Значение */}
        <div style={{
          fontSize: '18px',
          fontWeight: 700,
          color: reached ? branch.color : 'rgba(255,255,255,0.70)',
          fontVariantNumeric: 'tabular-nums',
          minWidth: '48px',
          textAlign: 'right',
          transition: 'color 0.3s',
        }}>
          {value}<span style={{ fontSize: '11px', opacity: 0.6, marginLeft: '2px' }}>{unit}</span>
        </div>
      </div>

      {/* Прогресс-бар */}
      <div style={{
        height: '4px',
        borderRadius: '2px',
        background: 'rgba(255,255,255,0.08)',
        marginBottom: '10px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${pct * 100}%`,
          background: `linear-gradient(90deg, ${branch.color}70, ${branch.color})`,
          borderRadius: '2px',
          transition: 'width 0.3s ease',
          boxShadow: reached ? `0 0 8px ${branch.color}80` : 'none',
        }} />
      </div>

      {/* Слайдер */}
      <div style={{ position: 'relative' }}>
        <style>{`
          .tree-slider-${branch.id}::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 20px; height: 20px;
            border-radius: 50%;
            background: ${branch.color};
            box-shadow: 0 0 8px ${branch.color}80;
            cursor: pointer;
            border: 2px solid rgba(255,255,255,0.3);
          }
          .tree-slider-${branch.id}::-moz-range-thumb {
            width: 20px; height: 20px;
            border-radius: 50%;
            background: ${branch.color};
            box-shadow: 0 0 8px ${branch.color}80;
            cursor: pointer;
            border: 2px solid rgba(255,255,255,0.3);
          }
          .tree-slider-${branch.id} {
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            height: 4px;
            border-radius: 2px;
            background: rgba(255,255,255,0.10);
            outline: none;
            cursor: pointer;
          }
        `}</style>
        <input
          type="range"
          className={`tree-slider-${branch.id}`}
          min={branch.min ?? 0}
          max={branch.max ?? branch.target}
          step={1}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
        />
        {/* Метки min/target */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '10px',
          color: 'rgba(255,255,255,0.20)',
          marginTop: '4px',
        }}>
          <span>0</span>
          <span style={{ color: branch.color + '80' }}>
            {isKz ? 'мақсат' : 'цель'}: {branch.target} {unit}
          </span>
          <span>{branch.max ?? branch.target}</span>
        </div>
      </div>
    </div>
  )
}

// ─── 7-дневный календарь ─────────────────────────────────────────────────────

function WeekCalendar({ records, isKz }: { records: DayRecord[]; isKz: boolean }) {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const ds = d.toISOString().slice(0, 10)
    const rec = records.find(r => r.date === ds)
    const score = rec ? dayScore(rec.values) : 0
    const isToday = i === 0
    const dayName = d.toLocaleDateString(isKz ? 'kk-KZ' : 'ru-RU', { weekday: 'short' })
    days.push({ ds, score, isToday, dayName, dayNum: d.getDate() })
  }

  return (
    <div>
      <div style={{
        fontSize: '11px',
        color: 'rgba(255,255,255,0.35)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        marginBottom: '10px',
      }}>
        {isKz ? '7 күн' : '7 дней'}
      </div>
      <div style={{ display: 'flex', gap: '6px' }}>
        {days.map(d => {
          const color = d.score > 0.7 ? '#6fcf8e'
            : d.score > 0.4 ? '#ffd060'
            : d.score > 0 ? '#f4a261'
            : 'rgba(255,255,255,0.08)'

          return (
            <div key={d.ds} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
              <div style={{
                fontSize: '9px',
                color: d.isToday ? 'white' : 'rgba(255,255,255,0.30)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}>
                {d.dayName}
              </div>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: d.score > 0 ? color + '25' : 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${d.isToday ? 'rgba(255,255,255,0.35)' : d.score > 0 ? color + '60' : 'rgba(255,255,255,0.07)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: d.isToday ? 700 : 400,
                color: d.score > 0 ? color : 'rgba(255,255,255,0.20)',
                boxShadow: d.isToday ? '0 0 12px rgba(255,255,255,0.15)' : 'none',
                transition: 'all 0.2s',
              }}>
                {d.score > 0.7 ? '✦' : d.dayNum}
              </div>
              {/* Мини-бар */}
              <div style={{
                width: '4px',
                height: '20px',
                borderRadius: '2px',
                background: 'rgba(255,255,255,0.06)',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: '100%',
                  height: `${d.score * 100}%`,
                  background: color,
                  borderRadius: '2px',
                  marginTop: `${(1 - d.score) * 100}%`,
                  transition: 'height 0.5s ease',
                }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}


// ─── НЕЙРО-ПАНЕЛЬ ────────────────────────────────────────────────────────────
// Реальная нейробиология восстановления. Не медицина — образование и мотивация.

interface Neurotransmitter {
  id: string
  name: string
  emoji: string
  color: string
  descRu: string
  descKz: string
  // Функция восстановления (0..1) от дней и привычек
  calcLevel: (days: number, habitScore: number) => number
  // Что происходит на разных этапах
  phases: Array<{
    fromDay: number
    toDay: number
    labelRu: string
    labelKz: string
    detailRu: string
    detailKz: string
  }>
}

const NEUROTRANSMITTERS: Neurotransmitter[] = [
  {
    id: 'dopamine',
    name: 'Дофамин',
    emoji: '⚡',
    color: '#ffd060',
    descRu: 'Мотивация · Удовольствие · Фокус',
    descKz: 'Мотивация · Ләззат · Назар',
    calcLevel: (days, habit) => {
      // Дофамин падает в первые дни, потом восстанавливается
      if (days < 3) return 0.15 + habit * 0.1
      if (days < 14) return 0.20 + (days / 14) * 0.35 + habit * 0.15
      if (days < 30) return 0.55 + (days - 14) / 16 * 0.20 + habit * 0.15
      if (days < 90) return 0.75 + (days - 30) / 60 * 0.15 + habit * 0.10
      return Math.min(0.95, 0.90 + habit * 0.05)
    },
    phases: [
      { fromDay: 0,  toDay: 3,   labelRu: 'Острая фаза',       labelKz: 'Жедел кезең',      detailRu: 'Рецепторы дофамина перегружены. Тяга сильная — это нормально.',           detailKz: 'Дофамин рецепторлары шаршады. Құштарлық күшті — бұл қалыпты.' },
      { fromDay: 3,  toDay: 14,  labelRu: 'Перезагрузка',      labelKz: 'Қайта жүктеу',     detailRu: 'Рецепторы начинают восстанавливаться. Появляются маленькие радости.',     detailKz: 'Рецепторлар қалпына кела бастайды. Кішкентай қуаныштар пайда болады.' },
      { fromDay: 14, toDay: 40,  labelRu: 'Рост чувств',       labelKz: 'Сезім өсуі',       detailRu: 'Естественный дофамин от еды, общения, движения возвращается.',           detailKz: 'Тамақ, қарым-қатынас, қозғалыстан табиғи дофамин оралады.' },
      { fromDay: 40, toDay: 90,  labelRu: 'Новый баланс',      labelKz: 'Жаңа тепе-теңдік', detailRu: 'Система наград перестраивается. Жизнь снова интересна.',                  detailKz: 'Сыйақы жүйесі қайта құрылады. Өмір қайтадан қызықты.' },
      { fromDay: 90, toDay: 999, labelRu: 'Восстановление',    labelKz: 'Қалпына келу',     detailRu: 'Дофаминовая система близка к здоровой норме. Ты чувствуешь жизнь.',     detailKz: 'Дофамин жүйесі дені сау нормаға жақын. Сен өмірді сезесің.' },
    ],
  },
  {
    id: 'serotonin',
    name: 'Серотонин',
    emoji: '🌅',
    color: '#f4a261',
    descRu: 'Спокойствие · Сон · Настроение',
    descKz: 'Тыныштық · Ұйқы · Көңіл-күй',
    calcLevel: (days, habit) => {
      if (days < 7)  return 0.20 + habit * 0.10
      if (days < 21) return 0.30 + (days / 21) * 0.30 + habit * 0.15
      if (days < 60) return 0.60 + (days - 21) / 39 * 0.20 + habit * 0.12
      return Math.min(0.95, 0.82 + habit * 0.13)
    },
    phases: [
      { fromDay: 0,  toDay: 7,   labelRu: 'Дефицит',           labelKz: 'Тапшылық',         detailRu: 'Тревога, раздражение, плохой сон — нехватка серотонина.',                detailKz: 'Уайым, ашулану, нашар ұйқы — серотонин жетіспеушілігі.' },
      { fromDay: 7,  toDay: 21,  labelRu: 'Стабилизация',      labelKz: 'Тұрақтану',        detailRu: 'Сон улучшается. Раздражительность снижается. Начинается покой.',        detailKz: 'Ұйқы жақсарады. Ашулану азаяды. Тыныштық басталады.' },
      { fromDay: 21, toDay: 60,  labelRu: 'Подъём настроения', labelKz: 'Көңіл-күй өсуі',  detailRu: 'Ровное хорошее настроение без причины — это серотонин работает.',        detailKz: 'Себепсіз жақсы көңіл-күй — серотонин жұмыс істейді.' },
      { fromDay: 60, toDay: 999, labelRu: 'Гармония',          labelKz: 'Үйлесімділік',     detailRu: 'Внутреннее спокойствие становится базовым состоянием.',                  detailKz: 'Ішкі тыныштық негізгі жағдайға айналады.' },
    ],
  },
  {
    id: 'endorphin',
    name: 'Эндорфин',
    emoji: '🔥',
    color: '#f87171',
    descRu: 'Радость · Обезболивание · Эйфория',
    descKz: 'Қуаныш · Ауыруды басу · Эйфория',
    calcLevel: (days, habit) => {
      // Эндорфин восстанавливается через движение и привычки
      if (days < 5)  return 0.10 + habit * 0.20
      if (days < 20) return 0.25 + habit * 0.30 + (days / 20) * 0.20
      if (days < 50) return 0.50 + habit * 0.25 + (days - 20) / 30 * 0.15
      return Math.min(0.95, 0.75 + habit * 0.20)
    },
    phases: [
      { fromDay: 0,  toDay: 5,   labelRu: 'Анестезия снята',   labelKz: 'Анестезия алынды', detailRu: 'Боль острее, радость тусклее. Тело учится снова чувствовать.',           detailKz: 'Ауырсыну күштірек, қуаныш солғын. Дене қайта сезуді үйренеді.' },
      { fromDay: 5,  toDay: 20,  labelRu: 'Первые вспышки',    labelKz: 'Алғашқы жарқылдар',detailRu: 'Движение, смех, музыка — начинают давать реальное удовольствие.',        detailKz: 'Қозғалыс, күлкі, музыка — нақты ләззат бере бастайды.' },
      { fromDay: 20, toDay: 50,  labelRu: 'Возврат радости',   labelKz: 'Қуаныш оралуы',   detailRu: 'Естественная эйфория от бега, общения, достижений усиливается.',         detailKz: 'Жүгіру, қарым-қатынас, жетістіктерден табиғи эйфория күшейеді.' },
      { fromDay: 50, toDay: 999, labelRu: 'Живая радость',     labelKz: 'Тірі қуаныш',     detailRu: 'Жизнь сама по себе приносит эйфорию. Без химии.',                        detailKz: 'Өмірдің өзі эйфория береді. Химиясыз.' },
    ],
  },
  {
    id: 'gaba',
    name: 'ГАМК',
    emoji: '🌊',
    color: '#60c5fa',
    descRu: 'Торможение · Антистресс · Покой',
    descKz: 'Тежеу · Стресске қарсы · Тыныштық',
    calcLevel: (days, habit) => {
      if (days < 10) return 0.15 + habit * 0.15
      if (days < 30) return 0.30 + (days / 30) * 0.35 + habit * 0.15
      if (days < 90) return 0.65 + habit * 0.20 + (days - 30) / 60 * 0.10
      return Math.min(0.95, 0.82 + habit * 0.13)
    },
    phases: [
      { fromDay: 0,  toDay: 10,  labelRu: 'Гипервозбуждение', labelKz: 'Гипер қозу',      detailRu: 'Тревога, бессонница, нервозность — ГАМК подавлена.',                      detailKz: 'Уайым, ұйқысыздық, жүйкелік — ГАМК басылған.' },
      { fromDay: 10, toDay: 30,  labelRu: 'Торможение растёт', labelKz: 'Тежеу өседі',    detailRu: 'Нервная система успокаивается. Тревожные мысли реже.',                    detailKz: 'Жүйке жүйесі тынышталады. Алаңдаушы ойлар сиреп кетеді.' },
      { fromDay: 30, toDay: 90,  labelRu: 'Новый покой',       labelKz: 'Жаңа тыныштық', detailRu: 'Способность расслабляться без веществ возвращается.',                      detailKz: 'Заттарсыз демалу қабілеті оралады.' },
      { fromDay: 90, toDay: 999, labelRu: 'Равновесие',        labelKz: 'Тепе-теңдік',   detailRu: 'Стресс переносится легче. Паника не захватывает. Ты держишься.',          detailKz: 'Стресс жеңілірек көтеріледі. Дүрбелең жаулап алмайды.' },
    ],
  },
  {
    id: 'oxytocin',
    name: 'Окситоцин',
    emoji: '🤝',
    color: '#a78bfa',
    descRu: 'Связь · Доверие · Тепло',
    descKz: 'Байланыс · Сенім · Жылулық',
    calcLevel: (days, habit) => {
      // Окситоцин растёт через связи и доверие
      if (days < 7)  return 0.20 + habit * 0.10
      if (days < 30) return 0.30 + (days / 30) * 0.35 + habit * 0.20
      return Math.min(0.95, 0.70 + habit * 0.25)
    },
    phases: [
      { fromDay: 0,  toDay: 7,   labelRu: 'Изоляция',         labelKz: 'Оқшаулану',       detailRu: 'Зависимость разрушила доверие. Стены выросли высоко.',                    detailKz: 'Тәуелділік сенімді бұзды. Қабырғалар биік өсті.' },
      { fromDay: 7,  toDay: 30,  labelRu: 'Первый контакт',   labelKz: 'Бірінші байланыс', detailRu: 'Способность доверять людям медленно возвращается.',                      detailKz: 'Адамдарға сену қабілеті ақырын оралады.' },
      { fromDay: 30, toDay: 999, labelRu: 'Тепло снова есть', labelKz: 'Жылулық қайтты',  detailRu: 'Обнять близкого, быть услышанным — это снова реально.',                  detailKz: 'Жақынды құшақтау, естілу — бұл қайтадан нақты.' },
    ],
  },
]

// Нейромедиатор-бар
function NeuroBar({
  neuro,
  level,
  isKz,
  days,
}: {
  neuro: Neurotransmitter
  level: number   // 0..1
  isKz: boolean
  days: number
}) {
  const [expanded, setExpanded] = useState(false)
  const pct = Math.round(level * 100)

  // Текущая фаза
  const currentPhase = neuro.phases.findLast(p => days >= p.fromDay) ?? neuro.phases[0]

  // Слова-состояние
  const stateLabel = pct < 30 ? (isKz ? 'Төмен' : 'Низкий')
    : pct < 55 ? (isKz ? 'Өсуде' : 'Растёт')
    : pct < 75 ? (isKz ? 'Жақсы' : 'Хорошо')
    : (isKz ? 'Күшті' : 'Сильный')

  const stateColor = pct < 30 ? '#f87171'
    : pct < 55 ? '#ffd060'
    : pct < 75 ? '#90e0ef'
    : neuro.color

  return (
    <div
      style={{
        borderRadius: '18px',
        background: expanded ? `${neuro.color}0e` : 'rgba(255,255,255,0.04)',
        border: `1px solid ${expanded ? neuro.color + '35' : 'rgba(255,255,255,0.08)'}`,
        overflow: 'hidden',
        transition: 'all 0.25s ease',
        cursor: 'pointer',
      }}
      onClick={() => setExpanded(e => !e)}
    >
      {/* Строка */}
      <div style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          {/* Эмодзи */}
          <span style={{
            fontSize: '22px',
            filter: `drop-shadow(0 0 6px ${neuro.color}80)`,
            flexShrink: 0,
          }}>
            {neuro.emoji}
          </span>
          {/* Название + описание */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>
              {neuro.name}
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginTop: '1px' }}>
              {isKz ? neuro.descKz : neuro.descRu}
            </div>
          </div>
          {/* Процент + стрелка */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: stateColor, fontVariantNumeric: 'tabular-nums' }}>
                {pct}%
              </div>
              <div style={{ fontSize: '10px', color: stateColor + 'cc' }}>
                {stateLabel}
              </div>
            </div>
            <span style={{
              color: 'rgba(255,255,255,0.25)',
              fontSize: '12px',
              transform: expanded ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s',
              display: 'block',
            }}>▼</span>
          </div>
        </div>

        {/* Прогресс бар с градиентом */}
        <div style={{
          height: '6px',
          borderRadius: '3px',
          background: 'rgba(255,255,255,0.07)',
          overflow: 'hidden',
          position: 'relative',
        }}>
          {/* Анимированный бар */}
          <div style={{
            height: '100%',
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${neuro.color}50, ${neuro.color})`,
            borderRadius: '3px',
            boxShadow: pct > 60 ? `0 0 10px ${neuro.color}60` : 'none',
            transition: 'width 0.8s ease',
            position: 'relative',
          }}>
            {/* Блик движения */}
            <div style={{
              position: 'absolute',
              right: 0, top: 0, bottom: 0,
              width: '20px',
              background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3))`,
              borderRadius: '3px',
            }} />
          </div>
        </div>
      </div>

      {/* Развёрнутая детализация */}
      {expanded && (
        <div style={{
          padding: '0 16px 16px',
          borderTop: `1px solid ${neuro.color}20`,
        }}>
          {/* Текущая фаза */}
          <div style={{
            padding: '12px 14px',
            borderRadius: '14px',
            background: `${neuro.color}10`,
            border: `1px solid ${neuro.color}25`,
            marginBottom: '14px',
            marginTop: '12px',
          }}>
            <div style={{ fontSize: '11px', color: neuro.color + 'cc', letterSpacing: '0.08em', marginBottom: '6px' }}>
              ◉ {isKz ? (currentPhase.labelKz) : (currentPhase.labelRu)}
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.78)', lineHeight: 1.6 }}>
              {isKz ? currentPhase.detailKz : currentPhase.detailRu}
            </p>
          </div>

          {/* Таймлайн фаз */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {neuro.phases.map((phase, i) => {
              const passed = days >= phase.toDay
              const active = days >= phase.fromDay && days < phase.toDay
              return (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  opacity: passed ? 0.5 : active ? 1 : 0.3,
                }}>
                  {/* Маркер */}
                  <div style={{
                    width: '8px', height: '8px',
                    borderRadius: '50%',
                    background: passed || active ? neuro.color : 'rgba(255,255,255,0.15)',
                    flexShrink: 0,
                    boxShadow: active ? `0 0 8px ${neuro.color}` : 'none',
                  }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '12px', color: active ? 'white' : 'rgba(255,255,255,0.50)', fontWeight: active ? 600 : 400 }}>
                      {isKz ? phase.labelKz : phase.labelRu}
                    </span>
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', marginLeft: '6px' }}>
                      {phase.fromDay}–{phase.toDay === 999 ? '∞' : phase.toDay} {isKz ? 'күн' : 'дн.'}
                    </span>
                  </div>
                  {passed && <span style={{ fontSize: '11px', color: neuro.color + '80' }}>✓</span>}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function NeuroPanel({ days, score, isKz }: { days: number; score: number; isKz: boolean }) {
  // Общий нейро-индекс (0..1) — среднее всех нейромедиаторов
  const neuroLevels = NEUROTRANSMITTERS.map(n => ({
    ...n,
    level: n.calcLevel(days, score),
  }))

  const avgLevel = neuroLevels.reduce((s, n) => s + n.level, 0) / neuroLevels.length
  const avgPct = Math.round(avgLevel * 100)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

      {/* Заголовок + дисклеймер */}
      <div style={{
        padding: '14px 16px',
        borderRadius: '18px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <span style={{ fontSize: '28px' }}>🧬</span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700 }}>
              {isKz ? 'Нейрожүйе қалпына келуі' : 'Восстановление нейросистемы'}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>
              {isKz ? `${days} күн · орташа деңгей ${avgPct}%` : `${days} дней · средний уровень ${avgPct}%`}
            </div>
          </div>
        </div>

        {/* Общий нейро-бар */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{
            height: '8px',
            borderRadius: '4px',
            background: 'rgba(255,255,255,0.07)',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${avgPct}%`,
              background: 'linear-gradient(90deg, #a78bfa, #ffd060, #6fcf8e)',
              borderRadius: '4px',
              transition: 'width 1s ease',
              boxShadow: avgPct > 60 ? '0 0 12px rgba(167,139,250,0.5)' : 'none',
            }} />
          </div>
        </div>

        {/* Дисклеймер */}
        <p style={{ margin: 0, fontSize: '10px', color: 'rgba(255,255,255,0.22)', lineHeight: 1.5 }}>
          {isKz
            ? '⚕️ Бұл медициналық диагноз емес. Нейробиология негіздерінде жасалған мотивациялық бейнелеу.'
            : '⚕️ Это не медицинский диагноз. Мотивационная визуализация на основе нейробиологии.'}
        </p>
      </div>

      {/* Нейромедиаторы */}
      {neuroLevels.map(n => (
        <NeuroBar
          key={n.id}
          neuro={n}
          level={n.level}
          isKz={isKz}
          days={days}
        />
      ))}

      {/* Мотивация внизу */}
      <div style={{
        padding: '16px',
        borderRadius: '18px',
        background: 'rgba(167,139,250,0.07)',
        border: '1px solid rgba(167,139,250,0.18)',
        textAlign: 'center',
      }}>
        <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.60)', lineHeight: 1.7, fontStyle: 'italic' }}>
          {days < 7
            ? (isKz ? '🌱 Жүйе оянуда. Ең қиын кезең — алғашқы 7 күн.' : '🌱 Система пробуждается. Самое тяжёлое — первые 7 дней.')
            : days < 21
            ? (isKz ? '⚡ Дофамин өсуде. Мозг жаңа сыйақыларды іздейді.' : '⚡ Дофамин растёт. Мозг ищет новые награды.')
            : days < 40
            ? (isKz ? '🌅 Серотонин тұрақтанды. Сен өзіңді тани бастайсың.' : '🌅 Серотонин стабилизируется. Ты начинаешь узнавать себя.')
            : days < 90
            ? (isKz ? '🔥 Нейрожүйе қайта жазылуда. Бұл — биологиялық өзгеріс.' : '🔥 Нейросистема перепрограммируется. Это биологическое изменение.')
            : (isKz ? '👑 Мидың табиғи химиясы қалпына келді. Бұл — сенің жеңісің.' : '👑 Естественная химия мозга восстановлена. Это твоя победа.')
          }
        </p>
      </div>

    </div>
  )
}

// ─── Главный компонент ────────────────────────────────────────────────────────

interface Props {
  user: UserProfile
  locale: Locale
  onBack: () => void
  days?: number
}

export default function TreeSection({ user, locale, onBack }: Props) {
  const isKz = locale === 'kz'
  const { days } = useDayCounter(user.createdAt)
  const [records, setRecords] = useState<DayRecord[]>([])
  const [todayValues, setTodayValues] = useState<Record<BranchId, number>>(emptyValues())
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<'today' | 'week' | 'neuro'>('today')

  const today = todayStr()

  useEffect(() => {
    const data = loadRecords()
    setRecords(data)
    const todayRec = data.find(r => r.date === today)
    if (todayRec) setTodayValues(todayRec.values)
  }, [])

  function updateValue(id: BranchId, v: number) {
    setTodayValues(prev => ({ ...prev, [id]: v }))
    setSaved(false)
  }

  function handleSave() {
    const entry: DayRecord = { date: today, values: todayValues }
    const updated = [...records.filter(r => r.date !== today), entry]
    setRecords(updated)
    saveRecords(updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const score = dayScore(todayValues)
  const streak = calcStreak(records)
  const treeColor = score > 0.7 ? '#6fcf8e' : score > 0.4 ? '#ffd060' : '#60c5fa'

  // Сообщение по состоянию дерева
  const treeMessage = score === 0
    ? (isKz ? 'Ағаш сені күтеді...' : 'Дерево ждёт тебя...')
    : score < 0.4
    ? (isKz ? 'Бүршіктер ашылуда' : 'Почки раскрываются')
    : score < 0.7
    ? (isKz ? 'Жапырақтар өсуде' : 'Листья растут')
    : (isKz ? 'Ағаш гүлденеді! 🌟' : 'Дерево цветёт! 🌟')

  const tabs = [
    { id: 'today' as const, ru: 'Сегодня', kz: 'Бүгін' },
    { id: 'week' as const,  ru: '7 дней',  kz: '7 күн'  },
    { id: 'neuro' as const, ru: 'Нейро',   kz: 'Нейро'  },
  ]

  return (
    <SectionShell
      locale={locale}
      title={isKz ? 'Ағаш' : 'Древо'}
      icon="🌳"
      onBack={onBack}
      accentColor="#6fcf8e99"
    >
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '16px 16px 48px' }}>

        {/* ── Визуальное дерево ── */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '16px 20px 8px',
          borderRadius: '24px',
          background: 'rgba(0,0,0,0.30)',
          border: `1px solid ${treeColor}25`,
          marginBottom: '16px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Фоновое свечение */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `radial-gradient(ellipse at 50% 80%, ${treeColor}10 0%, transparent 70%)`,
          }} />

          <TreeVisual score={score} streak={streak} color={treeColor} />

          {/* Подпись состояния */}
          <p style={{
            margin: '4px 0 0',
            fontSize: '13px',
            color: score > 0 ? treeColor : 'rgba(255,255,255,0.30)',
            fontStyle: 'italic',
            textAlign: 'center',
            transition: 'color 0.5s',
          }}>
            {treeMessage}
          </p>

          {/* Общий прогресс дня */}
          <div style={{ width: '100%', marginTop: '12px', padding: '0 8px', boxSizing: 'border-box' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.30)',
              marginBottom: '5px',
            }}>
              <span>{isKz ? 'Бүгінгі толықтық' : 'Полнота дня'}</span>
              <span style={{ color: treeColor }}>{Math.round(score * 100)}%</span>
            </div>
            <div style={{ height: '5px', borderRadius: '3px', background: 'rgba(255,255,255,0.07)' }}>
              <div style={{
                height: '100%',
                width: `${score * 100}%`,
                background: `linear-gradient(90deg, ${treeColor}60, ${treeColor})`,
                borderRadius: '3px',
                transition: 'width 0.5s ease',
                boxShadow: score > 0.5 ? `0 0 10px ${treeColor}60` : 'none',
              }} />
            </div>
          </div>
        </div>

        {/* ── Табы ── */}
        <div style={{
          display: 'flex',
          gap: '6px',
          marginBottom: '14px',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '14px',
          padding: '4px',
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === tab.id ? 'rgba(255,255,255,0.10)' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'rgba(255,255,255,0.38)',
                fontSize: '13px',
                fontWeight: activeTab === tab.id ? 600 : 400,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.18s',
              }}
            >
              {isKz ? tab.kz : tab.ru}
            </button>
          ))}
        </div>

        {/* ══ ТАБ: Сегодня ══ */}
        {activeTab === 'today' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {BRANCHES.map(branch => (
              <BranchSlider
                key={branch.id}
                branch={branch}
                value={todayValues[branch.id]}
                onChange={v => updateValue(branch.id, v)}
                isKz={isKz}
              />
            ))}

            {/* Кнопка сохранения */}
            <button
              onClick={handleSave}
              style={{
                marginTop: '6px',
                padding: '14px',
                borderRadius: '16px',
                border: 'none',
                background: saved
                  ? 'rgba(111,207,142,0.85)'
                  : score > 0
                  ? 'rgba(255,200,60,0.85)'
                  : 'rgba(255,255,255,0.08)',
                color: saved || score > 0 ? '#1a0f00' : 'rgba(255,255,255,0.25)',
                fontSize: '14px',
                fontWeight: 700,
                cursor: score > 0 ? 'pointer' : 'not-allowed',
                fontFamily: 'inherit',
                transition: 'all 0.3s ease',
                letterSpacing: '0.02em',
              }}
            >
              {saved
                ? (isKz ? '✓ Сақталды! Ағаш өсті!' : '✓ Сохранено! Дерево растёт!')
                : (isKz ? 'Күнді сақтау 🌳' : 'Сохранить день 🌳')}
            </button>

            {/* Подсказка */}
            <p style={{
              margin: 0,
              fontSize: '11px',
              color: 'rgba(255,255,255,0.22)',
              textAlign: 'center',
              lineHeight: 1.5,
            }}>
              {isKz
                ? 'Жарты мақсатқа жету де — жапырақ. Күн сайын.'
                : 'Даже половина цели — это лист. Каждый день.'}
            </p>
          </div>
        )}

        {/* ══ ТАБ: 7 дней ══ */}
        {activeTab === 'week' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <WeekCalendar records={records} isKz={isKz} />

            {/* Статистика */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              {[
                {
                  label: isKz ? 'Жақсы күндер' : 'Хороших дней',
                  value: records.filter(r => dayScore(r.values) >= 0.7).length,
                  color: '#6fcf8e',
                  emoji: '✦',
                },
                {
                  label: isKz ? 'Қатарынан' : 'Подряд',
                  value: streak,
                  color: '#ffd060',
                  emoji: '🔥',
                },
                {
                  label: isKz ? 'Барлық күн' : 'Всего дней',
                  value: records.length,
                  color: '#60c5fa',
                  emoji: '🗓',
                },
              ].map(stat => (
                <div key={stat.label} style={{
                  padding: '14px 10px',
                  borderRadius: '16px',
                  background: `${stat.color}10`,
                  border: `1px solid ${stat.color}25`,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>{stat.emoji}</div>
                  <div style={{
                    fontSize: '22px',
                    fontWeight: 800,
                    color: stat.color,
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginTop: '3px', lineHeight: 1.3 }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Подсказка по веткам */}
            <div style={{
              padding: '14px 16px',
              borderRadius: '16px',
              background: 'rgba(111,207,142,0.06)',
              border: '1px solid rgba(111,207,142,0.15)',
            }}>
              <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>
                {isKz
                  ? '🌳 Ағаш күн сайын өседі. 50% мақсаттан жоғары болса — жасыл күн. Тамыр тереңірек кетеді.'
                  : '🌳 Дерево растёт каждый день. Выше 50% цели — зелёный день. Корни уходят глубже.'}
              </p>
            </div>
          </div>
        )}

        {/* ══ ТАБ: Нейро ══ */}
        {activeTab === 'neuro' && (
          <NeuroPanel days={days} score={score} isKz={isKz} />
        )}

      </div>
    </SectionShell>
  )
}