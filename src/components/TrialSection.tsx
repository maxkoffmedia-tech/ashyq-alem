'use client'

import { useState, useEffect } from 'react'
import SectionShell from '@/components/SectionShell'
import type { UserProfile } from '@/hooks/useAuth'
import type { Locale } from '@/i18n/translations'

// ═══════════════════════════════════════════════════════════════════════════════
// ИСПЫТАНИЯ — геймификация пути
//
// Механика:
//   - Ежедневные испытания (3 штуки, обновляются каждый день)
//   - Недельные квесты (1 большое испытание)
//   - Испытания пути (разблокируются по дням трезвости)
//   - XP + уровни + артефакты за прохождение
//   - Всё в стиле Великой Степи
// ═══════════════════════════════════════════════════════════════════════════════

interface Props {
  user: UserProfile
  locale: Locale
  onBack: () => void
}

type Tab = 'daily' | 'path' | 'rank'
type Difficulty = 'easy' | 'medium' | 'hard' | 'legendary'

interface Trial {
  id: string
  emoji: string
  titleRu: string
  titleKz: string
  descRu: string
  descKz: string
  xp: number
  difficulty: Difficulty
  category: 'body' | 'mind' | 'soul' | 'social'
  minDays?: number   // минимум дней для разблокировки
}

// ─── XP и уровни ─────────────────────────────────────────────────────────────

interface Rank {
  level: number
  nameRu: string
  nameKz: string
  emoji: string
  minXp: number
  color: string
}

const RANKS: Rank[] = [
  { level: 1,  nameRu: 'Странник',      nameKz: 'Жолаушы',      emoji: '🚶', minXp: 0,     color: '#9ca3af' },
  { level: 2,  nameRu: 'Искатель',      nameKz: 'Іздеуші',      emoji: '🔍', minXp: 100,   color: '#60c5fa' },
  { level: 3,  nameRu: 'Воин степи',    nameKz: 'Дала жауынгері',emoji: '⚔️', minXp: 250,   color: '#6fcf8e' },
  { level: 4,  nameRu: 'Охотник',       nameKz: 'Аңшы',          emoji: '🏹', minXp: 500,   color: '#ffd060' },
  { level: 5,  nameRu: 'Всадник',       nameKz: 'Атты жауынгер', emoji: '🐎', minXp: 900,   color: '#f4a261' },
  { level: 6,  nameRu: 'Батыр',         nameKz: 'Батыр',          emoji: '🛡', minXp: 1500,  color: '#f87171' },
  { level: 7,  nameRu: 'Хан степи',     nameKz: 'Дала ханы',     emoji: '👑', minXp: 2500,  color: '#a78bfa' },
  { level: 8,  nameRu: 'Легенда',       nameKz: 'Аңыз',          emoji: '⭐', minXp: 4000,  color: '#ffd060' },
]

function getRank(xp: number): Rank {
  let current = RANKS[0]
  for (const r of RANKS) {
    if (xp >= r.minXp) current = r
    else break
  }
  return current
}

function getNextRank(xp: number): Rank | null {
  const current = getRank(xp)
  return RANKS.find(r => r.level === current.level + 1) ?? null
}

// ─── Банк испытаний ───────────────────────────────────────────────────────────

