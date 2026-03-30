import Image from "next/image";

const icons = [
  { src: "/images/icons/about.png", label: "О проекте" },
  { src: "/images/icons/community.png", label: "Сообщество" },
  { src: "/images/icons/game.png", label: "Игра" },
  { src: "/images/icons/map.png", label: "Карта" },
  { src: "/images/icons/path.png", label: "Путь" },
  { src: "/images/icons/resources.png", label: "Ресурсы" },
];

export default function NavIcons() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-[500px] h-[500px]">
        {icons.map((icon, index) => {
          const angle = (index / icons.length) * (2 * Math.PI);
          const x = 200 * Math.cos(angle);
          const y = 200 * Math.sin(angle);

          return (
            <div
              key={icon.label}
              className="absolute flex flex-col items-center text-white"
              style={{
                transform: `translate(${250 + x}px, ${250 + y}px)`,
              }}
            >
              <Image src={icon.src} alt={icon.label} width={64} height={64} />
              <span className="mt-2">{icon.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
