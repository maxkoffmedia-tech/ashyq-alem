"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ElderPage() {
  const [messages, setMessages] = useState([
    { sender: "aqsaqal", text: "Сәлем, балақай! Қандай сұрақтарың бар? Введи: 1. Советы по трезвости. 2. Ежедневная мотивация." },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { sender: "user", text: input }]);
    const response =
      input === "1"
        ? "Трезвость — степьтің еркіндігі. Әр күні бір қадам."
        : input === "2"
        ? "Мотивация — таңғы шай сияқты, күніне бір рет."
        : "Я не понял твоего вопроса. Попробуй 1 или 2.";
    setMessages((prev) => [...prev, { sender: "aqsaqal", text: response }]);
    setInput("");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/images/backgrounds/steppe.jpg')" }}
    >
      <Navbar />
      <main className="flex flex-col items-center justify-center text-center px-6 py-20">
        <h2 className="text-3xl font-bold mb-6">Ақсақал</h2>
        <motion.div
          className="chat-container p-4 bg-black/40 rounded-lg max-w-2xl w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {messages.map((msg, i) => (
            <p
              key={i}
              className={`p-2 rounded-lg mb-2 ${
                msg.sender === "aqsaqal" ? "bg-gray-700 text-left" : "bg-blue-700 text-right"
              }`}
            >
              {msg.sender === "aqsaqal" ? "Ақсақал: " : "Ты: "}
              {msg.text}
            </p>
          ))}
          <div className="flex gap-2 mt-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Напиши 1 или 2..."
              className="flex-1 p-2 rounded-lg bg-gray-800 text-white"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Отправить
            </button>
          </div>
        </motion.div>
      </main>
      <footer className="absolute bottom-0 w-full text-center text-xs md:text-sm py-4 bg-black/40">
        Ashyq Alem © 2025 · Не является заменой медицинской помощи
      </footer>
    </div>
  );
}