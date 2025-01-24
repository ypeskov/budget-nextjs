import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import routes from "@/routes/routes";

type ReportsPageProps = {
  params: Promise<Record<string, string | undefined>>;
}

export default async function ReportsPage({ params }: ReportsPageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale || 'en';
  const t = await getTranslations('');


  return (
    <>
      <div>
        <ul className="space-y-4">
          <Link href={routes.cashFlowReport(locale)}>
            <li className="menu-item text-xl">{t('cashFlowReport')}</li>
          </Link>
          <Link href={routes.balanceReport(locale)}>
            <li className="menu-item text-xl">{t('balanceReport')}</li>
          </Link>
          <Link href={routes.expensesReport()}>
            <li className="menu-item text-xl">{t('expensesReport')}</li>
          </Link>
        </ul>
      </div>
    </>
  )
}