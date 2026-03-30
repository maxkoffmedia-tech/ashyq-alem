'use client'

import { useState, useEffect } from 'react'
import SectionShell from '@/components/SectionShell'
import { useDayCounter, MILESTONES } from '@/hooks/useDayCounter'
import type { UserProfile } from '@/hooks/useAuth'
import type { Locale } from '@/i18n/translations'

// ─── Типы ───────────────────────────────────────────────────────────────────

interface DiaryEntry {
  date: string    // YYYY-MM-DD
  mood: Mood
  note: string
  checkedIn: boolean
}

type Mood = 'strong' | 'okay' | 'heavy' | 'crisis'

const MOOD_CONFIG: Record<Mood, { emoji: string; labelRu: string; labelKz: string; color: string }> = {
  strong: { emoji: '💪', labelRu: 'Сильный',   labelKz: 'Күшті',    color: '#6bcb77' },
  okay:   { emoji: '🌿', labelRu: 'Нормально', labelKz: 'Жақсы',    color: '#90e0ef' },
  heavy:  { emoji: '🌧', labelRu: 'Тяжело',    labelKz: 'Ауыр',     color: '#f4a261' },
  crisis: { emoji: '🆘', labelRu: 'Кризис',    labelKz: 'Дағдарыс', color: '#e63946' },
}

const MOODS = Object.keys(MOOD_CONFIG) as Mood[]

// Ключ для localStorage
const DIARY_KEY = 'ashyq_diary'

// ─── Утилиты ─────────────────────────────────────────────────────────────────

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

