// app/chat/page.js
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function ChatPage() {
  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-center text-blue-900 mb-8">Раздел "Общение"</h1>
      <p className="text-center text-lg text-gray-700 mb-12 max-w-3xl mx-auto">
        Здесь вы можете найти поддержку и получить ответы на свои вопросы. Выберите, с кем вы хотите поговорить.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
        {/* Карточка: Чат с AI */}
        <Link href="/chat/ai-chat">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Image src="/icon-ai.png" alt="Чат с AI" width={80} height={80} className="mb-4" />
              <h2 className="text-xl font-bold text-gold-600 mb-2">Чат с Акылманом (AI)</h2>
              <p className="text-gray-600">
                Задайте вопрос нашему цифровому мудрецу и получите совет в любое время.
              </p>
            </CardContent>
          </Card>
        </Link>
        
        {/* Карточка: Чат для близких */}
        <Link href="/chat/family-chat">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Image src="/icon-family.png" alt="Чат для близких" width={80} height={80} className="mb-4" />
              <h2 className="text-xl font-bold text-blue-900 mb-2">Чат для близких</h2>
              <p className="text-gray-600">
                Общайтесь с другими людьми, столкнувшимися с проблемой зависимости у родных.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}