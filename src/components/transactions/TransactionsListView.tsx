"use client";

import { useState, useCallback, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { Transaction } from '@/types/transactions';
import { useTranslations } from 'next-intl';
import { getCookie } from '@/utils/cookies';

interface TransactionsListViewProps {
  transactions: Transaction[];
  locale: string;
  accountId: number;
}

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const transactionsPerPage = Number(process.env.NEXT_PUBLIC_TRANSACTIONS_PER_PAGE);

export default function TransactionsListView({ transactions, locale, accountId }: TransactionsListViewProps) {
  const t = useTranslations("AccountDetailsPage");

  const [transactionList, setTransactionList] = useState<Transaction[]>(transactions);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreTransactions = useCallback(async () => {
    if (loading || !hasMore) return;
  
    setLoading(true);
    try {
      const transactionsUrl = `${apiBaseUrl}/transactions/?accounts=${accountId}`
        + `&per_page=${transactionsPerPage}`
        + `&page=${page}`;
  
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
        setPage((prev) => prev + 1); // Увеличиваем номер страницы
      }
    } catch (error) {
      console.error("Error loading more transactions:", error);
    } finally {
      setLoading(false);
    }
  }, [accountId, page, locale, hasMore, loading]);

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

  return (
    <>
      <div className="mb-4 mt-4">
        <h1 className="heading-lg">{t('yourTransactions')}</h1>
      </div>
      <ul className="space-y-4">
        {transactionList.map((trans: Transaction) => (
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
