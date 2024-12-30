import { Link } from '@/i18n/routing';
import { Transaction } from '@/types/transactions';
import { useTranslations } from 'next-intl';

interface TransactionsListViewProps {
  transactions: Transaction[];
  locale: string;
}

export default function TransactionsListView({ transactions, locale }: TransactionsListViewProps) {
  const t = useTranslations("AccountDetailsPage");

  const amountPrecision = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="heading-lg">{t('yourTransactions')}</h1>
      </div>
      <ul className="space-y-4">
        {transactions.map((trans: Transaction) => (
          <li key={trans.id} className="list-item">
            <Link href={`/accountDetails/${trans.id}`} className="link-default link-hover">
              <div className="list-item-container">
                <div className="list-tem-label">{trans.label}</div>
                <div className="text-right">
                  {trans.amount.toLocaleString(locale, amountPrecision)}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
