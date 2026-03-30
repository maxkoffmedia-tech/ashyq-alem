// src/components/ui/Stone.js
"use client";

import Image from "next/image";

// Это компонент одного камушка, который будет анимироваться
export default function Stone({ id, index, count }) {
  // Вычисляем случайное положение камушка внутри лунки, чтобы они не накладывались
  const top = Math.random() * 40 + 5;
  const left = Math.random() * 40 + 5;

  return (
    <div
      className="absolute animate-bounce"
      style={{
        top: `${top}px`,
        left: `${left}px`,
        transition: "all 0.5s ease-in-out",
      }}
    >
      <Image
        src="/stone.png" // Используйте здесь ваш файл stone.png
        alt="Камушек"
        width={10}
        height={10}
      />
    </div>
  );
}