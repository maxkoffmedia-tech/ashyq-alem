// src/lib/data.js

export const ADDICTIONS = [
  { name: "Алкоголизм", description: "Всё о зависимости от алкоголя, её причинах, последствиях и методах лечения.", image: "/addictions/alcohol.png", link: "/resources/addictions/alcohol" },
  { name: "Наркомания", description: "Ресурсы для борьбы с наркотической зависимостью и пути к восстановлению.", image: "/addictions/drug.png", link: "/resources/addictions/narcotics" },
  { name: "Лудомания", description: "Помощь для тех, кто страдает от игровой зависимости, и советы по её преодолению.", image: "/addictions/gambling.png", link: "/resources/addictions/gambling" },
  { name: "Табакокурение", description: "Поддержка для желающих бросить курить и начать новую, здоровую жизнь.", image: "/addictions/smoking.png", link: "/resources/addictions/tabacco" },
];

export const REWARDS = [
  { days: 1, reward: "10 очков" },
  { days: 7, reward: "Награда 1" },
  { days: 30, reward: "Награда 2" },
  { days: 90, reward: "Награда 3" },
  { days: 180, reward: "Награда 4" },
  { days: 365, reward: "Награда 5" },
];

export const TREE_STAGES = [
  { days: 0, image: "/tree/stage1.png" },
  { days: 10, image: "/tree/stage2.png" },
  { days: 30, image: "/tree/stage3.png" },
  { days: 90, image: "/tree/stage4.png" },
  { days: 180, image: "/tree/stage5.png" },
  { days: 365, image: "/tree/stage6.png" },
];

export const STEPS = [
  "Шаг 1: Признание",
  "Шаг 2: Помощь",
  "Шаг 3: Сообщество",
  "Шаг 4: Доверие",
  "Шаг 5: Рост",
];