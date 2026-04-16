'use client'
import { useState, useEffect } from 'react'

interface Props {
  locale: 'ru' | 'kz'
  onComplete: () => void
}

const STEPS = [
  {
    id: 'welcome',
    ru: {
      badge: '✦ Ұлы Дала Жолы',
      title: 'Ты нашёл\nэто место.',
      subtitle: 'Не случайно.',
      desc: 'Здесь тысячи людей нашли путь назад — к себе. Без осуждения. Без огласки. С поддержкой.',
      cta: 'Продолжить',
      skip: null,
    },
    kz: {
      badge: '✦ Ұлы Дала Жолы',
      title: 'Сен бұл жерді\nтапқансың.',
      subtitle: 'Кездейсоқ емес.',
      desc: 'Мұнда мыңдаған адам өз жолын тапты — өздеріне қайтып. Сотсыз. Жасырын. Қолдаумен.',
      cta: 'Жалғастыру',
      skip: null,
    }
  },
  {
    id: 'what',
    ru: {
      badge: '01 / 03',
      title: 'Это не\nприложение.',
      subtitle: 'Это путь.',
      desc: 'Дневник свободы. AI-наставник. Живое сообщество. Карта проверенных центров. Всё — в одном месте.',
      cta: 'Понятно',
      skip: 'Пропустить',
    },
    kz: {
      badge: '01 / 03',
      title: 'Бұл қолданба\nемес.',
      subtitle: 'Бұл жол.',
      desc: 'Еркіндік күнделігі. ИИ-наставник. Тірі қауымдастық. Тексерілген орталықтар картасы. Бәрі — бір жерде.',
      cta: 'Түсінікті',
      skip: 'Өткізу',
    }
  },
  {
    id: 'who',
    ru: {
      badge: '02 / 03',
      title: 'Для тех кто\nустал бороться\nв одиночку.',
      subtitle: '',
      desc: 'Неважно с чем ты борешься. Неважно сколько раз ты пробовал. Важно что ты здесь — прямо сейчас.',
      cta: 'Это про меня',
      skip: 'Пропустить',
    },
    kz: {
      badge: '02 / 03',
      title: 'Жалғыз күресуден\nшаршағандар\nүшін.',
      subtitle: '',
      desc: 'Неімен күресетінің маңызды емес. Неше рет байқағаның маңызды емес. Маңыздысы — сен қазір осындасың.',
      cta: 'Бұл мен туралы',
      skip: 'Өткізу',
    }
  },
  {
    id: 'promise',
    ru: {
      badge: '03 / 03',
      title: 'Анонимно.\nБесплатно.\nНа казахском.',
      subtitle: '',
      desc: 'Никакой регистрации по номеру. Никакой огласки. Твои данные — только твои. Мы рядом 24/7.',
      cta: 'Войти в степь →',
      skip: null,
    },
    kz: {
      badge: '03 / 03',
      title: 'Анонимді.\nТегін.\nҚазақша.',
      subtitle: '',
      desc: 'Нөмір бойынша тіркелу жоқ. Жария ету жоқ. Деректерің — тек сенікі. Біз жанында 24/7.',
      cta: 'Далаға кіру →',
      skip: null,
    }
  }
]

const ONBOARD_KEY = 'ashyq_onboarded_v2'

