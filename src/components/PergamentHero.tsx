'use client'

export default function PergamentHero({
  title,
  subtitle,
  locale
}: {
  title: string
  subtitle: string
  locale?: string
}) {
  return (
    <div className="relative w-full max-w-3xl px-4">
      <div className="relative mx-auto w-full h-64 sm:h-80 lg:h-96">
        <img
          src="/images/pergament.png"
          alt="Pergament"
          className="w-full h-full object-contain"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center pointer-events-none">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-steppe-night drop-shadow-md">
            {title}
          </h1>
          <p className="mt-2 text-sm md:text-base lg:text-lg text-steppe-night/90">
            {subtitle}
          </p>
          <p className="mt-4 text-xs md:text-sm text-steppe-night/70 max-w-xl">
            {locale === 'kz'
              ? 'Бұл әлеуметтік-мәдени жоба — салауатты өмірге апаратын жол.'
              : 'Этот социально-культурный проект помогает найти путь к трезвости.'}
          </p>
        </div>
      </div>
    </div>
  )
}
