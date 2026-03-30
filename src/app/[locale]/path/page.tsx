import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function PathPage() {
  const t = useTranslations("Path");

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center px-6 bg-[url('/images/backgrounds/steppe_night.png')] bg-cover"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">{t("title")}</h1>
      <p className="text-lg md:text-xl max-w-2xl">{t("description")}</p>
      <img src="/images/icon-path.png" alt={t("title")} className="w-24 h-24 my-4" />
    </motion.div>
  );
}