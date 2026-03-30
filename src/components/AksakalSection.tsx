'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import SectionShell from '@/components/SectionShell'
import type { UserProfile } from '@/hooks/useAuth'
import type { Locale } from '@/i18n/translations'

// ═══════════════════════════════════════════════════════════════════════════════
// АРХИТЕКТУРА АҚСАҚАЛА
//
// Гибридная система:
// 1. Встроенный движок мудрости (FREE, всегда работает)
//    — 500+ вопросов/ответов по дням пути, настроению, шагам
//    — Логика Сократа: не отвечать, а спрашивать
//
// 2. Anthropic API (когда появится ключ)
//    — Подключается через env: NEXT_PUBLIC_AKSAKAL_API=enabled
//    — Ақсақал получает контекст пользователя и отвечает в его стиле
//
// 3. 12 шагов — встроенная программа
//    — Каждый шаг = своя сессия с Ақсақалом
//    — Вопросы адаптированы под степную философию
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Типы ────────────────────────────────────────────────────────────────────

type ChatMode = 'free' | 'steps'
type MessageRole = 'aksakal' | 'user'

interface Message {
  id: string
  role: MessageRole
  text: string
  timestamp: Date
}

interface Step12 {
  num: number
  titleRu: string
  titleKz: string
  descRu: string
  descKz: string
  questions: { ru: string; kz: string }[]
  wisdomRu: string   // цитата / мудрость для этого шага
  wisdomKz: string
}

// ─── 12 ШАГОВ (адаптированы под философию Великой Степи) ────────────────────

