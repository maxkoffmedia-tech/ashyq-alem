// src/components/GameIcon.tsx
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface GameIconProps {
  item: {
    name: string;
    icon: string;
    href: string;
  };
  style: React.CSSProperties;
  index: number;
}

export default function GameIcon({ item, style, index }: GameIconProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
      style={style}
      className="absolute transform -translate-x-1/2 -translate-y-1/2"
    >
      <Link href={item.href} className="flex flex-col items-center group cursor-pointer transition-transform hover:scale-110">
        <motion.div
          className="p-2 rounded-full border-2 border-transparent group-hover:border-yellow-400"
          initial={{ boxShadow: '0 0 0 rgba(255, 255, 0, 0)' }}
          animate={{
            boxShadow: '0 0 15px rgba(255, 255, 0, 0.8), inset 0 0 10px rgba(255, 255, 0, 0.6)'
          }}
          transition={{
            repeat: Infinity,
            repeatType: 'reverse',
            duration: 2,
            ease: "easeInOut"
          }}
        >
          <Image
            src={item.icon}
            alt={item.name}
            width={80}
            height={80}
            className="drop-shadow-lg"
          />
        </motion.div>
        <p className="mt-2 text-lg font-semibold drop-shadow-md group-hover:text-yellow-300 transition-colors">
          {item.name}
        </p>
      </Link>
    </motion.div>
  );
}