// src/components/IconWithFallback.tsx
'use client'


import Image from 'next/image'
import { useState } from 'react'
import { BookOpen, TrendingUp, MessageCircle, Users, Map as MapIcon, Gamepad2 } from 'lucide-react'


export default function IconWithFallback({ src, alt, label }: { src: string, alt: string, label: string }) {
const [errored, setErrored] = useState(false)


if (!errored) {
return (
<Image src={src} alt={alt} width={48} height={48} onError={() => setErrored(true)} />
)
}


// fallback to lucide
switch (label) {
case 'resources': return <BookOpen size={28} />
case 'path': return <TrendingUp size={28} />
case 'aqsaqal': return <MessageCircle size={28} />
case 'community': return <Users size={28} />
case 'map': return <MapIcon size={28} />
default: return <Gamepad2 size={28} />
}
}