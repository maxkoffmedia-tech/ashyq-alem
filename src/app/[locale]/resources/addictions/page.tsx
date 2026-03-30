// src/app/resources/addictions/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { ADDICTIONS } from "@/lib/data";

function AddictionCard({ name, description, image, link }) {
  return (
    <Link href={link} className="block">
      <Card className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:scale-105">
        <CardContent className="flex flex-col items-center text-center">
          {image && <Image src={image} alt="" width={60} height={60} className="mb-4" />}
          <h3 className="text-xl font-bold text-blue-800 mb-2">{name}</h3>
          <p className="text-gray-700 text-sm">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function AddictionsPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <Link href="/">
          <Button variant="outline">← Назад на главную</Button>
        </Link>
        <h1 className="text-4xl font-bold text-center text-blue-900 flex-grow">
          Ресурсы для зависимых
        </h1>
        <div className="w-16"></div>
      </div>

      <p className="text-center text-lg text-gray-700">
        Выберите интересующую вас зависимость, чтобы получить больше информации и поддержки.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ADDICTIONS.map((addiction, index) => (
          <AddictionCard
            key={index}
            name={addiction.name}
            description={addiction.description}
            image={addiction.image}
            link={addiction.link} // Ссылка берётся напрямую из данных
          />
        ))}
      </div>
      <footer className="w-full text-center text-gray-500 text-sm mt-8">
        Ashyq Alem © 2025 · Не является заменой мед. помощи
      </footer>
    </div>
  );
}