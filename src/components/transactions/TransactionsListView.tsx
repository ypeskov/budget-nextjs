"use client";

import { useState, useCallback, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { Transaction } from '@/types/transactions';
import { useTranslations } from 'next-intl';
import { getCookie } from '@/utils/cookies';
import { prepareRequestUrl } from '@/utils/transactions';
import routes from '@/routes/routes';

interface TransactionsListViewProps {
  transactions: Transaction[];
  locale: string;
  searchParams: Record<string, string | undefined>;
}

export default function TransactionsListView({ transactions, locale, searchParams }: TransactionsListViewProps) {
  const t = useTranslations('');
  const [transactionList, setTransactionList] = useState<Transaction[]>(transactions);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreTransactions = useCallback(async () => {
    if (loading || !hasMore) return;
  
    setLoading(true);
    try {
      const transactionsUrl = prepareRequestUrl(page, searchParams);
      const authToken = getCookie('authToken');
      const headers: HeadersInit = authToken ? { "auth-token": authToken } : {};
      const response = await fetch(transactionsUrl, { headers });
      const data: Transaction[] = await response.json();
  
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setTransactionList((prev) => {
          const ids = new Set(prev.map((t) => t.id));
          const newTransactions = data.filter((t) => !ids.has(t.id));
          return [...prev, ...newTransactions];
        });
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error loading more transactions:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, searchParams]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        loadMoreTransactions();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMoreTransactions]);

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

  const groupTransactionsByDate = (transactions: Transaction[]) => {
    const grouped: { date: string; transactions: Transaction[] }[] = [];
    let currentGroup: { date: string; transactions: Transaction[] } | null = null;

    for (const transaction of transactions) {
      const transactionDate = new Date(transaction.dateTime).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      if (!currentGroup || currentGroup.date !== transactionDate) {
        currentGroup = { date: transactionDate, transactions: [] };
        grouped.push(currentGroup);
      }

      currentGroup.transactions.push(transaction);
    }

    return grouped;
  };

  return (
    <>
      <div className="mb-4 mt-4">
        <h1 className="heading-lg">{t('yourTransactions')}</h1>
      </div>
      <ul className="space-y-4">
        {groupTransactionsByDate(transactionList).map(({ date, transactions }) => (
          <div key={date}>
            <li className="list-date flex justify-center">
              <div className="text-lg font-semibold text-gray-700 text-center">{date}</div>
            </li>
            {transactions.map((trans) => (
              <li key={trans.id} className="list-item">
                <Link href={routes.transactionDetails({transactionId: trans.id })} className="link-default link-hover">
                  <div className="list-item-container">
                    <div className="list-item-label">
                      <div className="truncate">{trans.label}</div>
                      <div className="text-sm text-gray-500">{trans.category?.name || t('transfer')}</div>
                    </div>
                    <div className={`text-right ${transactionColor(trans)}`}>
                      <div>
                        {trans.amount.toLocaleString(locale, amountPrecision)}{' '}
                        {trans.account.currency.code}
                      </div>
                      <div className="text-sm text-gray-500">
                        ({trans.baseCurrencyAmount.toLocaleString(locale,amountPrecision)}{' '}
                        {trans.baseCurrencyCode})
                      </div>
                      <div className="text-sm text-blue-500">
                        {trans.account.name}&nbsp;|&nbsp;
                        <span className="text-sm text-green-500">{trans.newBalance.toLocaleString(locale, amountPrecision)}&nbsp;
                          {trans.account.currency.code}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </div>
        ))}
      </ul>
    </>
  );
}
