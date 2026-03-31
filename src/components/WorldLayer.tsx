'use client'
import { useEffect, useRef } from 'react'

export default function WorldLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    // ВОТ ЭТА ПРОВЕРКА СПАСЕТ БИЛД:
    if (!canvas) return 

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Теперь TS знает, что canvas существует
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    class Particle {
      // Используем canvas.width только если canvas точно есть
      x = Math.random() * (canvas?.width || 0)
      y = (canvas?.height || 0) + Math.random() * 100
      size = Math.random() * 2 + 0.5
      speed = Math.random() * 0.5 + 0.2
      opacity = Math.random() * 0.5 + 0.1

      update() {
        this.y -= this.speed
        if (this.y < -10) {
          this.y = (canvas?.height || 0) + 10
          this.x = Math.random() * (canvas?.width || 0)
        }
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const particles: Particle[] = []
    for (let i = 0; i < 50; i++) {
      particles.push(new Particle())
    }

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.update()
        p.draw()
      })
      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-50"
    />
  )
}