const ALL_TRIALS: Trial[] = [
  // ТЕЛО
  {
    id: 't_water', emoji: '💧', category: 'body', xp: 20, difficulty: 'easy',
    titleRu: 'Источник', titleKz: 'Бұлақ',
    descRu: 'Выпей 8 стаканов воды сегодня',
    descKz: 'Бүгін 8 стақан су іш',
  },
  {
    id: 't_walk', emoji: '🚶', category: 'body', xp: 30, difficulty: 'easy',
    titleRu: 'Путь ног', titleKz: 'Аяқ жолы',
    descRu: '20 минут пешей прогулки без телефона',
    descKz: '20 минут телефонсыз серуен',
  },
  {
    id: 't_sleep', emoji: '🌙', category: 'body', xp: 25, difficulty: 'easy',
    titleRu: 'Ночь воина', titleKz: 'Жауынгер түні',
    descRu: 'Лечь спать до 23:00',
    descKz: 'Сағат 23:00-ге дейін ұйықтауға жат',
  },
  {
    id: 't_breath', emoji: '🍃', category: 'body', xp: 20, difficulty: 'easy',
    titleRu: 'Дыхание степи', titleKz: 'Дала тынысы',
    descRu: '10 минут дыхательной практики',
    descKz: '10 минут тыныс жаттығуы',
  },
  {
    id: 't_run', emoji: '🏃', category: 'body', xp: 50, difficulty: 'medium',
    titleRu: 'Конный бег', titleKz: 'Ат жарысы',
    descRu: '30 минут активной тренировки',
    descKz: '30 минут белсенді жаттығу',
  },
  {
    id: 't_cold', emoji: '❄️', category: 'body', xp: 60, difficulty: 'hard',
    titleRu: 'Закалка', titleKz: 'Шыңдалу',
    descRu: 'Холодный душ — хотя бы 30 секунд',
    descKz: 'Суық душ — кемінде 30 секунд',
  },
  // УМ
  {
    id: 't_journal', emoji: '📖', category: 'mind', xp: 25, difficulty: 'easy',
    titleRu: 'Слово путника', titleKz: 'Жолаушы сөзі',
    descRu: 'Написать 5 предложений о сегодняшнем дне',
    descKz: 'Бүгінгі күн туралы 5 сөйлем жаз',
  },
  {
    id: 't_grateful', emoji: '🤍', category: 'mind', xp: 20, difficulty: 'easy',
    titleRu: 'Три дара', titleKz: 'Үш сыйлық',
    descRu: 'Назови 3 вещи за которые благодарен сегодня',
    descKz: 'Бүгін риза болатын 3 нәрсені ата',
  },
  {
    id: 't_noscreen', emoji: '📵', category: 'mind', xp: 40, difficulty: 'medium',
    titleRu: 'Час тишины', titleKz: 'Үнсіздік сағаты',
    descRu: '1 час без телефона и экрана',
    descKz: '1 сағат телефонсыз және экрансыз',
  },
  {
    id: 't_read', emoji: '📚', category: 'mind', xp: 35, difficulty: 'medium',
    titleRu: 'Знание предков', titleKz: 'Ата-баба білімі',
    descRu: '20 минут чтения настоящей книги',
    descKz: '20 минут нақты кітап оқу',
  },
  {
    id: 't_learn', emoji: '🧠', category: 'mind', xp: 45, difficulty: 'medium',
    titleRu: 'Новый навык', titleKz: 'Жаңа дағды',
    descRu: 'Изучить что-то новое — 30 минут',
    descKz: 'Жаңа нәрсе үйрен — 30 минут',
  },
  // ДУША
  {
    id: 't_silence', emoji: '🕊', category: 'soul', xp: 30, difficulty: 'easy',
    titleRu: 'Степная тишина', titleKz: 'Дала тыныштығы',
    descRu: '10 минут медитации или просто тишины',
    descKz: '10 минут медитация немесе жай тыныштық',
  },
  {
    id: 't_forgive', emoji: '☀️', category: 'soul', xp: 70, difficulty: 'hard',
    titleRu: 'Рассвет прощения', titleKz: 'Кешірім таңы',
    descRu: 'Написать письмо прощения — себе или другому (не отправлять)',
    descKz: 'Кешірім хатын жаз — өзіңе немесе басқаға (жібермей)',
  },
  {
    id: 't_nature', emoji: '🌿', category: 'soul', xp: 35, difficulty: 'easy',
    titleRu: 'Голос земли', titleKz: 'Жер дауысы',
    descRu: 'Побыть на природе — парк, двор, любое дерево',
    descKz: 'Табиғатта болу — саябақ, аула, кез келген ағаш',
  },
  {
    id: 't_art', emoji: '🎨', category: 'soul', xp: 40, difficulty: 'medium',
    titleRu: 'Творение', titleKz: 'Шығармашылық',
    descRu: 'Создать что-то руками — рисунок, готовка, поделка',
    descKz: 'Қолыңмен бір нәрсе жасау — сурет, тамақ, қолөнер',
  },
  {
    id: 't_prayer', emoji: '🙏', category: 'soul', xp: 25, difficulty: 'easy',
    titleRu: 'Обращение', titleKz: 'Жүгіну',
    descRu: 'Минута обращения к тому во что веришь',
    descKz: 'Сенетін нәрсеңе бір минут жүгіну',
  },
  // СОЦИАЛЬНОЕ
  {
    id: 't_call', emoji: '📞', category: 'social', xp: 40, difficulty: 'medium',
    titleRu: 'Голос близкого', titleKz: 'Жақынның дауысы',
    descRu: 'Позвонить кому-то важному — не писать, именно позвонить',
    descKz: 'Маңызды біреуге қоңырау шал — жазбай, дәл қоңырау',
  },
  {
    id: 't_help', emoji: '🤲', category: 'social', xp: 60, difficulty: 'hard',
    titleRu: 'Рука батыра', titleKz: 'Батырдың қолы',
    descRu: 'Помочь кому-то без ожидания чего-либо взамен',
    descKz: 'Ешнәрсе күтпей біреуге көмектес',
  },
  {
    id: 't_honest', emoji: '💬', category: 'social', xp: 80, difficulty: 'hard',
    titleRu: 'Честное слово', titleKz: 'Шынайы сөз',
    descRu: 'Сказать кому-то правду которую давно держишь в себе',
    descKz: 'Ұзақ сақтаған шындықты біреуге айт',
  },
  {
    id: 't_group', emoji: '🏕', category: 'social', xp: 50, difficulty: 'medium',
    titleRu: 'Сбор у костра', titleKz: 'От басындағы жиын',
    descRu: 'Посетить встречу в Ауле или группу поддержки',
    descKz: 'Ауылдағы жиынға немесе қолдау тобына қатыс',
  },
  // ИСПЫТАНИЯ ПУТИ (по дням)
  {
    id: 'tp_7', emoji: '🌱', category: 'soul', xp: 100, difficulty: 'legendary', minDays: 7,
    titleRu: 'Первый росток', titleKz: 'Алғашқы өскін',
    descRu: 'Напиши: что изменилось за 7 дней? Одно честное наблюдение.',
    descKz: '7 күнде не өзгерді? Бір шынайы байқауды жаз.',
  },
  {
    id: 'tp_14', emoji: '🔥', category: 'soul', xp: 150, difficulty: 'legendary', minDays: 14,
    titleRu: 'Две недели огня', titleKz: 'Екі апта от',
    descRu: 'Расскажи кому-то близкому о своём пути. Вслух.',
    descKz: 'Жақыныңа өз жолың туралы айт. Дауыстап.',
  },
  {
    id: 'tp_21', emoji: '⚡', category: 'mind', xp: 200, difficulty: 'legendary', minDays: 21,
    titleRu: '21 день — новая привычка', titleKz: '21 күн — жаңа әдет',
    descRu: 'Определи одну привычку которую ты строил 21 день. Назови её вслух.',
    descKz: '21 күн қалыптастырған бір әдетіңді ата. Дауыстап ата.',
  },
  {
    id: 'tp_30', emoji: '🌙', category: 'soul', xp: 300, difficulty: 'legendary', minDays: 30,
    titleRu: 'Луна пути', titleKz: 'Жол айы',
    descRu: 'Напиши письмо себе на 30-й день. Что ты хочешь помнить?',
    descKz: '30-шы күнге өзіңе хат жаз. Нені есте сақтағың келеді?',
  },
  {
    id: 'tp_60', emoji: '🌅', category: 'soul', xp: 500, difficulty: 'legendary', minDays: 60,
    titleRu: '60 рассветов', titleKz: '60 таң',
    descRu: 'Сделай что-то для другого человека на пути. Прямо сегодня.',
    descKz: 'Жолдағы басқа адам үшін бір нәрсе жасашы. Дәл бүгін.',
  },
  {
    id: 'tp_90', emoji: '👑', category: 'soul', xp: 750, difficulty: 'legendary', minDays: 90,
    titleRu: '90 дней — Батыр', titleKz: '90 күн — Батыр',
    descRu: 'Ты батыр. Запиши своё послание тем кто ещё только начинает.',
    descKz: 'Сен батырсың. Жаңа бастаушыларға хабарламаңды жаз.',
  },
]

