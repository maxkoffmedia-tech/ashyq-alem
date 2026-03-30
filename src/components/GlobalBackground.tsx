"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function GlobalBackground() {
  const [bg, setBg] = useState("/images/backgrounds/steppe_day.png");

  useEffect(() => {
    const updateBg = () => {
      const h = new Date().getHours();
      if (h >= 6 && h < 17) setBg("/images/backgrounds/steppe_day.png");
      else if (h >= 17 && h < 20)
        setBg("/images/backgrounds/steppe_sunset.png");
      else setBg("/images/backgrounds/steppe_night.png");
    };
    updateBg();
    const id = setInterval(updateBg, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <motion.div
        key={bg}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3 }}
        className="fixed inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})` }}
      />
      <div className="fixed inset-0 -z-10 bg-black/30" />
    </>
  );
}