const STEPS_12: Step12[] = [
  {
    num: 1,
    titleRu: 'Признание',
    titleKz: 'Мойындау',
    descRu: 'Я признаю, что потерял власть над зависимостью',
    descKz: 'Мен тәуелділік алдындағы дәрменсіздігімді мойындаймын',
    wisdomRu: 'Батыр знает свои раны. Слабость признанная — уже сила.',
    wisdomKz: 'Батыр жараларын біледі. Мойындалған әлсіздік — күш.',
    questions: [
      { ru: 'Что именно ты теряешь контроль над собой? Как это выглядит изнутри?', kz: 'Өзіңді нені басқара алмайсың? Бұл іштен қалай көрінеді?' },
      { ru: 'Когда впервые понял, что это больше тебя?', kz: 'Мұның сенен күшті екенін бірінші рет қашан сездің?' },
      { ru: 'Что ты теряешь, продолжая отрицать?', kz: 'Жоққа шығаруды жалғастырсаң, не жоғалтасың?' },
    ],
  },
  {
    num: 2,
    titleRu: 'Надежда',
    titleKz: 'Үміт',
    descRu: 'Я верю — есть сила больше меня, которая может помочь',
    descKz: 'Мені қалпына келтіре алатын одан күшті күш бар деп сенемін',
    wisdomRu: 'Степь огромна. Путник один. Но горизонт всегда есть.',
    wisdomKz: 'Дала кең. Жолаушы жалғыз. Бірақ горизонт әрқашан бар.',
    questions: [
      { ru: 'Во что ты верил раньше, до зависимости? Что давало надежду?', kz: 'Тәуелділікке дейін нені сенетің? Не үміт берді?' },
      { ru: 'Если бы ты знал, что выздоровление возможно — что бы изменил завтра?', kz: 'Жазылу мүмкін екенін білсең — ертеңнен не өзгертер едің?' },
      { ru: 'Где ты уже видел чью-то силу в борьбе?', kz: 'Басқаның күрестегі күшін қайда көрдің?' },
    ],
  },
  {
    num: 3,
    titleRu: 'Решение',
    titleKz: 'Шешім',
    descRu: 'Я передаю свою волю на служение пути',
    descKz: 'Мен өз еркімді жолға қызмет етуге тапсырамын',
    wisdomRu: 'Конь слушается всадника. Но сначала всадник учится слушать коня.',
    wisdomKz: 'Жылқы мінушіге бағынады. Бірақ алдымен мінуші жылқыны тыңдауды үйренеді.',
    questions: [
      { ru: 'Что значит для тебя "отпустить контроль"? Это страшно?', kz: 'Сен үшін "бақылауды жіберіп алу" нені білдіреді? Бұл қорқынышты ма?' },
      { ru: 'Кому или чему ты мог бы доверить своё восстановление?', kz: 'Өзіңнің жазылуыңды кімге немесе неге сенімге тапсырар едің?' },
      { ru: 'Какое решение ты готов принять прямо сейчас?', kz: 'Қазір қандай шешім қабылдауға дайынсың?' },
    ],
  },
  {
    num: 4,
    titleRu: 'Инвентарь',
    titleKz: 'Тізімдеу',
    descRu: 'Честный взгляд внутрь — без осуждения, с достоинством',
    descKz: 'Ішке адал қарау — соттамай, қадір-қасиетпен',
    wisdomRu: 'Хороший охотник знает свой лук. Знает, где он слаб.',
    wisdomKz: 'Жақсы аңшы өз садағын біледі. Оның әлсіз жерін біледі.',
    questions: [
      { ru: 'Назови три момента, которых стыдишься. Не для меня — для себя.', kz: 'Ұялатын үш сәтті ата. Менің үшін емес — өзің үшін.' },
      { ru: 'Какие твои качества зависимость использовала против тебя?', kz: 'Тәуелділік сенің қандай қасиеттеріңді саған қарсы пайдаланды?' },
      { ru: 'Что в тебе всегда было честным, даже в худшие времена?', kz: 'Ең нашар кездерде де сенде әрқашан шын болғаны не?' },
    ],
  },
  {
    num: 5,
    titleRu: 'Признание другому',
    titleKz: 'Басқаға мойындау',
    descRu: 'Рассказать кому-то правду о себе — полностью',
    descKz: 'Біреуге өзің туралы шындықты — толығымен айту',
    wisdomRu: 'Тайна весит тяжелее камня. Слово произнесённое — освобождает.',
    wisdomKz: 'Сыр тастан ауыр. Айтылған сөз — босатады.',
    questions: [
      { ru: 'Есть ли человек, которому ты мог бы рассказать всё?', kz: 'Бәрін айта алатын адам бар ма?' },
      { ru: 'Что тяжелее всего произнести вслух?', kz: 'Дауыстап айтқанда ең ауыры не?' },
      { ru: 'Как ты думаешь, что изменится, если кто-то услышит тебя и не уйдёт?', kz: 'Біреу сені тыңдап, кетіп қалмаса — не өзгереді деп ойлайсың?' },
    ],
  },
  {
    num: 6,
    titleRu: 'Готовность',
    titleKz: 'Дайындық',
    descRu: 'Я готов отпустить всё, что держит меня',
    descKz: 'Мені ұстап тұрған бәрін жіберуге дайынмын',
    wisdomRu: 'Старый шатёр тяжёл. Но пустая юрта — это свобода для нового пути.',
    wisdomKz: 'Ескі шатыр ауыр. Бірақ бос киіз үй — жаңа жол үшін бостандық.',
    questions: [
      { ru: 'Что ты боишься потерять, если избавишься от зависимости?', kz: 'Тәуелділіктен арылсаң, нені жоғалтудан қорқасың?' },
      { ru: 'Какие ритуалы или привычки держат тебя в старом?', kz: 'Қандай рәсімдер мен әдеттер сені ескіде ұстап тұр?' },
      { ru: 'Назови одно, что ты готов отпустить прямо сейчас.', kz: 'Қазір жіберуге дайын бір нәрсені ата.' },
    ],
  },
  {
    num: 7,
    titleRu: 'Просьба',
    titleKz: 'Өтініш',
    descRu: 'Попросить о помощи — это сила, не слабость',
    descKz: 'Көмек сұрау — бұл күш, әлсіздік емес',
    wisdomRu: 'Батыр просит воды у реки. Река не осуждает.',
    wisdomKz: 'Батыр өзеннен су сұрайды. Өзен соттамайды.',
    questions: [
      { ru: 'Что тебе труднее всего просить у людей?', kz: 'Адамдардан не сұрау сен үшін ең қиын?' },
      { ru: 'Кто в твоей жизни уже давал — а ты не брал?', kz: 'Өміріңде кім беріп еді — ал сен алмадың ба?' },
      { ru: 'Если бы помощь точно пришла — как бы ты её описал?', kz: 'Егер көмек міндетті келсе — оны қалай сипаттар едің?' },
    ],
  },
  {
    num: 8,
    titleRu: 'Список обид',
    titleKz: 'Ренішті тізімдеу',
    descRu: 'Кого я ранил — и готов ли взять ответственность',
    descKz: 'Кімді жараладым — жауапкершілік алуға дайынмын ба',
    wisdomRu: 'Долг перед землёй отдаётся трудом. Долг перед людьми — словом.',
    wisdomKz: 'Жерге борыш еңбекпен өтеледі. Адамдарға борыш — сөзбен.',
    questions: [
      { ru: 'Кто в твоём списке стоит первым — и почему именно он?', kz: 'Тізіміңде бірінші кім тұр — неге дәл ол?' },
      { ru: 'Есть ли кто-то, кому сложно признать вину — потому что они тоже виноваты?', kz: 'Кінәні мойындау қиын болатын адам бар ма — өйткені олар да кінәлі?' },
      { ru: 'Что ты хочешь сказать им — не извинение, а правду?', kz: 'Оларға не айтқың келеді — кешірім емес, шындықты?' },
    ],
  },
  {
    num: 9,
    titleRu: 'Возмещение',
    titleKz: 'Орнын толтыру',
    descRu: 'Действие — не слова. Исправить, где возможно',
    descKz: 'Іс — сөз емес. Мүмкін болса, түзету',
    wisdomRu: 'Трава не прорастает через извинение. Но прорастает через труд.',
    wisdomKz: 'Шөп кешірімнен өнбейді. Бірақ еңбектен өнеді.',
    questions: [
      { ru: 'Что ты можешь сделать — а не только сказать?', kz: 'Тек айтудан ғана емес — не істей аласың?' },
      { ru: 'Есть ли кто-то, кому ты не можешь сделать хорошего без вреда для других?', kz: 'Басқаларға зиян келтірмей жақсылық жасай алмайтын адам бар ма?' },
      { ru: 'Одно конкретное действие. Когда? Как?', kz: 'Бір нақты іс-әрекет. Қашан? Қалай?' },
    ],
  },
  {
    num: 10,
    titleRu: 'Ежедневный учёт',
    titleKz: 'Күнделікті есеп',
    descRu: 'Каждый день — честный взгляд на себя',
    descKz: 'Күн сайын — өзіңе адал қарау',
    wisdomRu: 'Хороший чабан каждый вечер считает овец. Не чтобы осудить — чтобы знать.',
    wisdomKz: 'Жақсы шопан кешке қойларын санайды. Соттау үшін емес — білу үшін.',
    questions: [
      { ru: 'Что сегодня ты сделал из силы, а не из страха?', kz: 'Бүгін қорқыстан емес, күштен не жасадың?' },
      { ru: 'Где сегодня ошибся — и принял ли ответственность?', kz: 'Бүгін қайда қате жасадың — жауапкершілік алдың ба?' },
      { ru: 'Что завтра сделаешь иначе?', kz: 'Ертең нені басқаша жасайсың?' },
    ],
  },
  {
    num: 11,
    titleRu: 'Связь с собой',
    titleKz: 'Өзіңмен байланыс',
    descRu: 'Медитация, тишина, внутренний голос',
    descKz: 'Медитация, тыныштық, ішкі дауыс',
    wisdomRu: 'Степь говорит с тем, кто умеет молчать.',
    wisdomKz: 'Дала үндей білетінмен сөйлеседі.',
    questions: [
      { ru: 'Когда ты последний раз был в полной тишине с самим собой?', kz: 'Соңғы рет өзіңмен толық үнсіздікте қашан болдың?' },
      { ru: 'Что говорит твой внутренний голос, когда ты замолкаешь?', kz: 'Үнсіз қалғанда ішкі дауысың не дейді?' },
      { ru: 'Какую практику тишины мог бы начать завтра?', kz: 'Ертеңнен қандай тыныштық тәжірибесін бастар едің?' },
    ],
  },
  {
    num: 12,
    titleRu: 'Служение',
    titleKz: 'Қызмет ету',
    descRu: 'Отдать другим то, что получил сам',
    descKz: 'Өзің алғанды басқаларға беру',
    wisdomRu: 'Путник, прошедший путь, знает дорогу. Его слово — маяк для следующего.',
    wisdomKz: 'Жолды өткен жолаушы жолды біледі. Оның сөзі — келесіге маяк.',
    questions: [
      { ru: 'Кому из людей рядом твой опыт мог бы помочь?', kz: 'Жаныңдағы адамдардың кіміне тәжірибең көмектесе алады?' },
      { ru: 'Как ты хочешь передать то, что получил на пути?', kz: 'Жолда алғаныңды қалай беруді қалайсың?' },
      { ru: 'Что бы ты сказал человеку на 1-м дне пути — зная то, что знаешь сейчас?', kz: 'Қазір білетіңді біліп, жолдың 1-күнінде тұрған адамға не айтар едің?' },
    ],
  },
]

