import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations('');

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center">{t('welcomeMsg')}</h1>
      </div>
    </div>
  );
}
