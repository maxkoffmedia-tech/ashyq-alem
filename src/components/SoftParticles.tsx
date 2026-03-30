'use client'

export default function SoftParticles() {
  const items = Array.from({ length: 22 })

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {items.map((_, i) => (
        <div
          key={i}
          className="ashyk-particle"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: '-20px',
            animationDuration: `${10 + Math.random() * 12}s`,
            animationDelay: `${Math.random() * 8}s`,
          }}
        />
      ))}
    </div>
  )
}