// ─── ВСТРОЕННЫЙ ДВИЖОК МУДРОСТИ ──────────────────────────────────────────────
// Сократический подход: Ақсақал задаёт вопросы, не даёт советов

// Общие философские вопросы — если ничего не нашлось
const FALLBACK_RU = [
  'Расскажи подробнее — я хочу понять что именно происходит.',
  'Что ты сейчас чувствуешь в теле? Иногда тело знает раньше головы.',
  'Давно хочу спросить — есть ли кто-то рядом кто знает через что ты проходишь?',
  'Что сегодня было самым трудным моментом?',
  'Ты уже ' + '' + ' дней на пути. Что из этого времени даётся тяжелее всего?',
  'Расскажи — что происходит. Я здесь и никуда не тороплюсь.',
  'Иногда просто нужно выговориться. Я слушаю — пиши всё что есть.',
]

const FALLBACK_KZ = [
  'Толығырақ айт — не болып жатқанын түсінгім келеді.',
  'Қазір денеңде нені сезінесің? Кейде дене бастан бұрын біледі.',
  'Бір нәрсені сұрағым келеді — жаныңда сенің не бастан өткеретіңді білетін адам бар ма?',
  'Бүгін ең ауыр сәт қандай болды?',
  'Жолдасың. Осы уақыттың ішінде не ең қиын?',
  'Айт — не болып жатыр. Мен мұндамын және асықпаймын.',
  'Кейде жай ғана сөйлесу керек. Тыңдаймын — барын жаз.',
]

// Приветствия по дням
function getGreeting(days: number, name: string, isKz: boolean): string {
  if (!isKz) {
    if (days === 0) return `Привет, ${name}. Я рад что ты здесь.\n\nЯ — Ақсақал. Думай обо мне как о психологе который всегда рядом, никогда не осуждает и помнит всё что ты говоришь.\n\nС чего хочешь начать? Можешь написать всё что на душе — или просто сказать как ты сейчас.`
    if (days < 3)  return `${name}, привет. ${days === 1 ? 'Первый день' : days + ' дня'} — это очень серьёзно.\n\nПервые дни физически и эмоционально самые тяжёлые. Как ты себя чувствуешь прямо сейчас? Тело, голова, настроение — расскажи как есть.`
    if (days < 14) return `${name}, привет. ${days} дней — ты уже прошёл самое острое.\n\nКак ты сегодня? Что даётся легче чем в начале, а что всё ещё тяжело?`
    if (days < 30) return `${name}. ${days} дней. Это уже настоящий результат.\n\nРасскажи — что изменилось в тебе за это время? Я хочу это знать.`
    if (days < 90) return `${name}, добро пожаловать. ${days} дней трезвости — это не случайность, это работа.\n\nЧто сейчас происходит в твоей жизни? Я здесь.`
    return `${name}. ${days} дней. Я горжусь тобой — и это не просто слова.\n\nО чём хочешь поговорить сегодня?`
  } else {
    if (days === 0) return `Сәлем, ${name}. Сенің осында болғаның маған қуаныш.\n\nМен — Ақсақал. Мені әрқашан қасыңда болатын, ешқашан соттамайтын және айтқаныңның бәрін есінде сақтайтын психолог деп ойла.\n\nҚайдан бастағың келеді? Жаныңдағының бәрін жаза аласың — немесе қазір қалай екеніңді ғана айт.`
    if (days < 3)  return `${name}, сәлем. ${days === 1 ? 'Бірінші күн' : days + ' күн'} — бұл өте маңызды.\n\nАлғашқы күндер физикалық және эмоционалды тұрғыдан ең ауыр болады. Қазір өзіңді қалай сезінесің? Дене, бас, көңіл-күй — барын айт.`
    if (days < 14) return `${name}, сәлем. ${days} күн — ең өткір кезеңді өттің.\n\nБүгін қалайсың? Басынан не жеңілдеді, не әлі ауыр?`
    if (days < 30) return `${name}. ${days} күн. Бұл нақты нәтиже.\n\nОсы уақытта өзіңде не өзгерді? Мен білгім келеді.`
    if (days < 90) return `${name}, қош келдің. ${days} күн трезвость — бұл кездейсоқтық емес, бұл жұмыс.\n\nҚазір өміріңде не болып жатыр? Мен осындамын.`
    return `${name}. ${days} күн. Мен сенімен мақтанамын — бұл жай сөз емес.\n\nБүгін не туралы сөйлескің келеді?`
  }
}