export default function OnboardingScreen({ locale, onComplete }: Props) {
  const isKz = locale === 'kz'
  const [step, setStep] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [direction, setDirection] = useState<'in' | 'out'>('in')
  const [particles, setParticles] = useState<{ x: number; y: number; size: number; opacity: number; speed: number }[]>([])

  useEffect(() => {
    setParticles(Array.from({ length: 20 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 3 + 2,
    })))
  }, [])

  function next() {
    if (animating) return
    if (step < STEPS.length - 1) {
      setAnimating(true)
      setDirection('out')
      setTimeout(() => {
        setStep(s => s + 1)
        setDirection('in')
        setTimeout(() => setAnimating(false), 400)
      }, 300)
    } else {
      finish()
    }
  }

  function finish() {
    localStorage.setItem(ONBOARD_KEY, '1')
    onComplete()
  }

  const current = STEPS[step]
  const content = isKz ? current.kz : current.ru
  const progress = ((step + 1) / STEPS.length) * 100

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, overflow: 'hidden' }}>
      <style>{`
        @keyframes ob_in { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes ob_out { from { opacity:1; transform:translateY(0); } to { opacity:0; transform:translateY(-20px); } }
        @keyframes particleFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        @keyframes gradientShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes glowPulse { 0%,100%{opacity:0.4} 50%{opacity:0.8} }
        @keyframes lineGrow { from{width:0} to{width:100%} }
        .ob-cta:hover { transform: scale(1.02) !important; box-shadow: 0 8px 32px rgba(255,180,0,0.40) !important; }
        .ob-skip:hover { color: rgba(255,255,255,0.60) !important; }
      `}</style>

      {/* Фон — градиент степи */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #0a0612 0%, #0d0a1a 30%, #0a1208 60%, #080510 100%)', backgroundSize: '400% 400%', animation: 'gradientShift 12s ease infinite' }} />

      {/* Частицы */}
      {particles.map((p, i) => (
        <div key={i} style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, width: `${p.size}px`, height: `${p.size}px`, borderRadius: '50%', background: i % 3 === 0 ? 'rgba(255,200,60,0.70)' : i % 3 === 1 ? 'rgba(111,207,142,0.50)' : 'rgba(167,139,250,0.40)', opacity: p.opacity, animation: `particleFloat ${p.speed}s ease-in-out infinite ${i * 0.3}s`, pointerEvents: 'none' }} />
      ))}

      {/* Световое пятно */}
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,180,0,0.06), rgba(100,200,100,0.03), transparent 70%)', animation: 'glowPulse 4s ease-in-out infinite', pointerEvents: 'none' }} />

      {/* Контент */}
      <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '48px 28px 52px', maxWidth: '440px', margin: '0 auto', boxSizing: 'border-box' }}>

        {/* Прогресс */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{ height: '2px', borderRadius: '1px', background: i <= step ? 'rgba(255,200,60,0.80)' : 'rgba(255,255,255,0.12)', transition: 'all 0.4s ease', width: i === step ? '24px' : '8px' }} />
            ))}
          </div>

          {/* Бейдж */}
          <div style={{ fontSize: '10px', color: 'rgba(255,200,60,0.55)', letterSpacing: '0.20em', textTransform: 'uppercase', fontWeight: 600 }}>
            {content.badge}
          </div>
        </div>

        {/* Центральный блок */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', animation: `${direction === 'in' ? 'ob_in' : 'ob_out'} 0.35s ease forwards` }}>

          {/* Иконка шага */}
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
            {step === 0 && <div style={{ fontSize: '56px', filter: 'drop-shadow(0 0 20px rgba(255,200,0,0.50))', animation: 'particleFloat 3s ease-in-out infinite' }}>✦</div>}
            {step === 1 && <div style={{ fontSize: '56px', filter: 'drop-shadow(0 0 20px rgba(111,207,142,0.50))', animation: 'particleFloat 3s ease-in-out infinite' }}>🗺</div>}
            {step === 2 && <div style={{ fontSize: '56px', filter: 'drop-shadow(0 0 20px rgba(167,139,250,0.50))', animation: 'particleFloat 3s ease-in-out infinite' }}>🤝</div>}
            {step === 3 && <div style={{ fontSize: '56px', filter: 'drop-shadow(0 0 20px rgba(96,197,250,0.50))', animation: 'particleFloat 3s ease-in-out infinite' }}>🔒</div>}
          </div>

          {/* Заголовок */}
          <h1 style={{ margin: '0 0 8px', fontSize: 'clamp(2rem, 6vw, 2.6rem)', fontWeight: 900, color: 'white', lineHeight: 1.15, textAlign: 'center', whiteSpace: 'pre-line', letterSpacing: '-0.01em' }}>
            {content.title}
          </h1>

          {/* Подзаголовок */}
          {content.subtitle && (
            <p style={{ margin: '0 0 20px', fontSize: '1.1rem', fontWeight: 600, color: 'rgba(255,200,60,0.80)', textAlign: 'center' }}>
              {content.subtitle}
            </p>
          )}

          {/* Разделитель */}
          <div style={{ width: '40px', height: '2px', background: 'linear-gradient(to right, transparent, rgba(255,200,60,0.60), transparent)', margin: '16px auto', borderRadius: '1px' }} />

          {/* Описание */}
          <p style={{ margin: 0, fontSize: 'clamp(0.90rem, 2.5vw, 1rem)', color: 'rgba(255,255,255,0.60)', textAlign: 'center', lineHeight: 1.70 }}>
            {content.desc}
          </p>

          {/* Шаг 0 — дополнительные факты */}
          {step === 0 && (
            <div style={{ display: 'flex', gap: '12px', marginTop: '28px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { emoji: '🔒', text: isKz ? 'Анонимді' : 'Анонимно' },
                { emoji: '🆓', text: isKz ? 'Тегін' : 'Бесплатно' },
                { emoji: '🌍', text: isKz ? 'Қазақша' : 'На казахском' },
                { emoji: '24/7', text: isKz ? 'Жанында' : 'Рядом' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize: '14px' }}>{item.emoji}</span>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>{item.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* Шаг 1 — функции */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '24px' }}>
              {[
                { emoji: '🔥', ru: 'AI Ақсақал — наставник 24/7', kz: 'AI Ақсақал — наставник 24/7' },
                { emoji: '🗺', ru: 'Дневник пути и прогресс', kz: 'Жол күнделігі және прогресс' },
                { emoji: '🏕', ru: 'Живое сообщество в ауле', kz: 'Тірі қауымдастық ауылда' },
                { emoji: '📍', ru: 'Карта проверенных центров', kz: 'Тексерілген орталықтар картасы' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <span style={{ fontSize: '20px' }}>{item.emoji}</span>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.70)', fontWeight: 500 }}>{isKz ? item.kz : item.ru}</span>
                </div>
              ))}
            </div>
          )}

          {/* Шаг 2 — статистика */}
          {step === 2 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '24px' }}>
              {[
                { num: '1 из 7', ru: 'казахстанцев сталкивается с зависимостью', kz: 'қазақстандықтар тәуелділікке тап болады' },
                { num: '87%', ru: 'не обращаются за помощью из-за стыда', kz: 'ұялып көмек сұрамайды' },
                { num: '3x', ru: 'эффективнее с поддержкой сообщества', kz: 'қауымдастық қолдауымен тиімдірек' },
                { num: '24/7', ru: 'AI наставник всегда рядом', kz: 'ИИ наставник әрқашан жанында' },
              ].map((item, i) => (
                <div key={i} style={{ padding: '14px', borderRadius: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', textAlign: 'center' }}>
                  <div style={{ fontSize: '22px', fontWeight: 900, color: i === 0 ? '#f87171' : i === 1 ? '#ffd060' : i === 2 ? '#6fcf8e' : '#60c5fa', marginBottom: '4px' }}>{item.num}</div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.40)', lineHeight: 1.4 }}>{isKz ? item.kz : item.ru}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Кнопки */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          <button className="ob-cta" onClick={next}
            style={{ width: '100%', padding: '16px', borderRadius: '20px', border: 'none', background: step === STEPS.length - 1 ? 'linear-gradient(135deg, rgba(255,200,60,0.95), rgba(255,140,0,0.90))' : 'rgba(255,255,255,0.10)', color: step === STEPS.length - 1 ? '#1a0800' : 'white', fontSize: '15px', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.03em', transition: 'all 0.25s ease', backdropFilter: 'blur(8px)', border: step === STEPS.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.15)' as any }}>
            {content.cta}
          </button>

          {content.skip && (
            <button className="ob-skip" onClick={finish}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.30)', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', padding: '4px', transition: 'color 0.2s' }}>
              {content.skip}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}