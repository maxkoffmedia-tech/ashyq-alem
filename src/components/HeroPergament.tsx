import Image from "next/image";
import { useState } from "react";

export default function HeroPergament() {
  const [lang, setLang] = useState<"ru" | "kz">("kz");

  return (
    <div className="flex items-center justify-center h-screen pointer-events-none">
      <Image
        src={lang === "kz" ? "/images/pergament_kz.svg" : "/images/pergament_ru.svg"}
        alt="Pergament"
        width={600}
        height={400}
        className="drop-shadow-2xl"
      />
      <div className="absolute bottom-10 flex gap-4 pointer-events-auto">
        <button
          onClick={() => setLang("kz")}
          className="px-4 py-2 bg-yellow-700 text-white rounded-lg"
        >
          KZ
        </button>
        <button
          onClick={() => setLang("ru")}
          className="px-4 py-2 bg-yellow-700 text-white rounded-lg"
        >
          RU
        </button>
      </div>
    </div>
  );
}
