export default function Loading() {
  return (
    // Добавляем bg-[#0a0a0a], чтобы переход был бесшовным
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="space-y-6 text-center">
        {/* Используем amber-500 (золотистый), он ближе всего к песку Степи */}
        <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto shadow-[0_0_20px_rgba(245,158,11,0.2)]" />
        
        <div className="space-y-2">
          <p className="text-white/80 text-lg font-medium tracking-[0.2em] animate-pulse uppercase">
            Жүктеу...
          </p>
          <p className="text-white/40 text-xs tracking-widest animate-pulse delay-75 uppercase">
            Загрузка пути...
          </p>
        </div>
      </div>
    </div>
  )
}