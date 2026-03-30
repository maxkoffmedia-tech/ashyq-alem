// src/components/ErrorPage.tsx
import React from "react";
import Image from "next/image";

interface ErrorPageProps {
  title: string;
  description: string;
  onRetry?: () => void;
}

export default function ErrorPage({ title, description, onRetry }: ErrorPageProps) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      {/* Фон */}
      <Image
        src="/images/backgrounds/steppe_night.png"
        alt="Error background"
        fill
        unoptimized
        style={{ objectFit: "cover", objectPosition: "center" }}
      />

      {/* Контент */}
      <div className="relative z-10 bg-white/80 p-8 rounded-xl shadow-lg text-center max-w-md">
        <h1 className="text-2xl font-bold text-red-700">{title}</h1>
        <p className="mt-2 text-gray-800">{description}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Қайта көру / Повторить
          </button>
        )}
      </div>
    </div>
  );
}
