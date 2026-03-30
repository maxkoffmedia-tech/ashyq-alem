import MainLayout from "@/components/MainLayout";

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
