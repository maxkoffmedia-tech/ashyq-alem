'use client'
import { useMemo } from 'react'

export interface Milestone {
  days: number
  labelRu: string
  labelKz: string
  artifact: string
  color: string
}

export interface DayCounterResult {
  days: number
  hours: number
  minutes: number
  totalHours: number
  milestone: Milestone | null
  nextMilestone: Milestone
  progressToNext: number
}

export const MILESTONES: Milestone[] = [
  { days: 1,   labelRu: 'Первый шаг',      labelKz: 'Бірінші қадам',    artifact: '🌱', color: '#6bcb77' },
  { days: 3,   labelRu: 'Три дня силы',    labelKz: 'Үш күн күш',       artifact: '🌿', color: '#4d9e6d' },
  { days: 7,   labelRu: 'Неделя пути',     labelKz: 'Бір апта жол',     artifact: '🔥', color: '#ffd060' },
  { days: 14,  labelRu: 'Две недели',      labelKz: 'Екі апта',         artifact: '⚡', color: '#f4a261' },
  { days: 21,  labelRu: 'Новая привычка',  labelKz: 'Жаңа әдет',        artifact: '🛡', color: '#e76f51' },
  { days: 30,  labelRu: 'Месяц батыра',    labelKz: 'Батыр айы',        artifact: '🏹', color: '#c77dff' },
  { days: 40,  labelRu: 'Сорок дней',      labelKz: 'Қырық күн',        artifact: '🐎', color: '#9d4edd' },
  { days: 60,  labelRu: 'Два месяца',      labelKz: 'Екі ай',           artifact: '👑', color: '#ffd700' },
  { days: 90,  labelRu: 'Девяносто дней',  labelKz: 'Тоқсан күн',       artifact: '🌙', color: '#48cae4' },
  { days: 180, labelRu: 'Полгода',         labelKz: 'Жарты жыл',        artifact: '⭐', color: '#ade8f4' },
  { days: 365, labelRu: 'Год свободы',     labelKz: 'Бір жыл еркіндік', artifact: '🦅', color: '#ffd060' },
]

export function useDayCounter(startDateIso: string): DayCounterResult {
  return useMemo(() => {
    const start = startDateIso ? new Date(startDateIso).getTime() : Date.now()
    const now = Date.now()
    const diffMs = Math.max(0, now - start)
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60))
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    let milestone: Milestone | null = null
    for (const m of MILESTONES) {
      if (days >= m.days) milestone = m
    }

    const nextMilestone = MILESTONES.find(m => m.days > days) || MILESTONES[MILESTONES.length - 1]
    const prevDays = milestone?.days || 0
    const progressToNext = Math.min(1, (days - prevDays) / Math.max(1, nextMilestone.days - prevDays))

    return { days, hours, minutes, totalHours, milestone, nextMilestone, progressToNext }
  }, [startDateIso])
}