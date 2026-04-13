'use client'
import { useState, useEffect, useMemo } from 'react'
import SectionShell from '@/components/SectionShell'
import type { UserProfile } from '@/hooks/useAuth'

interface Props { user: UserProfile | null; locale: string; onBack: () => void }

type BranchId = 'sleep' | 'water' | 'breath' | 'move' | 'calm'

const BRANCHES = [
  { id: 'sleep' as BranchId, emoji: '🌙', ru: 'Сон', kz: 'Ұйқы', desc_ru: 'часов', desc_kz: 'сағат', target: 8, max: 12, color: '#a78bfa' },
  { id: 'water' as BranchId, emoji: '💧', ru: 'Вода', kz: 'Су', desc_ru: 'стаканов', desc_kz: 'стақан', target: 8, max: 12, color: '#60c5fa' },
  { id: 'breath' as BranchId, emoji: '🍃', ru: 'Дыхание', kz: 'Тыныс', desc_ru: 'минут', desc_kz: 'мин', target: 10, max: 30, color: '#6fcf8e' },
  { id: 'move' as BranchId, emoji: '🚶', ru: 'Движение', kz: 'Қозғалыс', desc_ru: 'минут', desc_kz: 'мин', target: 30, max: 60, color: '#ffd060' },
  { id: 'calm' as BranchId, emoji: '🕊', ru: 'Покой', kz: 'Тыныштық', desc_ru: 'минут', desc_kz: 'мин', target: 15, max: 30, color: '#f4a261' },
]

const NEURO = [
  { id: 'dopamine', emoji: '⚡', ru: 'Дофамин', kz: 'Дофамин', desc_ru: 'Мотивация и удовольствие', desc_kz: 'Мотивация және рахат', phases: [3, 14, 40, 90] },
  { id: 'serotonin', emoji: '🌅', ru: 'Серотонин', kz: 'Серотонин', desc_ru: 'Покой, сон, настроение', desc_kz: 'Тыныштық, ұйқы, көңіл', phases: [7, 21, 60] },
  { id: 'endorphin', emoji: '🔥', ru: 'Эндорфин', kz: 'Эндорфин', desc_ru: 'Радость и эйфория', desc_kz: 'Қуаныш және эйфория', phases: [5, 20, 50] },
  { id: 'gaba', emoji: '🌊', ru: 'ГАМК', kz: 'ГАМҚ', desc_ru: 'Антистресс и торможение', desc_kz: 'Антистресс және тежеу', phases: [10, 30, 90] },
  { id: 'oxytocin', emoji: '🤝', ru: 'Окситоцин', kz: 'Окситоцин', desc_ru: 'Доверие и тепло', desc_kz: 'Сенім және жылылық', phases: [7, 30] },
]

const TREE_KEY = 'ashyq_tree_v2'
const todayStr = () => new Date().toISOString().slice(0, 10)

function getNeuroLevel(days: number, phases: number[]): number {
  const maxPhase = phases[phases.length - 1]
  return Math.min(95, Math.round((days / maxPhase) * 80) + 15)
}

function getNeuroColor(level: number): string {
  if (level >= 75) return '#6fcf8e'
  if (level >= 50) return '#ffd060'
  if (level >= 30) return '#f4a261'
  return '#f87171'
}