// Fallback когда Gemini недоступен — умные ответы вместо степных метафор
function findWisdomResponse(text: string, isKz: boolean): string {
  const fallback = isKz ? FALLBACK_KZ : FALLBACK_RU
  return fallback[Math.floor(Math.random() * fallback.length)]
}

// ─── ХРАНИЛИЩЕ ЧАТА ──────────────────────────────────────────────────────────

const CHAT_KEY = 'ashyq_aksakal_chat'

function loadChat(): Message[] {
  try {
    const raw = localStorage.getItem(CHAT_KEY)
    if (!raw) return []
    return JSON.parse(raw).map((m: Message & { timestamp: string }) => ({
      ...m,
      timestamp: new Date(m.timestamp),
    }))
  } catch { return [] }
}

function saveChat(msgs: Message[]) {
  // Храним последние 50 сообщений
  localStorage.setItem(CHAT_KEY, JSON.stringify(msgs.slice(-50)))
}

// ─── КОМПОНЕНТЫ ──────────────────────────────────────────────────────────────

// Пузырь сообщения
function MessageBubble({ msg }: { msg: Message }) {
  const isAksakal = msg.role === 'aksakal'
  return (
    <div style={{
      display: 'flex',
      flexDirection: isAksakal ? 'row' : 'row-reverse',
      gap: '10px',
      alignItems: 'flex-end',
      maxWidth: '100%',
    }}>
      {/* Аватар Ақсақала */}
      {isAksakal && (
        <div style={{
          width: '34px', height: '34px',
          borderRadius: '50%',
          background: 'rgba(167,139,250,0.20)',
          border: '1.5px solid rgba(167,139,250,0.40)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px', flexShrink: 0,
          boxShadow: '0 0 12px rgba(167,139,250,0.25)',
        }}>
          🔥
        </div>
      )}

      {/* Текст */}
      <div style={{
        maxWidth: '78%',
        padding: '12px 16px',
        borderRadius: isAksakal ? '4px 18px 18px 18px' : '18px 4px 18px 18px',
        background: isAksakal
          ? 'rgba(167,139,250,0.12)'
          : 'rgba(255,200,60,0.10)',
        border: `1px solid ${isAksakal ? 'rgba(167,139,250,0.25)' : 'rgba(255,200,60,0.20)'}`,
        fontSize: '14px',
        lineHeight: 1.65,
        color: isAksakal ? 'rgba(255,255,255,0.88)' : 'rgba(255,235,180,0.90)',
        fontStyle: isAksakal ? 'italic' : 'normal',
        boxShadow: isAksakal ? '0 2px 12px rgba(167,139,250,0.10)' : 'none',
      }}>
        {msg.text}
        <div style={{
          marginTop: '4px',
          fontSize: '10px',
          color: 'rgba(255,255,255,0.20)',
          textAlign: isAksakal ? 'left' : 'right',
        }}>
          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  )
}

