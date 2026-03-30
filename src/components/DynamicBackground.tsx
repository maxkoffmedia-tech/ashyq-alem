'use client'

import { useEffect, useState } from 'react'

type TimeOfDay = 'morning' | 'day' | 'night'

const BG_MAP: Record<TimeOfDay, string> = {
  morning: '/images/backgrounds/world_main.png',
  day:     '/images/backgrounds/world_main1.png',
  night:   '/images/backgrounds/world_main2.png',
}

function getTimeOfDay(): TimeOfDay {
  const h = new Date().getHours()
  if (h >= 5 && h < 10)  return 'morning'
  if (h >= 10 && h < 20) return 'day'
  return 'night'
}

export default function DynamicBackground() {
  const [bg, setBg] = useState(BG_MAP['day']) // SSR-safe дефолт

  useEffect(() => {
    setBg(BG_MAP[getTimeOfDay()])
  }, [])

  return (
    <>
      {/* Основной фон */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -20,
          backgroundImage: `url(${bg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          // Принудительно покрываем весь экран включая notch
          width: '100%',
          height: '100%',
          // Убираем дёргание при смене
          transition: 'background-image 0.8s ease',
        }}
      />
      {/* Градиент снизу — footer всегда читается */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '120px',
          zIndex: -15,
          background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />
      {/* Градиент сверху — header читается */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '100px',
          zIndex: -15,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.40) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />
    </>
  )
}