// ─── Хранилище ────────────────────────────────────────────────────────────────

const TRIALS_KEY = 'ashyq_trials'

interface TrialState {
  completedIds: string[]        // все выполненные за всё время
  todayIds: string[]            // сегодняшние 3 испытания
  todayDate: string             // когда были назначены
  xp: number
}

function loadState(): TrialState {
  try {
    return JSON.parse(localStorage.getItem(TRIALS_KEY) || 'null') ?? {
      completedIds: [], todayIds: [], todayDate: '', xp: 0,
    }
  } catch {
    return { completedIds: [], todayIds: [], todayDate: '', xp: 0 }
  }
}

function saveState(s: TrialState) {
  localStorage.setItem(TRIALS_KEY, JSON.stringify(s))
}

function todayStr() { return new Date().toISOString().slice(0, 10) }

// Выбираем 3 случайных ежедневных испытания, не включая испытания пути
function pickDailyTrials(completedIds: string[], days: number): string[] {
  const pool = ALL_TRIALS.filter(t =>
    !t.minDays &&
    !completedIds.includes(t.id)
  )
  // Если все пройдены — сбрасываем пул
  const actualPool = pool.length >= 3 ? pool : ALL_TRIALS.filter(t => !t.minDays)
  const shuffled = [...actualPool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 3).map(t => t.id)
}