export default function TreeSection({ user, locale, onBack }: Props) {
  const isKz = locale === 'kz'
  const days = user ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / 86400000) : 0
  const [tab, setTab] = useState<'tree' | 'neuro'>('tree')
  const [values, setValues] = useState<Record<BranchId, number>>({ sleep: 0, water: 0, breath: 0, move: 0, calm: 0 })
  const [expandedNeuro, setExpandedNeuro] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem(TREE_KEY)
    if (saved) {
      const data = JSON.parse(saved)
      if (data.date === todayStr()) setValues(data.values)
    }
  }, [])

  function handleChange(id: BranchId, val: number) {
    const next = { ...values, [id]: val }
    setValues(next)
    localStorage.setItem(TREE_KEY, JSON.stringify({ date: todayStr(), values: next }))
  }

  const score = useMemo(() => {
    const total = BRANCHES.reduce((s, b) => s + Math.min(values[b.id], b.target) / b.target, 0)
    return total / BRANCHES.length
  }, [values])

  const leafCount = Math.round(score * 12)
  const treeColor = score > 0.7 ? '#6fcf8e' : score > 0.4 ? '#ffd060' : '#60c5fa'

  const tabs = [
    { id: 'tree', emoji: '🌳', ru: 'Здоровье', kz: 'Денсаулық' },
    { id: 'neuro', emoji: '🧬', ru: 'Нейро', kz: 'Нейро' },
  ]

  return (
    <SectionShell locale={locale as any} title={isKz ? 'Өмір Ағашы' : 'Древо Жизни'} icon="🌳" onBack={onBack} accentColor="rgba(111,207,142,0.6)">
      <style>{`
        @keyframes leafSway { 0%,100%{transform:rotate(-3deg)} 50%{transform:rotate(3deg)} }
        @keyframes glowPulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
        .branch-slider { -webkit-appearance:none; appearance:none; width:100%; height:5px; border-radius:3px; outline:none; cursor:pointer; }
        .branch-slider::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; border-radius:50%; cursor:pointer; border:2px solid rgba(255,255,255,0.3); }
      `}</style>

      <div style={{ maxWidth: '560px', margin: '0 auto', width: '100%', paddingBottom: '80px' }}>

        {/* ВИЗУАЛЬНОЕ ДЕРЕВО */}
        <div style={{ margin: '16px 16px 0', padding: '24px 20px', borderRadius: '24px', background: 'linear-gradient(160deg, rgba(10,30,15,0.90), rgba(5,20,10,0.95))', border: '1px solid rgba(111,207,142,0.15)', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
          
          {/* Свечение фона */}
          <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '200px', height: '150px', background: `radial-gradient(ellipse, ${treeColor}20, transparent 70%)`, animation: 'glowPulse 3s ease-in-out infinite', pointerEvents: 'none' }} />

          {/* SVG Дерево */}
          <svg viewBox="0 0 200 180" style={{ width: '100%', maxWidth: '220px', margin: '0 auto', display: 'block', filter: `drop-shadow(0 0 12px ${treeColor}40)` }}>
            {/* Тень */}
            <ellipse cx="100" cy="172" rx={15 + score * 30} ry="5" fill={treeColor} opacity={0.15} />
            {/* Ствол */}
            <rect x="94" y="110" width="12" height="62" rx="6" fill={`${treeColor}60`} />
            {/* Ветки */}
            {score > 0.15 && <line x1="100" y1="130" x2="72" y2="108" stroke={`${treeColor}70`} strokeWidth="4" strokeLinecap="round" />}
            {score > 0.15 && <line x1="100" y1="130" x2="128" y2="108" stroke={`${treeColor}70`} strokeWidth="4" strokeLinecap="round" />}
            {score > 0.35 && <line x1="100" y1="118" x2="65" y2="90" stroke={`${treeColor}65`} strokeWidth="3" strokeLinecap="round" />}
            {score > 0.35 && <line x1="100" y1="118" x2="135" y2="90" stroke={`${treeColor}65`} strokeWidth="3" strokeLinecap="round" />}
            {score > 0.55 && <line x1="100" y1="105" x2="78" y2="75" stroke={`${treeColor}55`} strokeWidth="2.5" strokeLinecap="round" />}
            {score > 0.55 && <line x1="100" y1="105" x2="122" y2="75" stroke={`${treeColor}55`} strokeWidth="2.5" strokeLinecap="round" />}
            {/* Листья */}
            {[
              {cx:72,cy:100,r:14}, {cx:128,cy:100,r:14}, {cx:100,cy:90,r:16},
              {cx:60,cy:82,r:12}, {cx:140,cy:82,r:12}, {cx:85,cy:72,r:13},
              {cx:115,cy:72,r:13}, {cx:100,cy:62,r:15}, {cx:70,cy:65,r:11},
              {cx:130,cy:65,r:11}, {cx:100,cy:48,r:13}, {cx:88,cy:52,r:10},
            ].slice(0, leafCount).map((l, i) => (
              <ellipse key={i} cx={l.cx} cy={l.cy} rx={l.r} ry={l.r * 0.75}
                fill={treeColor} opacity={0.35 + (i / 12) * 0.3}
                style={{ animation: `leafSway ${2 + i * 0.3}s ease-in-out infinite ${i * 0.2}s` }}
              />
            ))}
            {/* Верхушка со свечением */}
            {score > 0.6 && (
              <circle cx="100" cy="42" r="8" fill={treeColor} opacity={0.5}
                style={{ animation: 'glowPulse 2s ease-in-out infinite' }}
              />
            )}
          </svg>

          {/* Процент */}
          <div style={{ marginTop: '12px' }}>
            <div style={{ fontSize: '36px', fontWeight: 900, color: treeColor, lineHeight: 1, textShadow: `0 0 20px ${treeColor}60` }}>
              {Math.round(score * 100)}%
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: '4px' }}>
              {isKz ? 'Бүгінгі өсім' : 'Рост за сегодня'}
            </div>
          </div>
        </div>

        {/* ТАБЫ */}
        <div style={{ display: 'flex', margin: '16px 16px 0', borderRadius: '16px', background: 'rgba(255,255,255,0.04)', padding: '4px', gap: '4px' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id as any)}
              style={{ flex: 1, padding: '10px', borderRadius: '12px', border: 'none', background: tab === t.id ? 'rgba(111,207,142,0.18)' : 'transparent', color: tab === t.id ? '#6fcf8e' : 'rgba(255,255,255,0.35)', fontSize: '13px', fontWeight: tab === t.id ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s' }}>
              <span>{t.emoji}</span>
              {isKz ? (t.id === 'tree' ? t.kz : t.kz) : t.ru}
            </button>
          ))}
        </div>

        {/* ТАБ: ЗДОРОВЬЕ */}
        {tab === 'tree' && (
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {BRANCHES.map(branch => {
              const val = values[branch.id]
              const pct = Math.min(100, (val / branch.target) * 100)
              const done = val >= branch.target
              return (
                <div key={branch.id} style={{ padding: '16px', borderRadius: '20px', background: done ? `${branch.color}0a` : 'rgba(255,255,255,0.03)', border: `1px solid ${done ? branch.color + '35' : 'rgba(255,255,255,0.07)'}`, transition: 'all 0.3s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '22px' }}>{branch.emoji}</span>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: done ? branch.color : 'rgba(255,255,255,0.85)' }}>
                          {isKz ? branch.kz : branch.ru}
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.30)', marginTop: '1px' }}>
                          {isKz ? `Мақсат: ${branch.target} ${branch.desc_kz}` : `Цель: ${branch.target} ${branch.desc_ru}`}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: branch.color, lineHeight: 1 }}>{val}</div>
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)' }}>/ {branch.target}</div>
                    </div>
                  </div>

                  {/* Прогресс бар */}
                  <div style={{ height: '5px', borderRadius: '3px', background: 'rgba(255,255,255,0.07)', marginBottom: '10px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${branch.color}70, ${branch.color})`, borderRadius: '3px', transition: 'width 0.4s ease', boxShadow: done ? `0 0 8px ${branch.color}60` : 'none' }} />
                  </div>

                  {/* Слайдер */}
                  <input
                    type="range"
                    className="branch-slider"
                    min={0}
                    max={branch.max}
                    value={val}
                    onChange={e => handleChange(branch.id, Number(e.target.value))}
                    style={{
                      background: `linear-gradient(to right, ${branch.color} 0%, ${branch.color} ${(val/branch.max)*100}%, rgba(255,255,255,0.10) ${(val/branch.max)*100}%, rgba(255,255,255,0.10) 100%)`,
                    } as any}
                  />
                  <style>{`.branch-slider::-webkit-slider-thumb { background: ${branch.color}; }`}</style>

                  {done && (
                    <div style={{ marginTop: '8px', fontSize: '11px', color: branch.color, fontWeight: 600, textAlign: 'center' }}>
                      ✓ {isKz ? 'Мақсатқа жеттің!' : 'Цель достигнута!'}
                    </div>
                  )}
                </div>
              )
            })}

            {/* Итог дня */}
            <div style={{ padding: '16px', borderRadius: '20px', background: 'rgba(111,207,142,0.07)', border: '1px solid rgba(111,207,142,0.18)', textAlign: 'center' }}>
              <div style={{ fontSize: '13px', color: 'rgba(200,240,210,0.75)', lineHeight: 1.6 }}>
                {score >= 0.8
                  ? (isKz ? '🌟 Керемет! Бүгін сен ағашыңды жақсы суардың.' : '🌟 Отлично! Сегодня ты хорошо позаботился о себе.')
                  : score >= 0.5
                  ? (isKz ? '🌿 Жақсы бастама. Жалғастыр!' : '🌿 Хорошее начало. Продолжай!')
                  : (isKz ? '💧 Бастауға әлі кеш емес. Қазір бастай аласың.' : '💧 Ещё не поздно начать. Можно прямо сейчас.')}
              </div>
            </div>
          </div>
        )}

        {/* ТАБ: НЕЙРО */}
        {tab === 'neuro' && (
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

            <div style={{ padding: '14px 16px', borderRadius: '18px', background: 'rgba(167,139,250,0.07)', border: '1px solid rgba(167,139,250,0.18)', fontSize: '12px', color: 'rgba(200,180,255,0.70)', lineHeight: 1.6 }}>
              🧬 {isKz
                ? `${days} күн тазалықта. Нейрожүйен қалпына келуде. Бұл мотивациялық визуализация.`
                : `${days} дней чистоты. Твоя нейросистема восстанавливается. Это мотивационная визуализация.`}
            </div>

            {NEURO.map(n => {
              const level = getNeuroLevel(days, n.phases)
              const color = getNeuroColor(level)
              const isExpanded = expandedNeuro === n.id
              const nextPhase = n.phases.find(p => p > days)

              return (
                <div key={n.id}
                  onClick={() => setExpandedNeuro(isExpanded ? null : n.id)}
                  style={{ padding: '16px', borderRadius: '20px', background: isExpanded ? `${color}0c` : 'rgba(255,255,255,0.03)', border: `1px solid ${isExpanded ? color + '40' : 'rgba(255,255,255,0.07)'}`, cursor: 'pointer', transition: 'all 0.25s' }}>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '24px' }}>{n.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'rgba(255,255,255,0.88)', marginBottom: '2px' }}>
                        {n.ru}
                      </div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>
                        {isKz ? n.desc_kz : n.desc_ru}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '22px', fontWeight: 900, color, lineHeight: 1 }}>{level}%</div>
                      {nextPhase && (
                        <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.25)', marginTop: '2px' }}>
                          +{isKz ? 'өсу' : 'рост'} {nextPhase} {isKz ? 'күнде' : 'дн.'}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Прогресс */}
                  <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${level}%`, background: `linear-gradient(90deg, ${color}60, ${color})`, borderRadius: '3px', transition: 'width 1s ease', boxShadow: `0 0 8px ${color}50` }} />
                  </div>

                  {/* Фазы */}
                  {isExpanded && (
                    <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {n.phases.map((phase, i) => {
                        const passed = days >= phase
                        return (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '12px', background: passed ? `${color}10` : 'rgba(255,255,255,0.03)', border: `1px solid ${passed ? color + '30' : 'rgba(255,255,255,0.05)'}` }}>
                            <span style={{ fontSize: '14px' }}>{passed ? '✓' : '○'}</span>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '12px', color: passed ? color : 'rgba(255,255,255,0.35)', fontWeight: passed ? 600 : 400 }}>
                                {isKz ? `${phase} күн` : `${phase} дней`}
                              </div>
                            </div>
                            {!passed && (
                              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)' }}>
                                {isKz ? `${phase - days} күн қалды` : `осталось ${phase - days} дн.`}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}

            <div style={{ padding: '14px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', fontSize: '11px', color: 'rgba(255,255,255,0.28)', textAlign: 'center', lineHeight: 1.6 }}>
              {isKz ? '⚠️ Медициналық диагноз емес. Нейробиологиялық зерттеулерге негізделген мотивациялық визуализация.' : '⚠️ Не является медицинским диагнозом. Мотивационная визуализация на основе нейробиологии.'}
            </div>
          </div>
        )}
      </div>
    </SectionShell>
  )
}