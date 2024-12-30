"use client";

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

  const transactionColor = (transaction: Transaction) => {
    if (transaction.isIncome) {
      return 'text-green-500';
    } else {
      return 'text-red-500';
    }
  }

  return (
    <>
      <div className="mb-4 mt-4">
        <h1 className="heading-lg">{t('yourTransactions')}</h1>
      </div>
      <ul className="space-y-4">
        {transactions.map((trans: Transaction) => (
          <li key={trans.id} className="list-item">
            <Link href={`/accountDetails/${trans.id}`} className="link-default link-hover">
              <div className="list-item-container">
                <div className="list-tem-label">
                  <div>{trans.label}</div>
                  <div className="text-sm text-gray-500">{trans.category?.name || t('transfer')}</div>
                </div>
                <div className={`text-right ${transactionColor(trans)}`}>
                  <div>
                    {trans.amount.toLocaleString(locale, amountPrecision)}{' '}{trans.account.currency.code}
                  </div>
                  <div className='text-sm text-gray-500'>
                    ({trans.baseCurrencyAmount.toLocaleString(locale, amountPrecision)}{' '}{trans.baseCurrencyCode})
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