// ─── Компоненты ───────────────────────────────────────────────────────────────

const DIFF_CONFIG: Record<Difficulty, { ru: string; kz: string; color: string }> = {
  easy:      { ru: 'Лёгкое',    kz: 'Жеңіл',     color: '#6fcf8e' },
  medium:    { ru: 'Среднее',   kz: 'Орташа',     color: '#ffd060' },
  hard:      { ru: 'Тяжёлое',  kz: 'Ауыр',       color: '#f4a261' },
  legendary: { ru: 'Легендарное', kz: 'Аңыздық', color: '#a78bfa' },
}

const CAT_CONFIG: Record<Trial['category'], { ru: string; kz: string; emoji: string }> = {
  body:   { ru: 'Тело',  kz: 'Дене',    emoji: '⚡' },
  mind:   { ru: 'Ум',   kz: 'Ақыл',    emoji: '🧠' },
  soul:   { ru: 'Душа', kz: 'Жан',     emoji: '🕊' },
  social: { ru: 'Связь',kz: 'Байланыс',emoji: '🤝' },
}

function TrialCard({
  trial,
  isKz,
  completed,
  onComplete,
  locked,
}: {
  trial: Trial
  isKz: boolean
  completed: boolean
  onComplete: (id: string, xp: number) => void
  locked?: boolean
}) {
  const [confirming, setConfirming] = useState(false)
  const [justDone, setJustDone] = useState(false)
  const diff = DIFF_CONFIG[trial.difficulty]
  const cat = CAT_CONFIG[trial.category]

  function handleTap() {
    if (completed || locked) return
    if (!confirming) { setConfirming(true); return }
    setJustDone(true)
    onComplete(trial.id, trial.xp)
    setTimeout(() => { setConfirming(false); setJustDone(false) }, 2000)
  }

  return (
    <div style={{
      padding: '16px',
      borderRadius: '20px',
      background: completed
        ? 'rgba(111,207,142,0.07)'
        : locked
        ? 'rgba(255,255,255,0.02)'
        : confirming
        ? `${diff.color}12`
        : 'rgba(255,255,255,0.04)',
      border: `1px solid ${
        completed ? 'rgba(111,207,142,0.30)'
        : locked ? 'rgba(255,255,255,0.05)'
        : confirming ? diff.color + '50'
        : 'rgba(255,255,255,0.08)'
      }`,
      opacity: locked ? 0.45 : 1,
      transition: 'all 0.25s ease',
      cursor: completed || locked ? 'default' : 'pointer',
    }}
    onClick={handleTap}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        {/* Эмодзи */}
        <div style={{
          width: '44px', height: '44px',
          borderRadius: '14px',
          background: completed
            ? 'rgba(111,207,142,0.15)'
            : `${diff.color}15`,
          border: `1px solid ${completed ? 'rgba(111,207,142,0.30)' : diff.color + '30'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '22px', flexShrink: 0,
          filter: locked ? 'grayscale(1)' : 'none',
        }}>
          {completed ? '✓' : locked ? '🔒' : trial.emoji}
        </div>

        {/* Текст */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '4px' }}>
            <span style={{
              fontSize: '13px', fontWeight: 700,
              color: completed ? '#6fcf8e' : 'rgba(255,255,255,0.88)',
              textDecoration: completed ? 'line-through' : 'none',
            }}>
              {isKz ? trial.titleKz : trial.titleRu}
            </span>
            <span style={{
              fontSize: '10px',
              padding: '2px 7px',
              borderRadius: '8px',
              background: `${diff.color}15`,
              color: diff.color,
              fontWeight: 600,
            }}>
              {isKz ? diff.kz : diff.ru}
            </span>
          </div>
          <p style={{
            margin: '0 0 8px',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.50)',
            lineHeight: 1.5,
          }}>
            {isKz ? trial.descKz : trial.descRu}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>
              {cat.emoji} {isKz ? cat.kz : cat.ru}
            </span>
            <span style={{
              fontSize: '12px',
              fontWeight: 700,
              color: completed ? 'rgba(111,207,142,0.60)' : '#ffd060',
              marginLeft: 'auto',
            }}>
              +{trial.xp} XP
            </span>
          </div>
        </div>
      </div>

      {/* Кнопка подтверждения */}
      {!completed && !locked && (
        <div style={{
          marginTop: '12px',
          padding: '10px',
          borderRadius: '14px',
          background: confirming ? `${diff.color}25` : 'rgba(255,255,255,0.04)',
          border: `1px solid ${confirming ? diff.color + '50' : 'rgba(255,255,255,0.08)'}`,
          textAlign: 'center',
          fontSize: '13px',
          fontWeight: 600,
          color: confirming ? diff.color : 'rgba(255,255,255,0.30)',
          transition: 'all 0.2s',
        }}>
          {justDone
            ? `⚡ +${trial.xp} XP!`
            : confirming
            ? (isKz ? '✓ Дайын! Тап қайта растау' : '✓ Готово! Нажми ещё раз')
            : (isKz ? 'Орындалды деп белгілеу' : 'Отметить выполненным')}
        </div>
      )}
    </div>
  )
}

// XP бар
function XpBar({ xp, isKz }: { xp: number; isKz: boolean }) {
  const rank = getRank(xp)
  const next = getNextRank(xp)
  const pct = next
    ? ((xp - rank.minXp) / (next.minXp - rank.minXp)) * 100
    : 100

  return (
    <div style={{
      padding: '16px 20px',
      borderRadius: '20px',
      background: `${rank.color}0e`,
      border: `1px solid ${rank.color}30`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <span style={{
          fontSize: '32px',
          filter: `drop-shadow(0 0 8px ${rank.color}80)`,
        }}>
          {rank.emoji}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '16px', fontWeight: 800, color: rank.color }}>
            {isKz ? rank.nameKz : rank.nameRu}
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>
            {isKz ? `${rank.level}-деңгей` : `${rank.level} уровень`}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontSize: '22px', fontWeight: 800,
            color: '#ffd060',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {xp.toLocaleString()}
          </div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.30)' }}>XP</div>
        </div>
      </div>

      {next && (
        <>
          <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${Math.min(pct, 100)}%`,
              background: `linear-gradient(90deg, ${rank.color}70, ${rank.color})`,
              borderRadius: '3px',
              transition: 'width 0.8s ease',
              boxShadow: `0 0 8px ${rank.color}60`,
            }} />
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            marginTop: '5px', fontSize: '10px', color: 'rgba(255,255,255,0.25)',
          }}>
            <span>{xp} XP</span>
            <span style={{ color: next.color }}>
              {next.emoji} {isKz ? next.nameKz : next.nameRu} — {next.minXp} XP
            </span>
          </div>
        </>
      )}
    </div>
  )
}

