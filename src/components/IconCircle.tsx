'use client'

import { useState } from 'react'
import Image from 'next/image'
import { translations, type Locale } from '@/i18n/translations'

const ICON_IDS = ['path', 'tree', 'mentor', 'aoul', 'map', 'trial'] as const
type IconId = typeof ICON_IDS[number]

// Цвет свечения для каждого раздела
const ACCENT: Record<IconId, string> = {
  path:   '#ffd060',
  tree:   '#6fcf8e',
  mentor: '#a78bfa',
  aoul:   '#f4a261',
  map:    '#60c5fa',
  trial:  '#f87171',
}

interface Props {
  locale: Locale
  onSectionClick?: (id: string) => void
}

function SectionIcon({ id, label, accent, onClick }: {
  id: IconId
  label: string
  accent: string
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setHovered(false)}
      aria-label={label}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
        transform: pressed
          ? 'scale(0.92)'
          : hovered ? 'scale(1.10)' : 'scale(1)',
        transition: 'transform 0.18s cubic-bezier(0.34,1.56,0.64,1)',
      }}
    >
      {/* Круглый контейнер с PNG */}
      <div
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          overflow: 'hidden',
          position: 'relative',
          // Glassmorphism подложка
          background: hovered
            ? `radial-gradient(circle at 35% 35%, ${accent}28, rgba(0,0,0,0.45))`
            : 'rgba(10,20,10,0.50)',
          border: `1.5px solid ${hovered ? accent + '90' : 'rgba(255,255,255,0.16)'}`,
          boxShadow: hovered
            ? `0 0 24px ${accent}50, 0 6px 20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.14)`
            : '0 3px 14px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.08)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          transition: 'all 0.22s ease',
        }}
      >
        {/* PNG иконка */}
        <Image
          src={`/images/icons/${id}.png`}
          alt={label}
          width={60}
          height={60}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            // Лёгкая яркость при hover
            filter: hovered ? 'brightness(1.15)' : 'brightness(0.95)',
            transition: 'filter 0.22s ease',
          }}
          priority={true}
        />

        {/* Блик сверху-слева — как у стекла */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '4px',
            left: '5px',
            width: '20px',
            height: '9px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.18)',
            filter: 'blur(3px)',
            transform: 'rotate(-25deg)',
            pointerEvents: 'none',
            transition: 'opacity 0.22s',
            opacity: hovered ? 0.6 : 1,
          }}
        />

        {/* Цветное свечение поверх при hover */}
        {hovered && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${accent}18 0%, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />
        )}
      </div>

      {/* Подпись */}
      <span
        style={{
          fontSize: '10px',
          fontWeight: 500,
          letterSpacing: '0.05em',
          color: hovered ? accent : 'rgba(255,238,180,0.82)',
          textShadow: '0 1px 5px rgba(0,0,0,0.85)',
          whiteSpace: 'nowrap',
          lineHeight: 1,
          transition: 'color 0.22s ease',
          userSelect: 'none',
        }}
      >
        {label}
      </span>
    </button>
  )
}

export default function IconCircle({ locale, onSectionClick }: Props) {
  const t = translations[locale].icons

  const RADIUS = 118
  const SLOT_W = 80
  const SLOT_H = 86
  const CONTAINER = RADIUS * 2 + SLOT_W  // полный размер с запасом
  const step = (2 * Math.PI) / ICON_IDS.length

  return (
    <div
      style={{
        width: `${CONTAINER}px`,
        height: `${CONTAINER}px`,
        position: 'relative',
        flexShrink: 0,
        transform: 'scale(clamp(0.70, calc(100vw / 400px), 1.0))',
        transformOrigin: 'center center',
      }}
    >
      {/* Декоративное внешнее кольцо */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          width: `${RADIUS * 2 + 8}px`,
          height: `${RADIUS * 2 + 8}px`,
          borderRadius: '50%',
          border: '1px solid rgba(255,210,80,0.10)',
          pointerEvents: 'none',
        }}
      />
      {/* Внутреннее пунктирное кольцо */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          width: `${RADIUS * 1.5}px`,
          height: `${RADIUS * 1.5}px`,
          borderRadius: '50%',
          border: '1px dashed rgba(255,255,255,0.06)',
          pointerEvents: 'none',
        }}
      />

      {ICON_IDS.map((id, i) => {
        const angle = step * i - Math.PI / 2
        const cx = Math.cos(angle) * RADIUS
        const cy = Math.sin(angle) * RADIUS
        const left = CONTAINER / 2 + cx - SLOT_W / 2
        const top  = CONTAINER / 2 + cy - SLOT_H / 2

        return (
          <div
            key={id}
            style={{
              position: 'absolute',
              left: `${left}px`,
              top: `${top}px`,
              width: `${SLOT_W}px`,
              height: `${SLOT_H}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SectionIcon
              id={id}
              label={t[id as IconId]}
              accent={ACCENT[id]}
              onClick={() => onSectionClick?.(id)}
            />
          </div>
        )
      })}
    </div>
  )
}