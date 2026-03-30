"use client";
import { useState } from "react";
import { Volume2, VolumeX, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function Controls() {
  const [musicOn, setMusicOn] = useState(false);
  const [lang, setLang] = useState("ru");

  return (
    <div className="fixed top-5 right-6 z-20 flex space-x-4">
      {/* Переключатель музыки */}
      <motion.button
        whileHover={{ scale: 1.2 }}
        className={`p-3 rounded-full bg-white/10 backdrop-blur-md shadow-lg transition-all ${
          musicOn ? "text-green-400 glow-green" : "text-white glow-white"
        }`}
        onClick={() => setMusicOn(!musicOn)}
      >
        {musicOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </motion.button>

      {/* Переключатель языка */}
      <motion.button
        whileHover={{ scale: 1.2 }}
        className="p-3 rounded-full bg-white/10 backdrop-blur-md shadow-lg text-white glow-blue"
        onClick={() => setLang(lang === "ru" ? "kz" : "ru")}
      >
        <Globe size={24} />
        <span className="ml-2 font-semibold uppercase">{lang}</span>
      </motion.button>
    </div>
  );
}
