"use client";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { ADDICTIONS } from "@/lib/data";

// ─── ТИПЫ ДАННЫХ ──────────────────────────────────────────────────────────
interface AddictionCardProps {
  name: string;
  description: string;
  image: string;
  link: string;
}

// ─── КОМПОНЕНТ КАРТОЧКИ ──────────────────────────────────────────────────
function AddictionCard({ name, description, image, link }: AddictionCardProps) {
  return (
    <Link href={link} className="block">
      <Card className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:scale-105 h-full border-none">
        <CardContent className="flex flex-col items-center text-center p-0">
          {image && (
            <div className="relative w-[60px] h-[60px] mb-4">
              <Image 
                src={image} 
                alt={name} 
                fill
                className="object-contain" 
              />
            </div>
          )}
          <h3 className="text-xl font-bold text-blue-800 mb-2">{name}</h3>
          <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

// ─── ОСНОВНАЯ СТРАНИЦА ───────────────────────────────────────────────────
export default function AddictionsPage() {
  return (
    <div className="container mx-auto p-6 space-y-8 min-h-screen bg-gray-50/50">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        {/* Заменяем проблемный Button на стилизованную ссылку */}
        <Link 
          href="/" 
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
          ← Назад на главную
        </Link>
        
        <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-900 flex-grow">
          Ресурсы для зависимых
        </h1>
        <div className="hidden md:block w-[160px]"></div>
      </div>

      <p className="text-center text-lg text-gray-700 max-w-2xl mx-auto">
        Выберите интересующую вас зависимость, чтобы получить больше информации и поддержки.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ADDICTIONS.map((addiction, index) => (
          <AddictionCard
            key={index}
            name={addiction.name}
            description={addiction.description}
            image={addiction.image}
            link={addiction.link}
          />
        ))}
      </div>

      <footer className="w-full text-center text-gray-400 text-xs mt-12 pb-6">
        Ashyq Alem © 2026 · Информационный ресурс для поддержки
      </footer>
    </div>
  );
}