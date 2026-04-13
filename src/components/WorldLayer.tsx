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

    const getW = () => canvas.width
    const getH = () => canvas.height

    const particles: { x: number; y: number; size: number; speed: number; opacity: number }[] = []

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * getW(),
        y: getH() + Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.7 + 0.3,
      })
    }

    let animId: number

    function animate() {
      ctx!.clearRect(0, 0, getW(), getH())
      for (const p of particles) {
        p.y -= p.speed
        if (p.y < -10) {
          p.y = getH() + 10
          p.x = Math.random() * getW()
        }
        ctx!.fillStyle = `rgba(255, 220, 100, ${p.opacity})`
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx!.fill()
      }
      animId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1, opacity: 0.9 }}
    />
  )
}