'use client'
import { useEffect, useRef } from 'react'

export default function WorldLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let particles: any[] = []
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    class Particle {
      x = Math.random() * canvas.width
      y = canvas.height + Math.random() * 100
      size = Math.random() * 2 + 0.5
      speed = Math.random() * 0.5 + 0.2
      opacity = Math.random() * 0.5 + 0.2

      update() {
        this.y -= this.speed
        if (this.y < -10) this.y = canvas.height + 10
      }

      draw() {
        if (!ctx) return
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 232, 160, ${this.opacity})`
        ctx.fill()
      }
    }

    const init = () => {
      particles = []
      for (let i = 0; i < 100; i++) particles.push(new Particle())
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => { p.update(); p.draw() })
      requestAnimationFrame(animate)
    }

    window.addEventListener('resize', resize)
    resize()
    init()
    animate()
    return () => window.removeEventListener('resize', resize)
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-[-10] pointer-events-none" />
}