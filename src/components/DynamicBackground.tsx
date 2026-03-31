'use client'
import { useEffect, useState } from 'react'

export default function DynamicBackground() {
  // По умолчанию ставим главный фон
  const [bg, setBg] = useState('/world_main.png')

  useEffect(() => {
    const updateBackground = () => {
      const hour = new Date().getHours()
      
      // Логика смены твоих .png файлов по времени суток
      if (hour >= 5 && hour < 17) {
        setBg('/world_main.png')   // День (светлый с лучами)
      } else if (hour >= 17 && hour < 21) {
        setBg('/world_main1.png')  // Вечер (туманный с грибами)
      } else {
        setBg('/world_main2.png')  // Ночь (синий лунный)
      }
    }

    updateBackground()
    // Проверяем время каждую минуту, чтобы фон сменился плавно
    const timer = setInterval(updateBackground, 60000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="fixed inset-0 z-[-20] w-full h-full bg-black overflow-hidden">
      <img 
        key={bg}
        src={bg} 
        className="w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out"
        alt="Ұлы Дала Жолы Background"
      />
      {/* Слой затемнения для читаемости интерфейса */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
    </div>
  )
}