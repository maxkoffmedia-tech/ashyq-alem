"use client";

import Link from "next/link";

export default function FamilyResourcesPage() {
  return (
    <main className="min-h-screen w-full px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl space-y-10">

        {/* Заголовок */}
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight">
            Для близких
          </h1>
          <p className="text-white/70 text-base leading-relaxed">
            Зависимость одного человека — это испытание для всей семьи.
            Здесь собраны материалы и опора для тех, кто находится рядом.
          </p>
        </header>

        {/* Блок 1 */}
        <section className="space-y-4 rounded-2xl bg-white/5 p-6">
          <h2 className="text-xl font-medium">
            Что происходит с близкими
          </h2>
          <p className="text-white/70 leading-relaxed">
            Родственники и партнёры часто испытывают тревогу, вину, злость,
            бессилие и хронический стресс. Это нормальная реакция на
            ненормальную ситуацию.
          </p>
          <p className="text-white/70 leading-relaxed">
            Во многих странах считается, что поддержка семьи —
            ключевой фактор выздоровления, но только если семья
            тоже получает помощь.
          </p>
        </section>

        {/* Блок 2 */}
        <section className="space-y-4 rounded-2xl bg-white/5 p-6">
          <h2 className="text-xl font-medium">
            Чего не стоит делать
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-white/70">
            <li>Постоянно контролировать и проверять</li>
            <li>Брать на себя ответственность за чужие решения</li>
            <li>Скрывать проблему от всех</li>
            <li>Жертвовать собственным здоровьем</li>
          </ul>
        </section>

        {/* Блок 3 */}
        <section className="space-y-4 rounded-2xl bg-white/5 p-6">
          <h2 className="text-xl font-medium">
            Что вы можете сделать уже сейчас
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-white/70">
            <li>Получить достоверную информацию о зависимости</li>
            <li>Научиться выстраивать границы</li>
            <li>Поддерживать трезвые усилия, а не срывы</li>
            <li>Общаться с людьми в похожей ситуации</li>
          </ul>
        </section>

        {/* CTA */}
        <section className="rounded-2xl bg-white/10 p-6">
          <h2 className="text-xl font-medium mb-3">
            Вы не одни
          </h2>
          <p className="text-white/70 mb-5">
            Мы создали отдельное безопасное пространство,
            где близкие могут делиться опытом и поддерживать друг друга.
          </p>

          <Link
            href="/chat/family-chat"
            className="inline-block rounded-xl bg-white px-6 py-3 text-black font-medium transition hover:bg-white/90"
          >
            Перейти в чат для близких
          </Link>
        </section>

        {/* Дисклеймер */}
        <footer className="pt-6 text-sm text-white/40">
          Ashyq Alem © 2025 · Информация не является заменой медицинской помощи.
        </footer>

      </div>
    </main>
  );
}
