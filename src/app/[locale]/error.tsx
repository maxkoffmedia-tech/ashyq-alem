// src/app/[locale]/error.tsx
'use client'


import { useEffect } from 'react'
import { useTranslations } from 'next-intl'


export default function Error({
error,
reset,
}: {
error: Error & { digest?: string }
reset: () => void
}) {
const t = useTranslations('error')


useEffect(() => {
console.error('Application error:', error)
}, [error])


return (
<div className="min-h-screen flex items-center justify-center p-4">
<div className="text-center space-y-6 max-w-md">
<div className="text-6xl">😔</div>
<h1 className="text-3xl font-bold text-white">
{t('title')}
</h1>
<p className="text-gray-300">
{t('description')}
</p>
<button
onClick={reset}
className="px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/80 transition"
>
{t('retry')}
</button>
</div>
</div>
)
}