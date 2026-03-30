// app/centers/page.js
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CENTERS } from "@/lib/data";

export default function Map() {
  return (
    <div className="min-h-screen p-4">
      <h1 className="text-4xl font-bold text-center text-blue-900 mb-8">Карта Надежды</h1>
      <p className="text-center text-lg text-gray-700 mb-12 max-w-3xl mx-auto">
        Здесь будет интерактивная карта реабилитационных центров, а пока вы можете ознакомиться со списком ниже.
      </p>

      {/* Список центров */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CENTERS.map((center, index) => (
          <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-2xl font-bold text-gold-600">{center.name}</h2>
                <Badge variant="default" className="bg-blue-600">{center.rating} ★</Badge>
              </div>
              <p className="text-gray-600 text-sm mb-2">Город: {center.city}</p>
              <p className="text-gray-600 text-sm mb-2">Специализация: {center.specialization}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline" className="text-blue-500 border-blue-500">{center.programs.type}</Badge>
                {center.programs.family && (
                  <Badge variant="outline" className="text-green-500 border-green-500">Для семьи</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}