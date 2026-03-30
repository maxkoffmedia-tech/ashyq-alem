// src/app/[locale]/loading.tsx
export default function Loading() {
return (
<div className="min-h-screen flex items-center justify-center">
<div className="space-y-4 text-center">
<div className="w-16 h-16 border-4 border-steppe-sand border-t-transparent rounded-full animate-spin mx-auto" />
<p className="text-white text-lg animate-pulse">
Жүктеу... / Загрузка...
</p>
</div>
</div>
)
}