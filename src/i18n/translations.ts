// src/i18n/translations.ts

export type Locale = 'ru' | 'kz'

export const translations = {
  ru: {
    title: 'Ashyq Alem — Ұлы Дала жолы',
    subtitle: 'Путь силы и ясности через культуру Великой Степи',
    dayLabel: 'День пути',
    disclaimer: 'Ashyq Alem © 2025 · Не является заменой медицинской помощи',
    quotes: [
      'Сильный побеждает себя прежде, чем других',
      'Путь начинается с честного выбора',
      'Тишина — тоже движение',
      'Степь не терпит слабости духа',
    ],
    icons: {
      path: 'Путь',
      tree: 'Древо',
      mentor: 'Ақсақал',
      aoul: 'Сообщество',
      map: 'Карта',
      trial: 'Испытания',
    },
  },
  kz: {
    title: 'Ashyq Alem — Ұлы Дала жолы',
    subtitle: 'Ұлы Дала мәдениеті арқылы айқындық пен күш жолы',
    dayLabel: 'Күн жолы',
    disclaimer: 'Ashyq Alem © 2025 · Медициналық көмектің орнын баспайды',
    quotes: [
      'Күшті адам алдымен өзін жеңеді',
      'Жол таңдаудан басталады',
      'Тыныштық — қозғалыс',
      'Дала рух əлсіздігін кешірмейді',
    ],
    icons: {
      path: 'Жол',
      tree: 'Ағаш',
      mentor: 'Ақсақал',
      aoul: 'Қауымдастық',
      map: 'Карта',
      trial: 'Сынақтар',
    },
  },
} as const

export type Translation = typeof translations['ru']