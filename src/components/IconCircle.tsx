'use client'
import { translations } from '@/i18n/translations'
import Image from 'next/image'

interface IconCircleProps {
  locale: string
  onSectionClick: (id: string) => void
}

export default function IconCircle({ locale, onSectionClick }: IconCircleProps) {
  const t = translations[locale as keyof typeof translations] || translations.ru
  const RADIUS = 120
  const SIZE = 290

  const icons = [
    { id: 'path',      label: t.icons?.path   || 'Путь',      src: '/images/icons/path.png',    angle: -90  },
    { id: 'tree',      label: t.icons?.tree   || 'Древо',     src: '/images/icons/tree.png',    angle: -30  },
    { id: 'mentor',    label: t.icons?.mentor || 'Ақсақал',   src: '/images/icons/mentor.png',  angle: 30   },
    { id: 'community', label: t.icons?.aoul   || 'Аул',       src: '/images/icons/aoul.png',    angle: 90   },
    { id: 'map',       label: t.icons?.map    || 'Карта',     src: '/images/icons/map.png',     angle: 150  },
    { id: 'trials',    label: t.icons?.trial  || 'Испытания', src: '/images/icons/trial.png',   angle: 210  },
  ]

  return (
    <div style={{ position: 'relative', width: SIZE, height: SIZE, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <style>{`
        @keyframes spinCW  { to { transform: rotate(360deg);  } }
        @keyframes spinCCW { to { transform: rotate(-360deg); } }
        .icn:hover .icn-c { border-color: rgba(251,191,36,0.6) !important; box-shadow: 0 0 28px rgba(251,191,36,0.30) !important; transform: scale(1.1); }
        .icn:hover .icn-l { color: rgba(255,220,100,1) !important; }
        .icn-c { transition: all 0.3s ease; }
      `}</style>

      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)', animation: 'spinCW 120s linear infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: '40px', borderRadius: '50%', border: '1px solid rgba(251,191,36,0.08)', animation: 'spinCCW 90s linear infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: '80px', height: '80px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,191,36,0.06), transparent)', pointerEvents: 'none' }} />

      {icons.map((item) => {
        const rad = (item.angle * Math.PI) / 180
        const x = SIZE / 2 + RADIUS * Math.cos(rad)
        const y = SIZE / 2 + RADIUS * Math.sin(rad)
        return (
          <button key={item.id} className="icn" onClick={() => onSectionClick(item.id)}
            style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, zIndex: 20 }}
          >
            <div className="icn-c" style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(8,8,8,0.85)', backdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.14)', overflow: 'hidden', position: 'relative', boxShadow: '0 0 20px rgba(0,0,0,0.6)' }}>
              <Image src={item.src} alt={item.label} fill style={{ objectFit: 'cover' }} sizes="72px" />
            </div>
            <span className="icn-l" style={{ fontSize: '9px', color: 'rgba(255,255,255,0.45)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', textShadow: '0 1px 6px rgba(0,0,0,0.9)', whiteSpace: 'nowrap', transition: 'color 0.3s' }}>
              {item.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}