'use client'
import DynamicBackground from './DynamicBackground'
import WorldLayer from './WorldLayer'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#000', color: '#fff' }}>
      <DynamicBackground />
      <WorldLayer />
      <main style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, overflow: 'hidden' }}>
        {children}
      </main>
    </div>
  )
}