'use client';
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function GamePage() {
  const t = useTranslations("Game"); // Используем новую систему next-intl

  return (
    <div 
      className="min-h-screen bg-cover bg-center text-white flex flex-col items-center justify-center"
      style={{ backgroundImage: "url('/images/backgrounds/steppe.jpg')" }}
    >
      <main className="flex flex-col items-center justify-center text-center px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black/50 p-10 rounded-2xl backdrop-blur-md border border-white/20"
        >
          <h1 className="text-4xl font-bold mb-4">Ұлы Дала Жолы</h1>
          <p className="text-xl mb-6">Ваше путешествие начинается здесь.</p>
          <div className="p-4 bg-blue-600/30 rounded-lg border border-blue-400">
            Раздел игры находится в разработке
          </div>
        </motion.div>
      </main>
    </div>
  );
}

