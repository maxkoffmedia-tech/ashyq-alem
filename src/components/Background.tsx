"use client";
import { useEffect, useRef } from "react";

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Определяем фон по времени суток
  const getBackgroundImage = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return "/bg_morning.jpg"; // Утро
    if (hour >= 12 && hour < 18) return "/bg_day.jpg"; // День
    return "/bg_night.jpg"; // Ночь
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let particles: { x: number; y: number; size: number; opacity: number; speed: number }[] = [];
    const img = new Image();
    img.src = getBackgroundImage();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2,
        opacity: Math.random(),
        speed: 0.2 + Math.random() * 0.3,
      });
    }

    let offset = 0;
    const animate = () => {
      if (!ctx) return;
      offset += 0.05;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, Math.sin(offset / 50) * 20, 0, canvas.width, canvas.height);

      // Пыль
      particles.forEach((p) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        p.y -= p.speed;
        if (p.y < 0) p.y = window.innerHeight;
      });

      requestAnimationFrame(animate);
    };

    img.onload = animate;

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0" />;
}