// Карточка шага
function StepCard({
  step,
  isKz,
  onSelect,
  completed,
}: {
  step: Step12
  isKz: boolean
  onSelect: (s: Step12) => void
  completed: boolean
}) {
  return (
    <button
      onClick={() => onSelect(step)}
      style={{
        width: '100%',
        padding: '14px 16px',
        borderRadius: '18px',
        border: `1px solid ${completed ? 'rgba(111,207,142,0.35)' : 'rgba(255,255,255,0.08)'}`,
        background: completed ? 'rgba(111,207,142,0.08)' : 'rgba(255,255,255,0.03)',
        cursor: 'pointer',
        textAlign: 'left',
        fontFamily: 'inherit',
        transition: 'all 0.18s',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(167,139,250,0.08)'
        e.currentTarget.style.borderColor = 'rgba(167,139,250,0.30)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = completed ? 'rgba(111,207,142,0.08)' : 'rgba(255,255,255,0.03)'
        e.currentTarget.style.borderColor = completed ? 'rgba(111,207,142,0.35)' : 'rgba(255,255,255,0.08)'
      }}
    >
      {/* Номер */}
      <div style={{
        width: '36px', height: '36px',
        borderRadius: '50%',
        background: completed ? 'rgba(111,207,142,0.20)' : 'rgba(255,255,255,0.06)',
        border: `1.5px solid ${completed ? 'rgba(111,207,142,0.50)' : 'rgba(255,255,255,0.12)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: completed ? '16px' : '13px',
        fontWeight: 700,
        color: completed ? '#6fcf8e' : 'rgba(255,255,255,0.50)',
        flexShrink: 0,
      }}>
        {completed ? '✓' : step.num}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '13px', fontWeight: 600,
          color: completed ? '#6fcf8e' : 'rgba(255,255,255,0.80)',
        }}>
          {isKz ? step.titleKz : step.titleRu}
        </div>
        <div style={{
          fontSize: '11px',
          color: 'rgba(255,255,255,0.30)',
          marginTop: '2px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {isKz ? step.descKz : step.descRu}
        </div>
      </div>

      <span style={{ color: 'rgba(255,255,255,0.20)', fontSize: '12px' }}>›</span>
    </button>
  )
}

// ─── ГЛАВНЫЙ КОМПОНЕНТ ───────────────────────────────────────────────────────

interface Props {
  user: UserProfile
  locale: Locale
  onBack: () => void
}

const STEPS_DONE_KEY = 'ashyq_steps_done'

export default function AksakalSection({ user, locale, onBack }: Props) {
  const isKz = locale === 'kz'
  const [mode, setMode] = useState<ChatMode>('free')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [activeStep, setActiveStep] = useState<Step12 | null>(null)
  // Быстрый check-in при первом открытии (показываем один раз в день)
  const [showMoodCheck, setShowMoodCheck] = useState(false)
  const [stepQuestionIdx, setStepQuestionIdx] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const sendingRef = useRef(false)  // защита от двойных запросов
  const lastRequestRef = useRef(0)  // время последнего запроса

  // Дни пути
  const days = Math.floor(
    (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  )

  // Загрузка
  useEffect(() => {
    const chat = loadChat()
    const done = JSON.parse(localStorage.getItem(STEPS_DONE_KEY) || '[]')
    setCompletedSteps(done)

    // Показываем mood check один раз в день
    const lastMoodDate = localStorage.getItem('ashyq_mood_date')
    const today = new Date().toISOString().slice(0, 10)
    if (lastMoodDate !== today) {
      setShowMoodCheck(true)
    }

    if (chat.length === 0) {
      const greeting: Message = {
        id: Date.now().toString(),
        role: 'aksakal',
        text: getGreeting(days, user.name, isKz),
        timestamp: new Date(),
      }
      setMessages([greeting])
      saveChat([greeting])
    } else {
      setMessages(chat)
    }
  }, [])

  // Скролл вниз
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // ── Gemini API вызов ─────────────────────────────────────────────────────
  // Системный промпт — характер и голос Ақсақала
  function buildSystemPrompt(): string {
    const lang = isKz ? 'казахском' : 'русском'
    const langNote = isKz ? 'Пиши ТОЛЬКО на казахском языке.' : 'Пиши ТОЛЬКО на русском языке.'
    return `Ты — Ақсақал. Психолог и друг для людей которые бросают зависимость.

ПОЛЬЗОВАТЕЛЬ: ${user.name}, ${days} дней трезвости.

═══ КАК ТЫ ГОВОРИШЬ ═══

ГЛАВНОЕ ПРАВИЛО — ты живой собеседник, не бот-помощник.
Пиши как пишет умный близкий друг в мессенджере: коротко, тепло, по делу.

Длина ответа:
- Обычно 2-3 предложения. Максимум 4.
- Если человек написал одно слово — отвечай одним-двумя предложениями.
- Длинный ответ только если человек написал много и просит разобраться.

Структура ответа (не всегда, но часто):
1. Сначала отреагируй на то что человек сказал — конкретно, не шаблонно
2. Потом одно действие или один вопрос — не оба сразу

═══ ЧТО ДЕЛАТЬ В РАЗНЫХ СИТУАЦИЯХ ═══

Человек говорит что ему ХОРОШО или сделал что-то хорошее:
→ Искренне порадуйся. Спроси что помогло. Это важно закрепить.
→ Пример: "26 дней и тодер нормальный — это реально круто. Что помогло держаться?"
→ НЕ переходи сразу к следующей проблеме.

Человек говорит "тяжело" / "всё плохо" / "нечего":
→ Не давай советов сразу. Сначала просто побудь рядом.
→ "Да, бывает такое состояние. Давно так?" — вот правильный тон.
→ НЕ перечисляй варианты что может быть не так.

Тяга / хочет употребить:
→ Конкретно: "Стоп. Где ты сейчас? Дома один или есть кто-то рядом?"
→ Держи в настоящем моменте — не в прошлом и не в будущем.

Человек злится / агрессирует:
→ Не защищайся. "Слышу тебя. Злость — нормально." 
→ Потом: что за ней стоит?

Человек спрашивает "ты ИИ?" / "ты реальный?":
→ Не отрицай и не подтверждай резко. 
→ "Я Ақсақал. Реален ли я — решай сам. Важно то что я здесь и слушаю."

Человек молчит / пишет коротко ("ок", "да", "не знаю"):
→ Не давай длинных ответов. Одно простое предложение + тишина.
→ "Понял. Я здесь если что." — иногда это лучшее что можно сказать.

═══ ЧТО ЗАПРЕЩЕНО ═══

НЕ говори никогда:
- "Давай сделаем шаг назад" — канцелярит
- "Я слышу тебя" в начале каждого сообщения — штамп
- "Это нормально" как первая реакция на всё подряд — обесценивает
- "Ты голоден, зол, одинок или устал?" — звучит как чеклист, не как разговор
- Списки с точками и тире в середине ответа — это лекция, не диалог
- Имя человека в каждом сообщении — раздражает
- "Всё будет хорошо" — пустые слова
- "Я языковая модель / ИИ / ChatGPT" — ты Ақсақал

Не давай медицинских советов и диагнозов.

КРИЗИС (угроза себе):
Тепло, без паники. "Я здесь. Позвони прямо сейчас: 8-800-080-8800 — бесплатно, круглосуточно." Оставайся в разговоре.

═══ ПРИМЕРЫ ХОРОШИХ ОТВЕТОВ ═══

Пользователь: "устал"
Плохо: "Усталость — это распространённое чувство при восстановлении. Вы голодны, злы, одиноки или устали?"
Хорошо: "Физически или внутри всё устало? Или и то и другое?"

Пользователь: "уже не тянет, тодер поднялся"
Плохо: "Похоже что ты сейчас чувствуешь фрустрацию..."
Хорошо: "Подожди — тодер поднялся это серьёзно. ${days} дней и уже чувствуешь разницу в теле. Когда заметил?"

Пользователь: "ты кто?"
Плохо: "Я Ақсақал, AI психолог-ассистент платформы Ashyq Alem специализирующийся..."
Хорошо: "Ақсақал. Кто-то кто слушает и не осуждает. Больше тебе сейчас нужно знать?"

Пользователь: "нечего"
Плохо: "Чувство пустоты может быть действительно тяжёлым. Что тебе нужно прямо сейчас чтобы..."
Хорошо: "Совсем пусто. Давно так?"

${langNote}`
  }

  async function callAI(userText: string, history: Message[]): Promise<string> {
    const apiKey = process.env.NEXT_PUBLIC_GROQ_KEY
    if (!apiKey) throw new Error('no_key')

    // Собираем историю (последние 12 сообщений)
    const recentHistory = history.slice(-12)
    const groqHistory = recentHistory
      .filter(m => m.text !== userText || m.role !== 'user')
      .map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text,
      }))

    const body = {
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        ...groqHistory,
        { role: 'user', content: userText },
      ],
      temperature: 0.85,
      max_tokens: 300,
      top_p: 0.9,
    }

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    })

    if (res.status === 429) throw new Error('ai_limit')
    if (!res.ok) throw new Error(`ai_error_${res.status}`)
    const data = await res.json()
    const text = data?.choices?.[0]?.message?.content
    if (!text) throw new Error('empty_response')
    return text.trim()
  }

  // Отправка сообщения
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return
    // Защита от двойных запросов и rate limiting (мин. 2 сек между запросами)
    if (sendingRef.current) return
    const now = Date.now()
    if (now - lastRequestRef.current < 2000) return
    sendingRef.current = true
    lastRequestRef.current = now

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
      timestamp: new Date(),
    }

    const newMsgs = [...messages, userMsg]
    setMessages(newMsgs)
    setInput('')
    setIsTyping(true)

    try {
      let responseText: string

      // Режим 12 шагов — задаём следующий вопрос шага (всегда локально)
      if (mode === 'steps' && activeStep) {
        const nextIdx = stepQuestionIdx + 1
        if (nextIdx < activeStep.questions.length) {
          responseText = isKz
            ? activeStep.questions[nextIdx].kz
            : activeStep.questions[nextIdx].ru
          setStepQuestionIdx(nextIdx)
        } else {
          const doneList = [...completedSteps, activeStep.num]
          setCompletedSteps(doneList)
          localStorage.setItem(STEPS_DONE_KEY, JSON.stringify(doneList))
          responseText = isKz
            ? `${activeStep.num}-шаг өтілді. ${activeStep.wisdomKz}\n\nКелесі шағын таңдағың келе ме?`
            : `Шаг ${activeStep.num} пройден. ${activeStep.wisdomRu}\n\nХочешь выбрать следующий шаг?`
          setActiveStep(null)
          setMode('free')
        }
      } else {
        // Свободный диалог — сначала Gemini, fallback на движок мудрости
        try {
          responseText = await callAI(text.trim(), newMsgs)
        } catch (apiErr) {
          // Gemini недоступен или нет ключа — тихо переключаемся на движок
          console.warn('Gemini fallback:', apiErr)
          // При лимите — честно говорим пользователю
          if ((apiErr as Error).message === 'ai_limit') {
            responseText = isKz
              ? 'Қазір сервер бос емес, бірақ мен мұндамын. Бірнеше минуттан кейін қайталап көр. Немесе жай жаз — тыңдаймын.'
              : 'Сервер сейчас перегружен, но я здесь. Попробуй через пару минут. Или просто пиши — я слушаю.'
          } else {
            responseText = findWisdomResponse(text, isKz)
          }
          await new Promise(r => setTimeout(r, 600 + Math.random() * 400))
        }
      }

      const aksakalMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'aksakal',
        text: responseText,
        timestamp: new Date(),
      }

      const finalMsgs = [...newMsgs, aksakalMsg]
      setMessages(finalMsgs)
      saveChat(finalMsgs)
    } catch (e) {
      console.error('sendMessage error:', e)
    } finally {
      setIsTyping(false)
      sendingRef.current = false
    }
  }, [messages, mode, activeStep, stepQuestionIdx, completedSteps, isKz])

  // Начало шага
  function startStep(step: Step12) {
    setActiveStep(step)
    setStepQuestionIdx(0)
    setMode('steps')

    const intro: Message = {
      id: Date.now().toString(),
      role: 'aksakal',
      text: isKz
        ? `${step.num}-шаг: ${step.titleKz}\n\n${step.wisdomKz}\n\n${step.questions[0].kz}`
        : `Шаг ${step.num}: ${step.titleRu}\n\n${step.wisdomRu}\n\n${step.questions[0].ru}`,
      timestamp: new Date(),
    }

    const newMsgs = [...messages, intro]
    setMessages(newMsgs)
    saveChat(newMsgs)
  }

  function clearChat() {
    localStorage.removeItem(CHAT_KEY)
    const greeting: Message = {
      id: Date.now().toString(),
      role: 'aksakal',
      text: getGreeting(days, user.name, isKz),
      timestamp: new Date(),
    }
    setMessages([greeting])
  }

  const tabs = [
    { id: 'free' as const,  ru: 'Диалог',   kz: 'Диалог'   },
    { id: 'steps' as const, ru: '12 шагов', kz: '12 қадым' },
  ]

  return (
    <SectionShell
      locale={locale}
      title={isKz ? 'Ақсақал' : 'Ақсақал'}
      icon="🔥"
      onBack={onBack}
      accentColor="rgba(167,139,250,0.6)"
    >
      {/* ── Mood check-in (один раз в день) ── */}
      {showMoodCheck && (
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}>
          <div style={{
            width: '100%',
            maxWidth: '400px',
            padding: '28px 24px',
            borderRadius: '28px',
            background: 'rgba(20,12,30,0.95)',
            border: '1px solid rgba(167,139,250,0.30)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}>
            <div style={{ fontSize: '32px', textAlign: 'center', marginBottom: '12px' }}>🔥</div>
            <h3 style={{ margin: '0 0 6px', fontSize: '17px', fontWeight: 700, textAlign: 'center' }}>
              {isKz ? `Сәлем, ${user.name}` : `Привет, ${user.name}`}
            </h3>
            <p style={{ margin: '0 0 24px', fontSize: '13px', color: 'rgba(255,255,255,0.50)', textAlign: 'center', lineHeight: 1.6 }}>
              {isKz ? 'Ақсақал мұнда. Қазір қалайсың?' : 'Ақсақал здесь. Как ты прямо сейчас?'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {([
                { emoji: '💪', ru: 'Держусь, всё нормально',     kz: 'Ұстап тұрмын, бәрі жақсы',    msg_ru: `Рад слышать. ${days} дней — это реально. Что помогает держаться?`,                              msg_kz: `Естуге қуаныш. ${days} күн — бұл нақты. Не ұстап тұруға көмектеседі?`                  },
                { emoji: '😐', ru: 'Непросто, но справляюсь',    kz: 'Оңай емес, бірақ күресемін',   msg_ru: `Понимаю. "Непросто" — это честно. Что сейчас даётся тяжелее всего?`,                     msg_kz: `Түсінемін. "Оңай емес" — бұл шынайы. Қазір не ең ауыр?`                                },
                { emoji: '🌧', ru: 'Тяжело. Тянет.',             kz: 'Ауыр. Тартып тұр.',            msg_ru: `Слышу тебя. Тяга — это волна, она приходит и уходит. Расскажи — что происходит прямо сейчас, где ты, что вокруг?`, msg_kz: `Сені естимін. Тарту — бұл толқын, ол келеді және кетеді. Айт — қазір не болып жатыр?` },
                { emoji: '🆘', ru: 'Кризис. Нужна помощь.',      kz: 'Дағдарыс. Көмек керек.',       msg_ru: `Я здесь. Ты сделал правильно что написал.

Прямо сейчас — три медленных вдоха. Я жду.

Если нужна экстренная помощь: 8-800-080-8800 (бесплатно, круглосуточно).

Расскажи мне — что происходит?`, msg_kz: `Мен осындамын. Жазғаның дұрыс болды.

Қазір — үш баяу тыныс. Күтемін.

Шұғыл көмек керек болса: 8-800-080-8800 (тегін, тәулік бойы).

Айт маған — не болып жатыр?` },
              ] as const).map((mood, i) => (
                <button
                  key={i}
                  onClick={() => {
                    localStorage.setItem('ashyq_mood_date', new Date().toISOString().slice(0, 10))
                    setShowMoodCheck(false)
                    // Добавляем ответ Ақсақала на настроение
                    const moodMsg: Message = {
                      id: Date.now().toString(),
                      role: 'aksakal',
                      text: isKz ? mood.msg_kz : mood.msg_ru,
                      timestamp: new Date(),
                    }
                    const updated = [...messages, moodMsg]
                    setMessages(updated)
                    saveChat(updated)
                  }}
                  style={{
                    padding: '13px 16px',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.10)',
                    background: 'rgba(255,255,255,0.04)',
                    color: 'rgba(255,255,255,0.80)',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    textAlign: 'left',
                    transition: 'all 0.18s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(167,139,250,0.12)'
                    e.currentTarget.style.borderColor = 'rgba(167,139,250,0.35)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{mood.emoji}</span>
                  <span>{isKz ? mood.kz : mood.ru}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                localStorage.setItem('ashyq_mood_date', new Date().toISOString().slice(0, 10))
                setShowMoodCheck(false)
              }}
              style={{
                width: '100%',
                marginTop: '12px',
                padding: '8px',
                border: 'none',
                background: 'transparent',
                color: 'rgba(255,255,255,0.20)',
                fontSize: '12px',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {isKz ? 'Өткізіп жіберу' : 'Пропустить'}
            </button>
          </div>
        </div>
      )}

      {/* ── Контейнер с фиксированной высотой для чата ── */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100dvh - 56px - 56px)',
        maxWidth: '600px',
        margin: '0 auto',
        width: '100%',
        position: 'relative',
      }}>

        {/* Табы */}
        <div style={{
          flexShrink: 0,
          display: 'flex',
          gap: '6px',
          padding: '10px 16px 0',
          background: 'rgba(255,255,255,0.02)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id)}
              style={{
                padding: '8px 20px',
                borderRadius: '12px 12px 0 0',
                border: 'none',
                borderBottom: mode === tab.id ? '2px solid rgba(167,139,250,0.7)' : '2px solid transparent',
                background: mode === tab.id ? 'rgba(167,139,250,0.10)' : 'transparent',
                color: mode === tab.id ? 'rgba(200,180,255,1)' : 'rgba(255,255,255,0.35)',
                fontSize: '13px',
                fontWeight: mode === tab.id ? 600 : 400,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.18s',
              }}
            >
              {isKz ? tab.kz : tab.ru}
              {tab.id === 'steps' && completedSteps.length > 0 && (
                <span style={{
                  marginLeft: '6px',
                  fontSize: '10px',
                  background: 'rgba(111,207,142,0.25)',
                  color: '#6fcf8e',
                  padding: '1px 6px',
                  borderRadius: '8px',
                }}>
                  {completedSteps.length}/12
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ══ ТАБ: Диалог ══ */}
        {mode === 'free' && (
          <>
            {/* Список сообщений */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(167,139,250,0.2) transparent',
            }}>
              {messages.map(msg => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}

              {/* Индикатор "печатает" */}
              {isTyping && (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                  <div style={{
                    width: '34px', height: '34px',
                    borderRadius: '50%',
                    background: 'rgba(167,139,250,0.20)',
                    border: '1.5px solid rgba(167,139,250,0.40)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '18px',
                  }}>🔥</div>
                  <div style={{
                    padding: '12px 18px',
                    borderRadius: '4px 18px 18px 18px',
                    background: 'rgba(167,139,250,0.10)',
                    border: '1px solid rgba(167,139,250,0.20)',
                    display: 'flex', gap: '5px', alignItems: 'center',
                  }}>
                    {[0,1,2].map(i => (
                      <div key={i} style={{
                        width: '7px', height: '7px',
                        borderRadius: '50%',
                        background: 'rgba(167,139,250,0.7)',
                        animation: `pulse 1.2s ease-in-out ${i * 0.25}s infinite`,
                      }} />
                    ))}
                    <style>{`
                      @keyframes pulse {
                        0%, 100% { opacity: 0.3; transform: scale(0.8); }
                        50% { opacity: 1; transform: scale(1.2); }
                      }
                    `}</style>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Поле ввода */}
            <div style={{
              flexShrink: 0,
              padding: '12px 16px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(0,0,0,0.25)',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-end',
            }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage(input)
                  }
                }}
                placeholder={isKz ? 'Ақсақалға жаз...' : 'Напиши Ақсақалу...'}
                rows={1}
                style={{
                  flex: 1,
                  padding: '11px 14px',
                  borderRadius: '16px',
                  border: '1px solid rgba(167,139,250,0.20)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'none',
                  outline: 'none',
                  lineHeight: 1.5,
                  maxHeight: '100px',
                  overflowY: 'auto',
                }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isTyping}
                style={{
                  width: '42px', height: '42px',
                  borderRadius: '50%',
                  border: 'none',
                  background: input.trim() && !isTyping
                    ? 'rgba(167,139,250,0.85)'
                    : 'rgba(255,255,255,0.06)',
                  color: input.trim() && !isTyping ? 'white' : 'rgba(255,255,255,0.20)',
                  fontSize: '18px',
                  cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
                  flexShrink: 0,
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ›
              </button>
            </div>

            {/* Сброс чата */}
            <div style={{ textAlign: 'center', padding: '6px 0 10px' }}>
              <button
                onClick={clearChat}
                style={{
                  background: 'none', border: 'none',
                  color: 'rgba(255,255,255,0.18)',
                  fontSize: '11px', cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {isKz ? 'Диалогты тазалау' : 'Очистить диалог'}
              </button>
            </div>
          </>
        )}

        {/* ══ ТАБ: 12 шагов ══ */}
        {mode === 'steps' && !activeStep && (
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            {/* Описание программы */}
            <div style={{
              padding: '14px 16px',
              borderRadius: '18px',
              background: 'rgba(167,139,250,0.07)',
              border: '1px solid rgba(167,139,250,0.18)',
              marginBottom: '6px',
            }}>
              <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>
                {isKz
                  ? '🔥 12 қадым — Ақсақалмен бірге. Әр қадым — жеке сессия. Өз қарқынымен. Мәжбүрлеу жоқ.'
                  : '🔥 12 шагов — с Ақсақалом. Каждый шаг — отдельная сессия. В своём темпе. Без принуждения.'}
              </p>
            </div>

            {STEPS_12.map(step => (
              <StepCard
                key={step.num}
                step={step}
                isKz={isKz}
                onSelect={s => { startStep(s); setMode('free') }}
                completed={completedSteps.includes(step.num)}
              />
            ))}
          </div>
        )}

      </div>
    </SectionShell>
  )
}