function loadDiary(): DiaryEntry[] {
  try {
    const raw = localStorage.getItem(DIARY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function saveDiary(entries: DiaryEntry[]) {
  localStorage.setItem(DIARY_KEY, JSON.stringify(entries))
}

// ─── Мини-задания (меняются каждый день) ─────────────────────────────────────

const DAILY_TASKS_RU = [
  'Выпей 2 стакана воды прямо сейчас',
  'Сделай 10 глубоких вдохов',
  'Напиши одно честное слово о своём дне',
  'Выйди на улицу на 5 минут',
  'Позвони человеку, которому доверяешь',
  'Запиши одну вещь за которую благодарен',
  'Ляг спать на 30 минут раньше сегодня',
  'Съешь что-нибудь настоящее, не фастфуд',
  'Откажись от одной малой слабости сегодня',
  'Скажи себе: я выбираю путь силы',
]

const DAILY_TASKS_KZ = [
  'Қазір 2 стақан су ішіп жібер',
  'Терең 10 рет дем ал',
  'Күніңе байланысты бір шын сөз жаз',
  'Сыртқа 5 минутқа шық',
  'Сенетін адамыңа қоңырау шал',
  'Риза болатын бір нәрсе жаз',
  'Бүгін 30 минут ерте ұйықта',
  'Нағыз тамақ же, фастфуд емес',
  'Бүгін кішкентай бір әлсіздіктен бас тарт',
  'Өзіңе айт: мен күш жолын таңдаймын',
]

function getDailyTask(isKz: boolean, dayIndex: number): string {
  const tasks = isKz ? DAILY_TASKS_KZ : DAILY_TASKS_RU
  return tasks[dayIndex % tasks.length]
}

// ─── Компоненты ──────────────────────────────────────────────────────────────

function MoodPicker({
  selected,
  onSelect,
  isKz,
}: {
  selected: Mood | null
  onSelect: (m: Mood) => void
  isKz: boolean
}) {
  return (
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
      {MOODS.map(mood => {
        const cfg = MOOD_CONFIG[mood]
        const active = selected === mood
        return (
          <button
            key={mood}
            onClick={() => onSelect(mood)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '10px 16px',
              borderRadius: '16px',
              border: `1.5px solid ${active ? cfg.color : 'rgba(255,255,255,0.10)'}`,
              background: active ? `${cfg.color}22` : 'rgba(255,255,255,0.04)',
              cursor: 'pointer',
              transition: 'all 0.18s',
              fontFamily: 'inherit',
              minWidth: '72px',
            }}
          >
            <span style={{ fontSize: '24px' }}>{cfg.emoji}</span>
            <span style={{
              fontSize: '11px',
              color: active ? cfg.color : 'rgba(255,255,255,0.5)',
              fontWeight: active ? 600 : 400,
            }}>
              {isKz ? cfg.labelKz : cfg.labelRu}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function MilestoneTimeline({
  days,
  isKz,
}: {
  days: number
  isKz: boolean
}) {
  // Показываем ближайшие 5 вех
  const visible = MILESTONES.slice(0, 8)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {visible.map(m => {
        const passed = days >= m.days
        const current = days < m.days &&
          (MILESTONES.find(x => x.days > days) === m)

        return (
          <div
            key={m.days}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '14px',
              background: passed
                ? `${m.color}14`
                : current
                ? 'rgba(255,255,255,0.06)'
                : 'rgba(255,255,255,0.02)',
              border: `1px solid ${passed ? m.color + '40' : current ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)'}`,
              transition: 'all 0.2s',
            }}
          >
            {/* Артефакт */}
            <span style={{
              fontSize: '22px',
              opacity: passed ? 1 : 0.3,
              filter: passed ? `drop-shadow(0 0 6px ${m.color})` : 'none',
              flexShrink: 0,
            }}>
              {m.artifact}
            </span>

            {/* Лейбл */}
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '13px',
                fontWeight: 600,
                color: passed ? m.color : current ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)',
              }}>
                {isKz ? m.labelKz : m.labelRu}
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
                {m.days} {isKz ? 'күн' : 'дн.'}
              </div>
            </div>

            {/* Статус */}
            <div style={{ flexShrink: 0, fontSize: '12px' }}>
              {passed
                ? <span style={{ color: m.color }}>✓</span>
                : current
                ? <span style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {isKz ? `${m.days - days} күн` : `${m.days - days} дн.`}
                  </span>
                : <span style={{ color: 'rgba(255,255,255,0.2)' }}>
                    {isKz ? `${m.days - days} күн` : `${m.days - days} дн.`}
                  </span>
              }
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Главный компонент ───────────────────────────────────────────────────────

interface Props {
  user: UserProfile
  locale: Locale
  onBack: () => void
  onResetPath: () => void
}

export default function PathSection({ user, locale, onBack, onResetPath }: Props) {
  const isKz = locale === 'kz'
  const { days, hours, minutes, milestone, nextMilestone, progressToNext } =
    useDayCounter(user.createdAt)

  const [diary, setDiary] = useState<DiaryEntry[]>([])
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null)
  const [noteText, setNoteText] = useState('')
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<'today' | 'milestones' | 'diary'>('today')

  const today = todayStr()
  const todayEntry = diary.find(e => e.date === today)
  const alreadyCheckedIn = !!todayEntry?.checkedIn

  useEffect(() => {
    const data = loadDiary()
    setDiary(data)
    const todayData = data.find(e => e.date === today)
    if (todayData) {
      setSelectedMood(todayData.mood)
      setNoteText(todayData.note)
    }
  }, [])

  function handleCheckIn() {
    if (!selectedMood) return
    const entry: DiaryEntry = {
      date: today,
      mood: selectedMood,
      note: noteText.trim(),
      checkedIn: true,
    }
    const updated = [...diary.filter(e => e.date !== today), entry]
    setDiary(updated)
    saveDiary(updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const glowColor = milestone?.color ?? '#ffd060'
  const dailyTask = getDailyTask(isKz, days)

  const tabs = [
    { id: 'today',      labelRu: 'Сегодня',     labelKz: 'Бүгін'    },
    { id: 'milestones', labelRu: 'Вехи',         labelKz: 'Белестер' },
    { id: 'diary',      labelRu: 'Дневник',      labelKz: 'Күнделік' },
  ] as const

  return (
    <SectionShell
      locale={locale}
      title={isKz ? 'Жол' : 'Путь'}
      icon="🧭"
      onBack={onBack}
      accentColor={glowColor + '99'}
    >
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px 16px 40px' }}>

        {/* ── Большой счётчик ── */}
        <div
          style={{
            textAlign: 'center',
            padding: '24px 20px',
            borderRadius: '24px',
            background: 'rgba(0,0,0,0.35)',
            border: `1px solid ${glowColor}35`,
            boxShadow: `0 0 40px ${glowColor}15`,
            marginBottom: '20px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `radial-gradient(ellipse at 50% 0%, ${glowColor}12 0%, transparent 65%)`,
          }} />

          {/* Артефакт + число */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <span style={{
              fontSize: '48px',
              filter: `drop-shadow(0 0 12px ${glowColor})`,
            }}>
              {milestone?.artifact ?? '🌱'}
            </span>
            <div>
              <div style={{
                fontSize: 'clamp(3rem, 10vw, 5.5rem)',
                fontWeight: 800,
                lineHeight: 1,
                color: glowColor,
                textShadow: `0 0 30px ${glowColor}80`,
                fontVariantNumeric: 'tabular-nums',
              }}>
                {days}
              </div>
              <div style={{
                fontSize: '13px',
                color: 'rgba(255,255,255,0.45)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}>
                {isKz ? 'күн' : 'дней'}
              </div>
            </div>
          </div>

          {/* Время */}
          <div style={{
            marginTop: '8px',
            fontSize: '13px',
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.08em',
          }}>
            {String(hours).padStart(2,'0')}:{String(minutes).padStart(2,'0')} {isKz ? 'ағымдағы тәулік' : 'текущих суток'}
          </div>

          {/* Milestone badge */}
          {milestone && (
            <div style={{
              display: 'inline-block',
              marginTop: '10px',
              padding: '4px 16px',
              borderRadius: '20px',
              background: `${glowColor}20`,
              border: `1px solid ${glowColor}50`,
              fontSize: '12px',
              color: glowColor,
              fontWeight: 600,
            }}>
              {isKz ? milestone.labelKz : milestone.labelRu}
            </div>
          )}

          {/* Прогресс к следующей вехе */}
          <div style={{ marginTop: '14px', padding: '0 8px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.30)',
              marginBottom: '6px',
            }}>
              <span>{isKz ? 'Келесі:' : 'След:'} {nextMilestone.artifact} {isKz ? nextMilestone.labelKz : nextMilestone.labelRu}</span>
              <span>{nextMilestone.days - days} {isKz ? 'күн' : 'дн.'}</span>
            </div>
            <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.08)' }}>
              <div style={{
                height: '100%',
                width: `${progressToNext * 100}%`,
                background: `linear-gradient(90deg, ${glowColor}60, ${glowColor})`,
                borderRadius: '2px',
                transition: 'width 1s ease',
              }} />
            </div>
          </div>
        </div>

        {/* ── Табы ── */}
        <div style={{
          display: 'flex',
          gap: '6px',
          marginBottom: '16px',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '16px',
          padding: '4px',
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '8px 4px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === tab.id ? 'rgba(255,255,255,0.10)' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'rgba(255,255,255,0.40)',
                fontSize: '13px',
                fontWeight: activeTab === tab.id ? 600 : 400,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.18s',
              }}
            >
              {isKz ? tab.labelKz : tab.labelRu}
            </button>
          ))}
        </div>

        {/* ══ ТАБ: Сегодня ══ */}
        {activeTab === 'today' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Задание дня */}
            <div style={{
              padding: '16px',
              borderRadius: '18px',
              background: 'rgba(255,200,60,0.08)',
              border: '1px solid rgba(255,200,60,0.20)',
            }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,200,60,0.7)', letterSpacing: '0.1em', marginBottom: '8px' }}>
                ⚡ {isKz ? 'БҮГІНГІ ТАПСЫРМА' : 'ЗАДАНИЕ ДНЯ'}
              </div>
              <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,240,190,0.90)', lineHeight: 1.6 }}>
                {dailyTask}
              </p>
            </div>

            {/* Чек-ин */}
            {alreadyCheckedIn ? (
              <div style={{
                padding: '20px',
                borderRadius: '18px',
                background: 'rgba(107,203,119,0.10)',
                border: '1px solid rgba(107,203,119,0.30)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
                <div style={{ fontSize: '14px', color: 'rgba(107,203,119,0.90)', fontWeight: 600 }}>
                  {isKz ? 'Бүгін белгіленді!' : 'День отмечен!'}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.40)', marginTop: '4px' }}>
                  {isKz
                    ? `Ерте тұрдың: ${MOOD_CONFIG[todayEntry!.mood].emoji} ${MOOD_CONFIG[todayEntry!.mood].labelKz}`
                    : `Настроение: ${MOOD_CONFIG[todayEntry!.mood].emoji} ${MOOD_CONFIG[todayEntry!.mood].labelRu}`}
                </div>
                {todayEntry?.note && (
                  <div style={{
                    marginTop: '12px',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: 'rgba(0,0,0,0.20)',
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.60)',
                    fontStyle: 'italic',
                    textAlign: 'left',
                  }}>
                    «{todayEntry.note}»
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                padding: '20px',
                borderRadius: '18px',
                background: 'rgba(0,0,0,0.25)',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.50)', letterSpacing: '0.06em' }}>
                  {isKz ? '🌅 Бүгінгі жай-күй' : '🌅 Состояние сегодня'}
                </div>

                <MoodPicker
                  selected={selectedMood}
                  onSelect={setSelectedMood}
                  isKz={isKz}
                />

                {/* Кризис — показываем поддержку */}
                {selectedMood === 'crisis' && (
                  <div style={{
                    padding: '12px 14px',
                    borderRadius: '14px',
                    background: 'rgba(230,57,70,0.12)',
                    border: '1px solid rgba(230,57,70,0.30)',
                    fontSize: '13px',
                    color: 'rgba(255,180,180,0.90)',
                    lineHeight: 1.6,
                  }}>
                    {isKz
                      ? '❤️ Дағдарыс — бұл да жол. Ақсақалға жүгін немесе маманға қоңырау шал: 8-800-080-8800'
                      : '❤️ Кризис — это тоже часть пути. Обратись к Ақсақалу или позвони: 8-800-080-8800'}
                  </div>
                )}

                {/* Заметка */}
                <textarea
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  placeholder={isKz ? 'Бүгін туралы бір ой... (міндетті емес)' : 'Одна мысль о сегодня... (необязательно)'}
                  maxLength={500}
                  rows={3}
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

                {/* Кнопка чек-ина */}
                <button
                  onClick={handleCheckIn}
                  disabled={!selectedMood}
                  style={{
                    padding: '13px',
                    borderRadius: '16px',
                    border: 'none',
                    background: selectedMood
                      ? `rgba(255,200,60,0.88)`
                      : 'rgba(255,255,255,0.08)',
                    color: selectedMood ? '#1a0f00' : 'rgba(255,255,255,0.25)',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: selectedMood ? 'pointer' : 'not-allowed',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s',
                    letterSpacing: '0.02em',
                  }}
                >
                  {saved
                    ? (isKz ? '✓ Сақталды!' : '✓ Сохранено!')
                    : (isKz ? '✓ Күнді белгілеу' : '✓ Отметить день')}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ══ ТАБ: Вехи ══ */}
        {activeTab === 'milestones' && (
          <MilestoneTimeline days={days} isKz={isKz} />
        )}

        {/* ══ ТАБ: Дневник ══ */}
        {activeTab === 'diary' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {diary.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: 'rgba(255,255,255,0.30)',
                fontSize: '14px',
              }}>
                {isKz ? 'Күнделік бос. Бүгін бастаңыз.' : 'Дневник пуст. Начните сегодня.'}
              </div>
            ) : (
              [...diary]
                .sort((a, b) => b.date.localeCompare(a.date))
                .map(entry => {
                  const cfg = MOOD_CONFIG[entry.mood]
                  return (
                    <div
                      key={entry.date}
                      style={{
                        padding: '14px 16px',
                        borderRadius: '16px',
                        background: 'rgba(255,255,255,0.04)',
                        border: `1px solid ${cfg.color}25`,
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'flex-start',
                      }}
                    >
                      <span style={{ fontSize: '22px', flexShrink: 0 }}>{cfg.emoji}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '12px',
                          color: 'rgba(255,255,255,0.35)',
                          marginBottom: '4px',
                        }}>
                          {entry.date}
                        </div>
                        {entry.note ? (
                          <p style={{
                            margin: 0,
                            fontSize: '13px',
                            color: 'rgba(255,255,255,0.70)',
                            lineHeight: 1.5,
                            wordBreak: 'break-word',
                          }}>
                            {entry.note}
                          </p>
                        ) : (
                          <p style={{
                            margin: 0,
                            fontSize: '13px',
                            color: 'rgba(255,255,255,0.25)',
                            fontStyle: 'italic',
                          }}>
                            {isKz ? 'Жазба жоқ' : 'Без записи'}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })
            )}
          </div>
        )}

        {/* Новая точка (внизу) */}
        <div style={{ marginTop: '28px', textAlign: 'center' }}>
          <button
            onClick={() => {
              if (window.confirm(isKz
                ? 'Жаңа бастау нүктесі? Бұл ерлік — жол жалғасады.'
                : 'Новая точка отсчёта? Это смелость — путь продолжается.'
              )) onResetPath()
            }}
            style={{
              padding: '8px 20px',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'transparent',
              color: 'rgba(255,255,255,0.25)',
              fontSize: '12px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.25)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
            }}
          >
            ↩ {isKz ? 'Жаңа бастау нүктесі' : 'Новая точка отсчёта'}
          </button>
        </div>

      </div>
    </SectionShell>
  )
}