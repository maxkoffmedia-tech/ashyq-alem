'use client'

import { useEffect, useState, useCallback } from 'react'

// Твои типы зависимостей
export type AddictionType =
  | 'alcohol' | 'drugs' | 'tobacco' | 'gambling' 
  | 'gaming' | 'social' | 'codependency' | 'other'

// КОНСТАНТЫ, которые требует AuthModal
export const ADDICTION_ICONS: Record<AddictionType, string> = {
  alcohol: '🍷',
  drugs: '💊',
  tobacco: '🚬',
  gambling: '🎰',
  gaming: '🎮',
  social: '📱',
  codependency: '⛓️',
  other: '🌀'
}

export const ADDICTION_LABELS_RU: Record<AddictionType, string> = {
  alcohol: 'Алкоголь',
  drugs: 'Вещества',
  tobacco: 'Табак',
  gambling: 'Игры / Казино',
  gaming: 'Гейминг',
  social: 'Соцсети',
  codependency: 'Созависимость',
  other: 'Другое'
}

export const ADDICTION_LABELS_KZ: Record<AddictionType, string> = {
  alcohol: 'Алкоголь',
  drugs: 'Заттар',
  tobacco: 'Темекі',
  gambling: 'Құмар ойындар',
  gaming: 'Ойындар',
  social: 'Әлеуметтік желі',
  codependency: 'Тәуелділік',
  other: 'Басқа'
}

export interface UserProfile {
  id: string
  name: string
  locale: 'ru' | 'kz'
  addictionType: AddictionType
  createdAt: string
  avatar?: string     
}

const STORAGE_KEY = 'ashyq_user'
const DIARY_KEY = 'ashyq_diary'

function generateId(): string {
  return Math.random().toString(36).slice(2, 10)
}

function getKazakhstanISO() {
  const date = new Date()
  const offset = 5 * 60 
  const localDate = new Date(date.getTime() + (date.getTimezoneOffset() + offset) * 60000)
  return localDate.toISOString()
}

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setUser(JSON.parse(raw))
    } catch (e) {
      console.error("Ошибка загрузки профиля", e)
    }
    setLoading(false)
  }, [])

  const saveUser = useCallback((u: UserProfile) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
    setUser(u)
  }, [])

  const register = useCallback((
    name: string,
    addictionType: AddictionType,
    locale: 'ru' | 'kz',
    startDate?: string,
  ) => {
    const profile: UserProfile = {
      id: generateId(),
      name: name.trim() || (locale === 'kz' ? 'Жолаушы' : 'Путник'),
      locale,
      addictionType,
      createdAt: startDate ?? getKazakhstanISO(),
    }
    saveUser(profile)
  }, [saveUser])

  const resetPath = useCallback((date?: string) => {
    if (!user) return
    if (confirm(user.locale === 'kz' ? 'Жолды қайтадан бастағыңыз келе ме?' : 'Вы уверены, что хотите начать путь заново?')) {
      localStorage.removeItem(DIARY_KEY) 
      const updated: UserProfile = {
        ...user,
        createdAt: date ?? getKazakhstanISO(),
      }
      saveUser(updated)
      window.location.reload() 
    }
  }, [user, saveUser])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(DIARY_KEY)
    setUser(null)
  }, [])

  return { user, loading, register, resetPath, logout }
}