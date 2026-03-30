'use client'

import { useMemo } from 'react'

export interface DayCounterResult {
  days: number          // полных дней с начала пути
  hours: number         // часов текущего дня (0–23)
  minutes: number       // минут текущего часа
  totalHours: number    // всего часов на пути
  milestone: Milestone | null
  nextMilestone: Milestone
  progressToNext: number // 0–1
}

export interface Milestone {
  days: number
  labelRu: string
  labelKz: string
  artifact: string   // эмодзи артефакта
  color: string
}

export const MILESTONES: Milestone[] = [
  { days: 1,   labelRu: 'Первый шаг',         labelKz: 'Бірінші қадам',      artifact: '🌱', color: '#6bcb77' },
  { days: 3,   labelRu: 'Три дня силы',        labelKz: 'Үш күн күш',         artifact: '🌿', color: '#4d9e6d' },
  { days: 7,   labelRu: 'Неделя пути',         labelKz: 'Бір апта жол',       artifact: '🐎', color: '#ffd060' },
  { days: 14,  labelRu: 'Две недели',          labelKz: 'Екі апта',           artifact: '⚔️', color: '#f4a261' },
  { days: 21,  labelRu: 'Батыр',               labelKz: 'Батыр',              artifact: '🔥', color: '#e76f51' },
  { days: 30,  labelRu: 'Месяц ясности',       labelKz: 'Айлық айқындық',     artifact: '🌙', color: '#a8dadc' },
  { days: 40,  labelRu: 'Сорок дней',          labelKz: 'Қырық күн',          artifact: '✨', color: '#ffe66d' },
  { days: 60,  labelRu: 'Два месяца',          labelKz: 'Екі ай',             artifact: '🏔️', color: '#c9ada7' },
  { days: 90,  labelRu: 'Три месяца',          labelKz: 'Үш ай',              artifact: '🦅', color: '#9b5de5' },
  { days: 100, labelRu: 'Сотня',               labelKz: 'Жүз күн',            artifact: '💫', color: '#f15bb5' },
  { days: 180, labelRu: 'Полгода',             labelKz: 'Жарты жыл',          artifact: '🌅', color: '#fee440' },
  { days: 365, labelRu: 'Ұлы Дала — год пути', labelKz: 'Ұлы Дала — бір жыл', artifact: '👑', color: '#ffd700' },
]

export function useDayCounter(startDateISO: string | undefined): DayCounterResult {
  return useMemo(() => {
    const start = startDateISO ? new Date(startDateISO) : new Date()
    const now = new Date()

    const diffMs = now.getTime() - start.getTime()
    const totalHours = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)))
    const days = Math.floor(totalHours / 24)
    const hours = totalHours % 24
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    // Текущий milestone — последний пройденный
    let milestone: Milestone | null = null
    for (const m of MILESTONES) {
      if (days >= m.days) milestone = m
    }

    // Следующий milestone
    const nextMilestone = MILESTONES.find(m => m.days > days) ?? MILESTONES[MILESTONES.length - 1]

    // Прогресс к следующему (0–1)
    const prevDays = milestone?.days ?? 0
    const progressToNext = Math.min(
      1,
      (days - prevDays) / Math.max(1, nextMilestone.days - prevDays)
    )

    return { days, hours, minutes, totalHours, milestone, nextMilestone, progressToNext }
  }, [startDateISO])
}