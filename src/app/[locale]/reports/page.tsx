import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

type ReportsPageProps = {
  locale: string;
}

export default function ReportsPage({ locale }: ReportsPageProps) {
  const t = useTranslations('');


  return (
    <>
      <div>
        <ul className="space-y-4">
        <li className="menu-item">
            <Link href="/reports/cash-flow" className="link-default link-hover text-xl">{t('cashFlowReport')}</Link>
          </li>
          <li className="menu-item">
            <Link href="/reports/balance" className="link-default link-hover text-xl">{t('balanceReport')}</Link>
          </li>
          <li className="menu-item">
            <Link href="/reports/expenses-report" className="link-default link-hover text-xl">{t('expensesReport')}</Link>
          </li>
        </ul>
      </div>
    </>
    )
}