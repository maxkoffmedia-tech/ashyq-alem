'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  r: number
  vy: number
  vx: number
  alpha: number
  alphaDir: number
  life: number
}

export default function WorldLayer() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let W = window.innerWidth
    let H = window.innerHeight

    function resize() {
      if (!canvas) return
      W = window.innerWidth
      H = window.innerHeight
      const dpr = window.devicePixelRatio || 1
      canvas.width = W * dpr
      canvas.height = H * dpr
      canvas.style.width = W + 'px'
      canvas.style.height = H + 'px'
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    function createParticle(fromBottom = false): Particle {
      return {
        x: Math.random() * W,
        y: fromBottom ? H + Math.random() * 80 : Math.random() * H,
        r: Math.random() * 2.2 + 0.8,
        vy: -(Math.random() * 0.55 + 0.18),
        vx: (Math.random() - 0.5) * 0.28,
        alpha: Math.random() * 0.3 + 0.08,
        alphaDir: Math.random() > 0.5 ? 1 : -1,
        life: Math.random() * Math.PI * 2,
      }
    }

    const COUNT = 55
    const particles: Particle[] = Array.from({ length: COUNT }, () =>
      createParticle(false)
    )

    function frame() {
      ctx!.clearRect(0, 0, W, H)

      for (const p of particles) {
        p.y += p.vy
        p.x += p.vx + Math.sin(p.life) * 0.10
        p.life += 0.016

        // Мерцание
        p.alpha += 0.004 * p.alphaDir
        if (p.alpha >= 0.45) { p.alpha = 0.45; p.alphaDir = -1 }
        if (p.alpha <= 0.05) { p.alpha = 0.05; p.alphaDir = 1 }

        // Ушла вверх — рождаем снизу
        if (p.y < -20) {
          Object.assign(p, createParticle(true))
        }

        // Свечение (радиальный градиент)
        const g = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3)
        g.addColorStop(0, `rgba(255, 240, 160, ${p.alpha})`)
        g.addColorStop(0.5, `rgba(255, 210, 80, ${p.alpha * 0.4})`)
        g.addColorStop(1, `rgba(255, 180, 40, 0)`)

        ctx!.globalAlpha = 1
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2)
        ctx!.fillStyle = g
        ctx!.fill()

        // Яркое ядро
        ctx!.globalAlpha = Math.min(p.alpha * 2, 0.9)
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.r * 0.55, 0, Math.PI * 2)
        ctx!.fillStyle = '#fffbe8'
        ctx!.fill()
      }

      ctx!.globalAlpha = 1
      animId = requestAnimationFrame(frame)
    }

    frame()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  )
}