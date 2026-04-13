'use client'
import { useState, useEffect } from 'react'
import SectionShell from '@/components/SectionShell'
import type { UserProfile } from '@/hooks/useAuth'
import type { Locale } from '@/i18n/translations'

interface Props { user: UserProfile; locale: Locale; onBack: () => void }
type Tab = 'today' | 'path' | 'rank'
type Difficulty = 'easy' | 'medium' | 'hard' | 'legendary'

interface Trial {
  id: string; emoji: string; titleRu: string; titleKz: string
  descRu: string; descKz: string; xp: number; difficulty: Difficulty
  category: 'body' | 'mind' | 'soul' | 'social'; minDays?: number
}

const DIFF = {
  easy:      { ru: 'Лёгкое',      kz: 'Жеңіл',    color: '#6fcf8e', bg: 'rgba(111,207,142,0.12)' },
  medium:    { ru: 'Среднее',     kz: 'Орташа',   color: '#ffd060', bg: 'rgba(255,208,96,0.12)'  },
  hard:      { ru: 'Тяжёлое',    kz: 'Ауыр',     color: '#f4a261', bg: 'rgba(244,162,97,0.12)'  },
  legendary: { ru: 'Легендарное', kz: 'Аңыздық',  color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
}

const CAT = {
  body:   { emoji: '⚡', ru: 'Тело',  kz: 'Дене'    },
  mind:   { emoji: '🧠', ru: 'Ум',    kz: 'Ақыл'    },
  soul:   { emoji: '🕊', ru: 'Душа',  kz: 'Жан'     },
  social: { emoji: '🤝', ru: 'Связь', kz: 'Байланыс' },
}

const RANKS = [
  { level: 1, ru: 'Странник',     kz: 'Жолаушы',        emoji: '🚶', minXp: 0,    color: '#9ca3af' },
  { level: 2, ru: 'Искатель',     kz: 'Іздеуші',        emoji: '🔍', minXp: 100,  color: '#60c5fa' },
  { level: 3, ru: 'Воин степи',   kz: 'Дала жауынгері', emoji: '⚔️', minXp: 250,  color: '#6fcf8e' },
  { level: 4, ru: 'Охотник',      kz: 'Аңшы',           emoji: '🏹', minXp: 500,  color: '#ffd060' },
  { level: 5, ru: 'Всадник',      kz: 'Атты жауынгер',  emoji: '🐎', minXp: 900,  color: '#f4a261' },
  { level: 6, ru: 'Батыр',        kz: 'Батыр',          emoji: '🛡', minXp: 1500, color: '#f87171' },
  { level: 7, ru: 'Хан степи',    kz: 'Дала ханы',      emoji: '👑', minXp: 2500, color: '#a78bfa' },
  { level: 8, ru: 'Легенда',      kz: 'Аңыз',           emoji: '⭐', minXp: 4000, color: '#ffd060' },
]

const TRIALS: Trial[] = [
  { id: 't1', emoji: '💧', category: 'body', xp: 20, difficulty: 'easy', titleRu: 'Источник', titleKz: 'Бұлақ', descRu: 'Выпей 8 стаканов воды сегодня', descKz: 'Бүгін 8 стақан су іш' },
  { id: 't2', emoji: '🚶', category: 'body', xp: 30, difficulty: 'easy', titleRu: 'Путь ног', titleKz: 'Аяқ жолы', descRu: '20 минут прогулки без телефона', descKz: '20 минут телефонсыз серуен' },
  { id: 't3', emoji: '🌙', category: 'body', xp: 25, difficulty: 'easy', titleRu: 'Ночь воина', titleKz: 'Жауынгер түні', descRu: 'Лечь спать до 23:00', descKz: 'Сағат 23:00-ге дейін ұйықтауға жат' },
  { id: 't4', emoji: '🍃', category: 'body', xp: 20, difficulty: 'easy', titleRu: 'Дыхание степи', titleKz: 'Дала тынысы', descRu: '10 минут дыхательной практики', descKz: '10 минут тыныс жаттығуы' },
  { id: 't5', emoji: '🏃', category: 'body', xp: 50, difficulty: 'medium', titleRu: 'Конный бег', titleKz: 'Ат жарысы', descRu: '30 минут активной тренировки', descKz: '30 минут белсенді жаттығу' },
  { id: 't6', emoji: '❄️', category: 'body', xp: 60, difficulty: 'hard', titleRu: 'Закалка', titleKz: 'Шыңдалу', descRu: 'Холодный душ — хотя бы 30 секунд', descKz: 'Суық душ — кемінде 30 секунд' },
  { id: 't7', emoji: '📖', category: 'mind', xp: 25, difficulty: 'easy', titleRu: 'Слово путника', titleKz: 'Жолаушы сөзі', descRu: 'Написать 5 предложений о дне', descKz: 'Күн туралы 5 сөйлем жаз' },
  { id: 't8', emoji: '🤍', category: 'mind', xp: 20, difficulty: 'easy', titleRu: 'Три дара', titleKz: 'Үш сыйлық', descRu: 'Назови 3 вещи за которые благодарен', descKz: 'Риза болатын 3 нәрсені ата' },
  { id: 't9', emoji: '📵', category: 'mind', xp: 40, difficulty: 'medium', titleRu: 'Час тишины', titleKz: 'Үнсіздік сағаты', descRu: '1 час без телефона и экрана', descKz: '1 сағат телефонсыз және экрансыз' },
  { id: 't10', emoji: '📚', category: 'mind', xp: 35, difficulty: 'medium', titleRu: 'Знание предков', titleKz: 'Ата-баба білімі', descRu: '20 минут чтения настоящей книги', descKz: '20 минут нақты кітап оқу' },
  { id: 't11', emoji: '🕊', category: 'soul', xp: 30, difficulty: 'easy', titleRu: 'Степная тишина', titleKz: 'Дала тыныштығы', descRu: '10 минут медитации или тишины', descKz: '10 минут медитация немесе тыныштық' },
  { id: 't12', emoji: '☀️', category: 'soul', xp: 70, difficulty: 'hard', titleRu: 'Рассвет прощения', titleKz: 'Кешірім таңы', descRu: 'Написать письмо прощения себе (не отправлять)', descKz: 'Өзіңе кешірім хатын жаз (жібермей)' },
  { id: 't13', emoji: '🌿', category: 'soul', xp: 35, difficulty: 'easy', titleRu: 'Голос земли', titleKz: 'Жер дауысы', descRu: 'Побыть на природе — парк, двор, любое дерево', descKz: 'Табиғатта болу — саябақ, аула' },
  { id: 't14', emoji: '📞', category: 'social', xp: 40, difficulty: 'medium', titleRu: 'Голос близкого', titleKz: 'Жақынның дауысы', descRu: 'Позвонить кому-то важному — именно позвонить', descKz: 'Маңызды біреуге қоңырау шал' },
  { id: 't15', emoji: '🤲', category: 'social', xp: 60, difficulty: 'hard', titleRu: 'Рука батыра', titleKz: 'Батырдың қолы', descRu: 'Помочь кому-то без ожидания чего-либо взамен', descKz: 'Ешнәрсе күтпей біреуге көмектес' },
  { id: 'tp1', emoji: '🌱', category: 'soul', xp: 100, difficulty: 'legendary', minDays: 7, titleRu: 'Первый росток', titleKz: 'Алғашқы өскін', descRu: 'Напиши: что изменилось за 7 дней?', descKz: '7 күнде не өзгерді?' },
  { id: 'tp2', emoji: '🔥', category: 'soul', xp: 150, difficulty: 'legendary', minDays: 14, titleRu: 'Две недели огня', titleKz: 'Екі апта от', descRu: 'Расскажи кому-то о своём пути. Вслух.', descKz: 'Жолың туралы біреуге айт. Дауыстап.' },
  { id: 'tp3', emoji: '⚡', category: 'mind', xp: 200, difficulty: 'legendary', minDays: 21, titleRu: '21 день — новая привычка', titleKz: '21 күн — жаңа әдет', descRu: 'Определи одну привычку которую строил 21 день', descKz: '21 күн қалыптастырған бір әдетіңді ата' },
  { id: 'tp4', emoji: '🌙', category: 'soul', xp: 300, difficulty: 'legendary', minDays: 30, titleRu: 'Луна пути', titleKz: 'Жол айы', descRu: 'Напиши письмо себе на 30-й день', descKz: '30-шы күнге өзіңе хат жаз' },
  { id: 'tp5', emoji: '🌅', category: 'soul', xp: 500, difficulty: 'legendary', minDays: 60, titleRu: '60 рассветов', titleKz: '60 таң', descRu: 'Сделай что-то для другого человека на пути', descKz: 'Жолдағы басқа адам үшін бір нәрсе жасашы' },
  { id: 'tp6', emoji: '👑', category: 'soul', xp: 750, difficulty: 'legendary', minDays: 90, titleRu: '90 дней — Батыр', titleKz: '90 күн — Батыр', descRu: 'Запиши послание тем кто только начинает', descKz: 'Жаңа бастаушыларға хабарламаңды жаз' },
]

const KEY = 'ashyq_trials_v2'
interface State { completedIds: string[]; todayIds: string[]; todayDate: string; xp: number }

function getRank(xp: number) {
  let r = RANKS[0]
  for (const rank of RANKS) { if (xp >= rank.minXp) r = rank; else break }
  return r
}
function getNextRank(xp: number) { return RANKS.find(r => r.minXp > xp) || null }
function todayStr() { return new Date().toISOString().slice(0, 10) }
function pickTrials(done: string[]): string[] {
  const pool = TRIALS.filter(t => !t.minDays && !done.includes(t.id))
  const actual = pool.length >= 3 ? pool : TRIALS.filter(t => !t.minDays)
  return [...actual].sort(() => Math.random() - 0.5).slice(0, 3).map(t => t.id)
}

export default function TrialSection({ user, locale, onBack }: Props) {
  const isKz = locale === 'kz'
  const days = Math.floor((Date.now() - new Date(user.createdAt).getTime()) / 86400000)
  const [state, setState] = useState<State>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || 'null') ?? { completedIds: [], todayIds: [], todayDate: '', xp: 0 } }
    catch { return { completedIds: [], todayIds: [], todayDate: '', xp: 0 } }
  })
  const [tab, setTab] = useState<Tab>('today')
  const [xpFlash, setXpFlash] = useState<number | null>(null)
  const [confirming, setConfirming] = useState<string | null>(null)

  useEffect(() => {
    if (state.todayDate !== todayStr() || state.todayIds.length === 0) {
      const ids = pickTrials(state.completedIds)
      const next = { ...state, todayIds: ids, todayDate: todayStr() }
      setState(next); localStorage.setItem(KEY, JSON.stringify(next))
    }
  }, [])

  function complete(id: string, xp: number) {
    setXpFlash(xp); setTimeout(() => setXpFlash(null), 2000)
    setConfirming(null)
    const next = { ...state, completedIds: [...state.completedIds, id], xp: state.xp + xp }
    setState(next); localStorage.setItem(KEY, JSON.stringify(next))
  }

  const rank = getRank(state.xp)
  const nextRank = getNextRank(state.xp)
  const rankPct = nextRank ? Math.min(100, ((state.xp - rank.minXp) / (nextRank.minXp - rank.minXp)) * 100) : 100
  const dailyTrials = state.todayIds.map(id => TRIALS.find(t => t.id === id)).filter(Boolean) as Trial[]
  const todayDone = dailyTrials.filter(t => state.completedIds.includes(t.id)).length
  const pathTrials = TRIALS.filter(t => t.minDays !== undefined).sort((a, b) => (a.minDays || 0) - (b.minDays || 0))

  const tabs = [
    { id: 'today', emoji: '⚔️', ru: 'Сегодня', kz: 'Бүгін' },
    { id: 'path',  emoji: '🗺', ru: 'Путь',    kz: 'Жол'   },
    { id: 'rank',  emoji: '👑', ru: 'Ранг',    kz: 'Дәреже' },
  ]

  return (
    <SectionShell locale={locale} title={isKz ? 'Сынақтар' : 'Испытания'} icon="⚔️" onBack={onBack} accentColor="rgba(248,113,113,0.55)">
      <style>{`
        @keyframes xpPop { 0%{opacity:0;transform:translate(-50%,-50%) scale(0.5)} 20%{opacity:1;transform:translate(-50%,-50%) scale(1.2)} 80%{opacity:1;transform:translate(-50%,-60%) scale(1)} 100%{opacity:0;transform:translate(-50%,-80%) scale(0.8)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .trial-card { transition: all 0.2s ease; }
        .trial-card:hover { transform: translateY(-1px); }
      `}</style>

      {/* XP флэш */}
      {xpFlash && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', zIndex: 999, fontSize: '32px', fontWeight: 900, color: '#ffd060', textShadow: '0 0 20px rgba(255,200,0,0.8)', animation: 'xpPop 2s ease forwards', pointerEvents: 'none', whiteSpace: 'nowrap' }}>
          ⚡ +{xpFlash} XP
        </div>
      )}

      <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%', paddingBottom: '80px' }}>

        {/* КАРТОЧКА РАНГА */}
        <div style={{ margin: '16px 16px 0', padding: '20px', borderRadius: '24px', background: `linear-gradient(135deg, ${rank.color}12, ${rank.color}06)`, border: `1px solid ${rank.color}35`, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-30px', right: '-30px', fontSize: '80px', opacity: 0.08, pointerEvents: 'none' }}>{rank.emoji}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: `${rank.color}20`, border: `2px solid ${rank.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', boxShadow: `0 0 20px ${rank.color}30` }}>
              {rank.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '18px', fontWeight: 900, color: rank.color, lineHeight: 1 }}>
                {isKz ? rank.kz : rank.ru}
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '3px' }}>
                {isKz ? `${rank.level}-деңгей` : `${rank.level} уровень`}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#ffd060', lineHeight: 1 }}>{state.xp.toLocaleString()}</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.30)', marginTop: '2px' }}>XP</div>
            </div>
          </div>
          {nextRank && (
            <>
              <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.07)', overflow: 'hidden', marginBottom: '6px' }}>
                <div style={{ height: '100%', width: `${rankPct}%`, background: `linear-gradient(90deg, ${rank.color}80, ${rank.color})`, borderRadius: '3px', transition: 'width 1s ease', boxShadow: `0 0 8px ${rank.color}60` }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'rgba(255,255,255,0.25)' }}>
                <span>{state.xp} XP</span>
                <span style={{ color: nextRank.color }}>{nextRank.emoji} {isKz ? nextRank.kz : nextRank.ru} — {nextRank.minXp} XP</span>
              </div>
            </>
          )}
        </div>

        {/* ТАБЫ */}
        <div style={{ display: 'flex', margin: '12px 16px 0', background: 'rgba(255,255,255,0.04)', borderRadius: '16px', padding: '4px', gap: '4px' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id as Tab)}
              style={{ flex: 1, padding: '10px', borderRadius: '12px', border: 'none', background: tab === t.id ? 'rgba(248,113,113,0.18)' : 'transparent', color: tab === t.id ? '#f87171' : 'rgba(255,255,255,0.35)', fontSize: '11px', fontWeight: tab === t.id ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', transition: 'all 0.2s' }}>
              <span style={{ fontSize: '18px' }}>{t.emoji}</span>
              {isKz ? (t.id === 'today' ? t.kz : t.id === 'path' ? t.kz : t.kz) : t.ru}
            </button>
          ))}
        </div>

        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

          {/* ═══ СЕГОДНЯ ═══ */}
          {tab === 'today' && (
            <>
              {/* Прогресс дня */}
              <div style={{ padding: '16px', borderRadius: '20px', background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.20)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: todayDone === 3 ? '#6fcf8e' : 'rgba(255,255,255,0.70)' }}>
                    {todayDone === 3
                      ? (isKz ? '🏆 Бүгінгі барлық сынақтар орындалды!' : '🏆 Все испытания дня пройдены!')
                      : (isKz ? '⚔️ Бүгінгі сынақтар' : '⚔️ Испытания дня')}
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: 900, color: todayDone === 3 ? '#6fcf8e' : '#f87171' }}>
                    {todayDone}/3
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ flex: 1, height: '5px', borderRadius: '3px', background: i < todayDone ? '#6fcf8e' : 'rgba(255,255,255,0.08)', transition: 'background 0.5s', boxShadow: i < todayDone ? '0 0 8px rgba(111,207,142,0.50)' : 'none' }} />
                  ))}
                </div>
              </div>

              {dailyTrials.map(trial => {
                const done = state.completedIds.includes(trial.id)
                const conf = confirming === trial.id
                const d = DIFF[trial.difficulty]
                const c = CAT[trial.category]
                return (
                  <div key={trial.id} className="trial-card"
                    style={{ borderRadius: '20px', border: `1px solid ${done ? 'rgba(111,207,142,0.30)' : conf ? d.color + '50' : 'rgba(255,255,255,0.08)'}`, background: done ? 'rgba(111,207,142,0.06)' : conf ? d.bg : 'rgba(255,255,255,0.03)', overflow: 'hidden', animation: 'fadeUp 0.3s ease', opacity: done ? 0.8 : 1 }}>
                    <div style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: done ? 'rgba(111,207,142,0.15)' : `${d.color}15`, border: `1px solid ${done ? 'rgba(111,207,142,0.30)' : d.color + '30'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
                          {done ? '✓' : trial.emoji}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '14px', fontWeight: 700, color: done ? '#6fcf8e' : 'rgba(255,255,255,0.90)', textDecoration: done ? 'line-through' : 'none' }}>
                              {isKz ? trial.titleKz : trial.titleRu}
                            </span>
                            <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '8px', background: d.bg, color: d.color, fontWeight: 700 }}>
                              {isKz ? (trial.difficulty === 'easy' ? 'Жеңіл' : trial.difficulty === 'medium' ? 'Орташа' : trial.difficulty === 'hard' ? 'Ауыр' : 'Аңыздық') : d.ru}
                            </span>
                          </div>
                          <p style={{ margin: '0 0 8px', fontSize: '12px', color: 'rgba(255,255,255,0.50)', lineHeight: 1.5 }}>
                            {isKz ? trial.descKz : trial.descRu}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>
                              {c.emoji} {isKz ? c.kz : c.ru}
                            </span>
                            <span style={{ marginLeft: 'auto', fontSize: '13px', fontWeight: 800, color: done ? 'rgba(111,207,142,0.60)' : '#ffd060' }}>
                              +{trial.xp} XP
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {!done && (
                      <div style={{ padding: '0 16px 16px' }}>
                        <button
                          onClick={() => { if (!conf) { setConfirming(trial.id) } else { complete(trial.id, trial.xp) } }}
                          style={{ width: '100%', padding: '11px', borderRadius: '14px', border: `1px solid ${conf ? d.color : 'rgba(255,255,255,0.08)'}`, background: conf ? d.bg : 'rgba(255,255,255,0.04)', color: conf ? d.color : 'rgba(255,255,255,0.35)', fontSize: '13px', fontWeight: conf ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                          {conf
                            ? (isKz ? '✓ Дайын! Тастап растау' : '✓ Выполнено! Нажми ещё раз')
                            : (isKz ? 'Орындалды деп белгілеу' : 'Отметить выполненным')}
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}

              <p style={{ margin: 0, textAlign: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.20)', lineHeight: 1.6 }}>
                {isKz ? '⚔️ Испытания обновляются каждый день. Нажми дважды для отметки.' : '⚔️ Испытания обновляются каждый день. Нажми дважды для отметки.'}
              </p>
            </>
          )}

          {/* ═══ ПУТЬ ═══ */}
          {tab === 'path' && (
            <>
              <div style={{ padding: '14px 16px', borderRadius: '16px', background: 'rgba(167,139,250,0.07)', border: '1px solid rgba(167,139,250,0.18)', fontSize: '12px', color: 'rgba(200,180,255,0.65)', lineHeight: 1.6 }}>
                🗺 {isKz ? 'Жол сынақтары — трезвостьтің белгілі күндерінде ашылады.' : 'Испытания пути — открываются в особые дни трезвости. Даются один раз.'}
              </div>

              {pathTrials.map(trial => {
                const locked = days < (trial.minDays || 0)
                const done = state.completedIds.includes(trial.id)
                const conf = confirming === trial.id
                const daysLeft = Math.max(0, (trial.minDays || 0) - days)
                const d = DIFF[trial.difficulty]
                return (
                  <div key={trial.id} style={{ borderRadius: '20px', border: `1px solid ${done ? 'rgba(111,207,142,0.25)' : locked ? 'rgba(255,255,255,0.05)' : d.color + '40'}`, background: done ? 'rgba(111,207,142,0.05)' : locked ? 'rgba(255,255,255,0.02)' : d.bg, opacity: locked ? 0.5 : 1, overflow: 'hidden', animation: 'fadeUp 0.3s ease' }}>
                    {locked && (
                      <div style={{ padding: '8px 16px 0', fontSize: '10px', color: 'rgba(255,255,255,0.30)' }}>
                        🔒 {isKz ? `${daysLeft} күн қалды` : `Осталось ${daysLeft} дней`}
                      </div>
                    )}
                    <div style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${d.color}15`, border: `1px solid ${d.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0, filter: locked ? 'grayscale(1)' : 'none' }}>
                          {done ? '✓' : locked ? '🔒' : trial.emoji}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '14px', fontWeight: 700, color: done ? '#6fcf8e' : locked ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.90)' }}>
                              {isKz ? trial.titleKz : trial.titleRu}
                            </span>
                            <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '8px', background: d.bg, color: d.color, fontWeight: 700 }}>
                              {isKz ? 'Аңыздық' : d.ru}
                            </span>
                          </div>
                          <p style={{ margin: '0 0 8px', fontSize: '12px', color: 'rgba(255,255,255,0.50)', lineHeight: 1.5 }}>
                            {isKz ? trial.descKz : trial.descRu}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>
                              📅 {isKz ? `${trial.minDays} күн` : `День ${trial.minDays}`}
                            </span>
                            <span style={{ marginLeft: 'auto', fontSize: '14px', fontWeight: 900, color: done ? 'rgba(111,207,142,0.60)' : '#ffd060' }}>
                              +{trial.xp} XP
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {!done && !locked && (
                      <div style={{ padding: '0 16px 16px' }}>
                        <button
                          onClick={() => { if (!conf) { setConfirming(trial.id) } else { complete(trial.id, trial.xp) } }}
                          style={{ width: '100%', padding: '11px', borderRadius: '14px', border: `1px solid ${conf ? d.color : 'rgba(255,255,255,0.08)'}`, background: conf ? d.bg : 'rgba(255,255,255,0.04)', color: conf ? d.color : 'rgba(255,255,255,0.35)', fontSize: '13px', fontWeight: conf ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                          {conf ? (isKz ? '✓ Тастап растау' : '✓ Нажми ещё раз') : (isKz ? 'Орындалды' : 'Отметить')}
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </>
          )}

          {/* ═══ РАНГ ═══ */}
          {tab === 'rank' && (
            <>
              {/* Статистика */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[
                  { emoji: '⚔️', value: state.completedIds.length, ru: 'Пройдено', kz: 'Өтілді', color: '#f87171' },
                  { emoji: '⚡', value: state.xp, ru: 'Всего XP', kz: 'Барлық XP', color: '#ffd060' },
                  { emoji: '📅', value: days, ru: 'Дней пути', kz: 'Жол күні', color: '#60c5fa' },
                  { emoji: '🎯', value: TRIALS.length, ru: 'Всего испытаний', kz: 'Барлық сынақ', color: '#6fcf8e' },
                ].map((s, i) => (
                  <div key={i} style={{ padding: '18px', borderRadius: '20px', background: `${s.color}08`, border: `1px solid ${s.color}20`, textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', marginBottom: '6px' }}>{s.emoji}</div>
                    <div style={{ fontSize: '28px', fontWeight: 900, color: s.color, fontVariantNumeric: 'tabular-nums' }}>{s.value.toLocaleString()}</div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.30)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{isKz ? s.kz : s.ru}</div>
                  </div>
                ))}
              </div>

              {/* Таблица рангов */}
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.12em', textTransform: 'uppercase', paddingLeft: '4px', marginTop: '4px' }}>
                🏆 {isKz ? 'Дәрежелер кестесі' : 'Таблица рангов'}
              </div>

              {RANKS.map(r => {
                const isCurrent = r.level === rank.level
                const isPassed = state.xp >= r.minXp
                return (
                  <div key={r.level} style={{ padding: '14px 16px', borderRadius: '18px', background: isCurrent ? `${r.color}12` : 'rgba(255,255,255,0.03)', border: `1px solid ${isCurrent ? r.color + '50' : 'rgba(255,255,255,0.06)'}`, display: 'flex', alignItems: 'center', gap: '14px', opacity: isPassed || isCurrent ? 1 : 0.40, animation: 'fadeUp 0.3s ease' }}>
                    <span style={{ fontSize: '24px', filter: isCurrent ? `drop-shadow(0 0 8px ${r.color})` : 'none' }}>{r.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: isCurrent ? 800 : 500, color: isCurrent ? r.color : 'rgba(255,255,255,0.65)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isKz ? r.kz : r.ru}
                        {isCurrent && <span style={{ fontSize: '9px', padding: '2px 8px', borderRadius: '8px', background: `${r.color}25`, color: r.color, fontWeight: 700 }}>{isKz ? 'ҚАЗІР' : 'СЕЙЧАС'}</span>}
                      </div>
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.28)', marginTop: '2px' }}>
                        {isKz ? `${r.level}-деңгей` : `Уровень ${r.level}`}
                      </div>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: isPassed ? r.color : 'rgba(255,255,255,0.20)', fontVariantNumeric: 'tabular-nums' }}>
                      {r.minXp.toLocaleString()} XP
                      {isPassed && !isCurrent && <span style={{ marginLeft: '4px', color: '#6fcf8e' }}>✓</span>}
                    </div>
                  </div>
                )
              })}
            </>
          )}
        </div>
      </div>
    </SectionShell>
  )
}