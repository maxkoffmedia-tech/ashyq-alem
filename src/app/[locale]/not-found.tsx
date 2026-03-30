// src/app/[locale]/not-found.tsx
'use client'


import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Home } from 'lucide-react'


export default function NotFound() {
const t = useTranslations('notFound')


return (
<div className="min-h-screen flex items-center justify-center p-4">
<div className="text-center space-y-6">
<h1 className="text-9xl font-bold text-steppe-sand">404</h1>
<h2 className="text-3xl font-bold text-white">
{t('title')}
</h2>
<p className="text-gray-300">
{t('description')}
</p>
<Link
href="/"
className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary rounded-lg text-white hover:bg-brand-primary/80 transition"
>
<Home size={20} />
{t('backHome')}
</Link>
</div>
</div>
)
}