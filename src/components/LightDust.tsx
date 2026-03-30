'use client'

export default function LightDust() {
  return (
    <div className="absolute inset-0 z-[2] pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,rgba(255,255,255,0.14),transparent_65%)] animate-pulse" />
    </div>
  )
}
