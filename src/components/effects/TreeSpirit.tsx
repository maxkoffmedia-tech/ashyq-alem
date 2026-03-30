"use client";

import { useEffect, useState } from "react";

export default function TreeSpirit() {
  const [days, setDays] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("path-days");
    const day = stored ? parseInt(stored) : 1;
    localStorage.setItem("path-days", day.toString());
    setDays(day);
  }, []);

  const scale = Math.min(1 + days * 0.02, 1.8);

  return (
    <div
      className="absolute bottom-0 left-1/2 -translate-x-1/2 opacity-20"
      style={{
        transform: `translateX(-50%) scale(${scale})`,
        transition: "transform 2s ease-out"
      }}
    >
      <div className="w-[300px] h-[500px] bg-gradient-to-t from-yellow-400/20 via-green-300/10 to-transparent rounded-full blur-2xl" />
    </div>
  );
}
