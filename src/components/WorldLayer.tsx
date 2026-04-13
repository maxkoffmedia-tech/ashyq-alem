'use client'
import { useEffect, useRef } from 'react'
export default function WorldLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    class Particle {
      x = Math.random() * canvas.width
      y = canvas.height + Math.random() * 100
      size = Math.random() * 2 + 0.5
      speed = Math.random() * 0.5 + 0.2
      opacity = Math.random() * 0.7 + 0.3
      update() {
        this.y -= this.speed
        if (this.y < -10) { this.y = canvas.height + 10; this.x = Math.random() * canvas.width }
      }
      draw() {
        ctx.fillStyle = `rgba(255, 220, 100, ${this.opacity})`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    const particles: Particle[] = []
    for (let i = 0; i < 60; i++) particles.push(new Particle())
    let animId: number
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => { p.update(); p.draw() })
      animId = requestAnimationFrame(animate)
    }
    animate()
    const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    window.addEventListener('resize', handleResize)
    return () => { window.removeEventListener('resize', handleResize); cancelAnimationFrame(animId) }
  }, [])
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1, opacity: 0.9 }} />
}