// ─── ГЛАВНЫЙ КОМПОНЕНТ ────────────────────────────────────────────────────────

export default function TrialSection({ user, locale, onBack }: Props) {
  const isKz = locale === 'kz'
  const [state, setState] = useState<TrialState>(() => loadState())
  const [activeTab, setActiveTab] = useState<Tab>('daily')
  const [xpFlash, setXpFlash] = useState<number | null>(null)

  const days = Math.floor(
    (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  )

  // Обновляем ежедневные испытания если нужно
  useEffect(() => {
    const today = todayStr()
    if (state.todayDate !== today || state.todayIds.length === 0) {
      const newIds = pickDailyTrials(state.completedIds, days)
      const updated = { ...state, todayIds: newIds, todayDate: today }
      setState(updated)
      saveState(updated)
    }
  }, [])

  function handleComplete(id: string, xp: number) {
    setXpFlash(xp)
    setTimeout(() => setXpFlash(null), 1800)

    const updated: TrialState = {
      ...state,
      completedIds: [...state.completedIds, id],
      xp: state.xp + xp,
    }
    setState(updated)
    saveState(updated)
  }

  // Испытания пути — те что разблокированы по дням
  const pathTrials = ALL_TRIALS
    .filter(t => t.minDays !== undefined)
    .sort((a, b) => (a.minDays ?? 0) - (b.minDays ?? 0))

  const dailyTrials = state.todayIds
    .map(id => ALL_TRIALS.find(t => t.id === id))
    .filter(Boolean) as Trial[]

  const todayDone = dailyTrials.filter(t => state.completedIds.includes(t.id)).length
  const rank = getRank(state.xp)

  const tabs: { id: Tab; ru: string; kz: string; emoji: string }[] = [
    { id: 'daily', ru: 'Сегодня', kz: 'Бүгін',  emoji: '⚔️' },
    { id: 'path',  ru: 'Путь',    kz: 'Жол',    emoji: '🗺' },
    { id: 'rank',  ru: 'Ранг',    kz: 'Дәреже', emoji: '👑' },
  ]

  return (
    <SectionShell
      locale={locale}
      title={isKz ? 'Сынақтар' : 'Испытания'}
      icon="⚔️"
      onBack={onBack}
      accentColor="rgba(248,113,113,0.55)"
    >
      {/* XP флэш */}
      {xpFlash && (
        <div style={{
          position: 'fixed',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 200,
          padding: '10px 24px',
          borderRadius: '20px',
          background: 'rgba(255,208,96,0.95)',
          color: '#1a0f00',
          fontSize: '18px',
          fontWeight: 800,
          boxShadow: '0 4px 20px rgba(255,208,96,0.50)',
          animation: 'fadeUp 1.8s ease forwards',
          pointerEvents: 'none',
        }}>
          ⚡ +{xpFlash} XP
          <style>{`
            @keyframes fadeUp {
              0%   { opacity: 0; transform: translateX(-50%) translateY(10px); }
              20%  { opacity: 1; transform: translateX(-50%) translateY(0); }
              70%  { opacity: 1; }
              100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
            }
          `}</style>
        </div>
      )}

      <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>

        {/* XP бар вверху */}
        <div style={{ padding: '12px 16px 0' }}>
          <XpBar xp={state.xp} isKz={isKz} />
        </div>

        {/* Табы */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          marginTop: '12px',
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '10px 4px',
                border: 'none',
                borderBottom: activeTab === tab.id
                  ? '2px solid #f87171'
                  : '2px solid transparent',
                background: 'transparent',
                color: activeTab === tab.id ? '#f87171' : 'rgba(255,255,255,0.35)',
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
            </button>
          ))}
        </div>

        <div style={{ padding: '16px 16px 60px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* ══ ТАБ: СЕГОДНЯ ══ */}
          {activeTab === 'daily' && (
            <>
              {/* Прогресс дня */}
              <div style={{
                padding: '14px 16px',
                borderRadius: '18px',
                background: 'rgba(248,113,113,0.07)',
                border: '1px solid rgba(248,113,113,0.20)',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '13px', fontWeight: 600,
                    color: todayDone === 3 ? '#6fcf8e' : 'rgba(255,255,255,0.70)',
                    marginBottom: '6px',
                  }}>
                    {todayDone === 3
                      ? (isKz ? '🏆 Бүгінгі барлық сынақтар орындалды!' : '🏆 Все испытания дня пройдены!')
                      : (isKz ? `Бүгінгі сынақтар` : 'Испытания дня')}
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{
                        flex: 1, height: '4px', borderRadius: '2px',
                        background: i < todayDone ? '#6fcf8e' : 'rgba(255,255,255,0.10)',
                        transition: 'background 0.4s',
                      }} />
                    ))}
                  </div>
                </div>
                <div style={{
                  fontSize: '24px', fontWeight: 800,
                  color: todayDone === 3 ? '#6fcf8e' : '#f87171',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {todayDone}/3
                </div>
              </div>

              {dailyTrials.map(trial => (
                <TrialCard
                  key={trial.id}
                  trial={trial}
                  isKz={isKz}
                  completed={state.completedIds.includes(trial.id)}
                  onComplete={handleComplete}
                />
              ))}

              {/* Подсказка */}
              <p style={{
                margin: 0, textAlign: 'center',
                fontSize: '11px', color: 'rgba(255,255,255,0.20)',
                lineHeight: 1.6,
              }}>
                {isKz
                  ? '⚔️ Испытания ежедневно обновляются. Тап дважды чтобы отметить.'
                  : '⚔️ Испытания обновляются каждый день. Нажми дважды чтобы отметить.'}
              </p>
            </>
          )}

          {/* ══ ТАБ: ПУТЬ ══ */}
          {activeTab === 'path' && (
            <>
              <div style={{
                padding: '14px 16px',
                borderRadius: '16px',
                background: 'rgba(167,139,250,0.07)',
                border: '1px solid rgba(167,139,250,0.18)',
                fontSize: '13px',
                color: 'rgba(255,255,255,0.55)',
                lineHeight: 1.6,
              }}>
                🗺 {isKz
                  ? 'Жол сынақтары — трезвостьтің белгілі күндерінде ашылады. Олар бір рет беріледі.'
                  : 'Испытания пути — открываются в особые дни трезвости. Они даются один раз.'}
              </div>

              {pathTrials.map(trial => {
                const locked = days < (trial.minDays ?? 0)
                const completed = state.completedIds.includes(trial.id)
                return (
                  <div key={trial.id}>
                    {locked && (
                      <div style={{
                        fontSize: '11px',
                        color: 'rgba(255,255,255,0.25)',
                        marginBottom: '4px',
                        paddingLeft: '4px',
                      }}>
                        🔒 {isKz
                          ? `${trial.minDays} күннен кейін ашылады · ${Math.max(0, (trial.minDays ?? 0) - days)} күн қалды`
                          : `Откроется на ${trial.minDays} день · осталось ${Math.max(0, (trial.minDays ?? 0) - days)} дн.`}
                      </div>
                    )}
                    <TrialCard
                      trial={trial}
                      isKz={isKz}
                      completed={completed}
                      onComplete={handleComplete}
                      locked={locked}
                    />
                  </div>
                )
              })}
            </>
          )}

          {/* ══ ТАБ: РАНГ ══ */}
          {activeTab === 'rank' && (
            <>
              {/* Статистика */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[
                  { emoji: '⚔️', value: state.completedIds.length, ru: 'Пройдено', kz: 'Өтілді', color: '#f87171' },
                  { emoji: '⚡', value: state.xp, ru: 'Всего XP', kz: 'Барлық XP', color: '#ffd060' },
                  { emoji: '📅', value: days, ru: 'Дней пути', kz: 'Жол күні', color: '#60c5fa' },
                  { emoji: '🎯', value: ALL_TRIALS.length, ru: 'Всего испытаний', kz: 'Барлық сынақ', color: '#6fcf8e' },
                ].map((stat, i) => (
                  <div key={i} style={{
                    padding: '16px',
                    borderRadius: '18px',
                    background: `${stat.color}0a`,
                    border: `1px solid ${stat.color}20`,
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '22px', marginBottom: '4px' }}>{stat.emoji}</div>
                    <div style={{ fontSize: '26px', fontWeight: 800, color: stat.color, fontVariantNumeric: 'tabular-nums' }}>
                      {stat.value.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginTop: '3px' }}>
                      {isKz ? stat.kz : stat.ru}
                    </div>
                  </div>
                ))}
              </div>

              {/* Таблица рангов */}
              <div>
                <div style={{
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.30)',
                  letterSpacing: '0.10em',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}>
                  {isKz ? '🏆 ДӘРЕЖЕЛЕР КЕСТЕСІ' : '🏆 ТАБЛИЦА РАНГОВ'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {RANKS.map(r => {
                    const isCurrent = r.level === rank.level
                    const isPassed = state.xp >= r.minXp
                    return (
                      <div key={r.level} style={{
                        padding: '12px 16px',
                        borderRadius: '16px',
                        background: isCurrent ? `${r.color}15` : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${isCurrent ? r.color + '50' : 'rgba(255,255,255,0.07)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        opacity: isPassed || isCurrent ? 1 : 0.4,
                      }}>
                        <span style={{
                          fontSize: '22px',
                          filter: isCurrent ? `drop-shadow(0 0 8px ${r.color})` : 'none',
                        }}>
                          {r.emoji}
                        </span>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontSize: '13px',
                            fontWeight: isCurrent ? 700 : 500,
                            color: isCurrent ? r.color : 'rgba(255,255,255,0.65)',
                          }}>
                            {isKz ? r.nameKz : r.nameRu}
                            {isCurrent && (
                              <span style={{
                                marginLeft: '8px',
                                fontSize: '10px',
                                padding: '2px 8px',
                                borderRadius: '8px',
                                background: `${r.color}25`,
                                color: r.color,
                              }}>
                                {isKz ? 'Қазір' : 'Сейчас'}
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.28)', marginTop: '2px' }}>
                            {isKz ? `${r.level}-деңгей` : `Уровень ${r.level}`}
                          </div>
                        </div>
                        <div style={{
                          fontSize: '12px',
                          fontWeight: 700,
                          color: isPassed ? r.color : 'rgba(255,255,255,0.25)',
                          fontVariantNumeric: 'tabular-nums',
                        }}>
                          {r.minXp.toLocaleString()} XP
                          {isPassed && !isCurrent && (
                            <span style={{ marginLeft: '4px', color: '#6fcf8e' }}>✓</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </SectionShell>
  )
}