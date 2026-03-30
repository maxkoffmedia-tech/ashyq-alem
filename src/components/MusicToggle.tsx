'use client'

import { useEffect, useRef, useState } from 'react'

export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)

  // Создаём audio один раз
  useEffect(() => {
    const audio = new Audio('/kazakh-music.mp3')
    audio.loop = true
    audio.volume = 0.35
    audio.preload = 'auto'

    audio.addEventListener('canplaythrough', () => setReady(true))
    audio.addEventListener('ended', () => setPlaying(false))

    audioRef.current = audio

    // Cleanup при размонтировании
    return () => {
      audio.pause()
      audio.src = ''
      audioRef.current = null
    }
  }, [])

  async function toggle() {
    const audio = audioRef.current
    if (!audio) return

    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      try {
        await audio.play()
        setPlaying(true)
      } catch (e) {
        // Браузер заблокировал автовоспроизведение — ок, пользователь нажмёт ещё раз
        console.warn('Audio play blocked:', e)
      }
    }
  }

  return (
    <button
      onClick={toggle}
      title={playing ? 'Выключить музыку' : 'Включить музыку'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 14px',
        borderRadius: '20px',
        border: `1px solid ${playing ? 'rgba(255,200,60,0.5)' : 'rgba(255,255,255,0.15)'}`,
        background: playing
          ? 'rgba(255,200,60,0.12)'
          : 'rgba(0,0,0,0.30)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        color: 'white',
        cursor: 'pointer',
        fontSize: '13px',
        transition: 'all 0.2s ease',
        outline: 'none',
        userSelect: 'none',
      }}
    >
      {/* Иконка — динамик или нота */}
      <span style={{ fontSize: '16px', lineHeight: 1 }}>
        {playing ? '🔊' : '🔇'}
      </span>

      {/* Анимированные полосы когда играет */}
      {playing && (
        <span style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '14px' }}>
          {[1, 2, 3].map(i => (
            <span
              key={i}
              style={{
                display: 'block',
                width: '3px',
                borderRadius: '2px',
                background: 'rgba(255,200,60,0.9)',
                animation: `musicBar${i} 0.6s ease-in-out infinite alternate`,
                animationDelay: `${(i - 1) * 0.15}s`,
              }}
            />
          ))}
          <style>{`
            @keyframes musicBar1 { from { height: 4px } to { height: 12px } }
            @keyframes musicBar2 { from { height: 8px } to { height: 5px } }
            @keyframes musicBar3 { from { height: 3px } to { height: 10px } }
          `}</style>
        </span>
      )}

      {/* Статус */}
      <span style={{
        fontSize: '11px',
        color: playing ? 'rgba(255,220,100,0.9)' : 'rgba(255,255,255,0.55)',
        letterSpacing: '0.03em',
      }}>
        {!ready ? '...' : playing ? 'Дала' : 'Музыка'}
      </span>
    </button>
  )
}