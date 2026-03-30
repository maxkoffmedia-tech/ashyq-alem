'use client'

import Link from "next/link";
import { Card } from "@/components/ui/card"; // Убедись, что путь к Card верный
import { ADDICTIONS } from "@/lib/data";

// 1. Добавляем описание типов для пропсов
interface AddictionCardProps {
  name: string;
  description: string;
  image: string;
  link: string;
}

// 2. Указываем тип в аргументах функции
function AddictionCard({ name, description, image, link }: AddictionCardProps) {
  return (
    <Link href={link} className="block">
      <Card className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:scale-105">
        <div className="relative h-48 mb-4 overflow-hidden rounded-md">
           <img 
             src={image} 
             alt={name} 
             className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
           />
        </div>
        <h3 className="text-xl font-bold mb-2 text-gray-800">{name}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </Card>
    </Link>
  );
}

export default function AddictionsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Виды зависимостей</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ADDICTIONS.map((item) => (
          <AddictionCard 
            key={item.id} 
            name={item.name} 
            description={item.description} 
            image={item.image} 
            link={item.link} 
          />
        ))}
      </div>
    </div>
  );
}