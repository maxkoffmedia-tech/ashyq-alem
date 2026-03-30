"use client";

import { useEffect, useState } from "react";

type Phase = "dawn" | "day" | "dusk" | "night";

export default function SunCycle() {
  const [phase, setPhase] = useState<Phase>("day");

  useEffect(() => {
    const updatePhase = () => {
      const hour = new Date().getHours();

      if (hour >= 5 && hour < 9) setPhase("dawn");
      else if (hour >= 9 && hour < 17) setPhase("day");
      else if (hour >= 17 && hour < 21) setPhase("dusk");
      else setPhase("night");
    };

    updatePhase();
    const timer = setInterval(updatePhase, 60000);
    return () => clearInterval(timer);
  }, []);

  const gradients: Record<Phase, string> = {
    dawn: "from-sky-400/40 via-yellow-200/20 to-transparent",
    day: "from-sky-200/30 via-white/10 to-transparent",
    dusk: "from-orange-400/30 via-pink-300/20 to-transparent",
    night: "from-indigo-900/50 via-black/40 to-transparent",
  };

  return (
    <div
      className={`absolute inset-0 z-[4] pointer-events-none bg-gradient-to-b ${gradients[phase]} transition-all duration-[2000ms]`}
    />
  );
}
