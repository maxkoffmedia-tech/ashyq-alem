"use client";

import Link from "next/link";

export default function ResourcesPage() {
  return (
    <div className="min-h-screen px-6 py-16 text-white">
      <h1 className="text-4xl font-bold mb-6">Ресурсы</h1>

      <p className="max-w-2xl text-white/80 mb-10">
        Здесь собраны материалы для зависимых, их близких, школ,
        университетов и компаний.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
        <Link href="./addictions" className="block p-6 rounded-xl bg-white/10 hover:bg-white/15 transition">
          Зависимости
        </Link>

        <Link href="./family" className="block p-6 rounded-xl bg-white/10 hover:bg-white/15 transition">
          Для близких
        </Link>

        <Link href="./prevention" className="block p-6 rounded-xl bg-white/10 hover:bg-white/15 transition">
          Профилактика (школы / компании)
        </Link>

        <Link href="./centers" className="block p-6 rounded-xl bg-white/10 hover:bg-white/15 transition">
          Реабилитационные центры
        </Link>
      </div>
    </div>
  );
}
