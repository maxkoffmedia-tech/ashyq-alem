'use client'
import { useEffect, useState } from 'react'
export default function DynamicBackground() {
  const [bg, setBg] = useState('/images/backgrounds/world_main.png')
  useEffect(() => {
    const update = () => {
      const h = new Date().getHours()
      if (h >= 5 && h < 17) setBg('/images/backgrounds/world_main.png')
      else if (h >= 17 && h < 21) setBg('/images/backgrounds/world_main1.png')
      else setBg('/images/backgrounds/world_main2.png')
    }
    update()
    const t = setInterval(update, 60000)
    return () => clearInterval(t)
  }, [])
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, background: '#000' }}>
      <img
        src={bg}
        alt=""
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 40%, rgba(0,0,0,0.5) 100%)' }} />
    </div>
  )
}