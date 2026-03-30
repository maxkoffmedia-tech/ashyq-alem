'use client';
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useState } from "react";

export default function AiChatPage() {
  const t = useTranslations("AiChat");
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<string[]>([]);

  const handleSend = () => {
    if (message.trim()) {
      setChatHistory([...chatHistory, message]);
      setMessage("");
      // Здесь будет интеграция с Grok API
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center px-6 bg-[url('/images/backgrounds/steppe_day.png')] bg-cover"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">{t("title")}</h1>
      <p className="text-lg md:text-xl max-w-2xl mb-8 text-white">{t("description")}</p>
      <div className="w-full max-w-2xl bg-black/40 p-4 rounded-lg">
        <div className="h-64 overflow-y-auto mb-4">
          {chatHistory.map((msg, index) => (
            <div key={index} className="text-left text-white mb-2">
              <span>{msg}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-2 rounded bg-white/10 text-white"
            placeholder={t("placeholder")}
          />
          <button
            onClick={handleSend}
            className="p-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            {t("send")}
          </button>
        </div>
      </div>
    </motion.div>
  );
}