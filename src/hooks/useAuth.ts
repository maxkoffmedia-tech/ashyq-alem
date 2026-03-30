'use client'

import { useEffect, useState, useCallback } from 'react'

export interface UserProfile {
  id: string
  name: string
  locale: 'ru' | 'kz'
  addictionType: AddictionType
  createdAt: string   // ISO date — день старта пути
  avatar?: string     // инициалы или эмодзи
}

export type AddictionType =
  | 'alcohol'
  | 'drugs'
  | 'tobacco'
  | 'gambling'
  | 'gaming'
  | 'social'
  | 'codependency'
  | 'other'

export const ADDICTION_LABELS_RU: Record<AddictionType, string> = {
  alcohol:      'Алкоголь',
  drugs:        'Наркотики',
  tobacco:      'Табак / Вейп',
  gambling:     'Лудомания',
  gaming:       'Игромания',
  social:       'Соцсети / Экраны',
  codependency: 'Я рядом с зависимым',
  other:        'Другое',
}

export const ADDICTION_LABELS_KZ: Record<AddictionType, string> = {
  alcohol:      'Алкоголь',
  drugs:        'Есірткі',
  tobacco:      'Темекі / Вейп',
  gambling:     'Лудомания',
  gaming:       'Ойын тәуелділігі',
  social:       'Әлеуметтік желілер',
  codependency: 'Мен тәуелдімен бірге',
  other:        'Басқа',
}

export const ADDICTION_ICONS: Record<AddictionType, string> = {
  alcohol:      '🍶',
  drugs:        '💊',
  tobacco:      '🚬',
  gambling:     '🎰',
  gaming:       '🎮',
  social:       '📱',
  codependency: '🤝',
  other:        '🌿',
}

const STORAGE_KEY = 'ashyq_user'

function generateId(): string {
  return Math.random().toString(36).slice(2, 10)
}

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Загрузить из localStorage при монтировании
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setUser(JSON.parse(raw))
    } catch {
      // повреждённые данные — игнорируем
    }
    setLoading(false)
  }, [])

  // Сохранить юзера
  const saveUser = useCallback((u: UserProfile) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
    setUser(u)
  }, [])

  // Регистрация
  const register = useCallback((
    name: string,
    addictionType: AddictionType,
    locale: 'ru' | 'kz',
    startDate?: string,
  ) => {
    const profile: UserProfile = {
      id: generateId(),
      name: name.trim() || 'Путник',
      locale,
      addictionType,
      createdAt: startDate ?? new Date().toISOString(),
    }
    saveUser(profile)
  }, [saveUser])

  // Обновить дату старта (при срыве — новая точка)
  const resetPath = useCallback((date?: string) => {
    if (!user) return
    const updated: UserProfile = {
      ...user,
      createdAt: date ?? new Date().toISOString(),
    }
    saveUser(updated)
  }, [user, saveUser])

  // Выход
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }, [])

  return { user, loading, register, resetPath, logout }
}