"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="ru">
      <body className="bg-[#0a0a0a] flex min-h-screen flex-col items-center justify-center text-center p-6">
        <div className="max-w-md space-y-6">
          <h1 className="text-3xl font-black text-amber-500 uppercase tracking-[0.2em] drop-shadow-2xl">
            Жол кесілді
          </h1>
          <p className="text-white/60 italic font-medium">
            Произошла непредвиденная ошибка на пути. Степь окутана туманом, но путь скоро прояснится.
          </p>
          <button
            onClick={() => reset()}
            className="px-10 py-4 bg-amber-600/20 border border-amber-500/40 text-amber-200 rounded-full font-bold uppercase tracking-widest hover:bg-amber-600/40 transition-all active:scale-95 shadow-[0_0_20px_rgba(251,191,36,0.1)]"
          >
            Вернуться на тропу
          </button>
        </div>
      </body>
    </html>
  );
}